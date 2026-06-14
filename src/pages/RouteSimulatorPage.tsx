import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RouteMapPanel } from '../components/RouteMapPanel';
import { StopSequencePanel } from '../components/StopSequencePanel';
import {
  AlertBanner,
  EmptyState,
  ErrorState,
  KpiCard,
  LoadingPanel,
  PageSection,
  Surface,
} from '../components/ui';
import { usePageTitle } from '../hooks/usePageTitle';
import { useRealtime } from '../hooks/useRealtime';
import { DEFAULT_DEMO_PRESET } from '../lib/demo';
import {
  getDefaultFuelNameForVehicle,
  getFuelCategoryForVehicle,
  getFuelOptionsForVehicle,
  resolveFuelForVehicle,
} from '../lib/fuel';
import {
  formatCo2,
  formatCurrency,
  formatDistance,
  formatLiters,
  formatPercent,
  getFuelDescription,
  getFuelLabel,
  getVehicleLabel,
} from '../lib/formatters';
import { getDrivers } from '../services/drivers.api';
import { getMockAddresses, simulateRoute } from '../services/routes.api';
import type { FuelName, MockLocation, VehicleType } from '../types/ecoroute';

interface RouteSimulatorLocationState {
  useDemoPreset?: boolean;
}

export function RouteSimulatorPage() {
  usePageTitle('Route Simulator');
  const queryClient = useQueryClient();
  const location = useLocation();
  const initialisedRef = useRef(false);
  const locationState = (location.state as RouteSimulatorLocationState | null) ?? null;
  const { connectionStatus, pushLocalEvents } = useRealtime();

  const driversQuery = useQuery({
    queryKey: ['drivers'],
    queryFn: getDrivers,
  });

  const locationsQuery = useQuery({
    queryKey: ['mock-addresses'],
    queryFn: getMockAddresses,
  });

  const [driverId, setDriverId] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('pickup_diesel');
  const [selectedFuelName, setSelectedFuelName] = useState<FuelName>('dexlite');
  const [originLocationId, setOriginLocationId] = useState('');
  const [stopLocationIds, setStopLocationIds] = useState<string[]>([]);
  const [avgSpeedKmh, setAvgSpeedKmh] = useState(74);
  const [submittedScenario, setSubmittedScenario] = useState<{
    vehicleType: VehicleType;
    fuelName: FuelName;
    fuelPricePerLiter: number;
  } | null>(null);

  useEffect(() => {
    if (initialisedRef.current || !driversQuery.data?.length || !locationsQuery.data?.length) {
      return;
    }

    const preset = locationState?.useDemoPreset ? DEFAULT_DEMO_PRESET : null;
    const firstLocation = locationsQuery.data[0];

    setDriverId(preset?.driverId ?? driversQuery.data[0].id);
    setSelectedVehicleType(preset?.vehicleType ?? driversQuery.data[0].vehicle_type);
    setSelectedFuelName(
      preset?.fuelName ?? getDefaultFuelNameForVehicle(preset?.vehicleType ?? driversQuery.data[0].vehicle_type),
    );
    setOriginLocationId(preset?.originLocationId ?? firstLocation.id);
    setStopLocationIds(preset?.stopLocationIds ?? locationsQuery.data.slice(1, 4).map((item) => item.id));
    setAvgSpeedKmh(preset?.avgSpeedKmh ?? 74);
    initialisedRef.current = true;
  }, [driversQuery.data, locationState?.useDemoPreset, locationsQuery.data]);

  const selectedDriver = useMemo(
    () => driversQuery.data?.find((item) => item.id === driverId) ?? null,
    [driverId, driversQuery.data],
  );
  const selectedOrigin = useMemo(
    () => locationsQuery.data?.find((item) => item.id === originLocationId) ?? null,
    [locationsQuery.data, originLocationId],
  );
  const selectedStops = useMemo(
    () =>
      stopLocationIds
        .map((stopId) => locationsQuery.data?.find((item) => item.id === stopId))
        .filter(Boolean) as MockLocation[],
    [locationsQuery.data, stopLocationIds],
  );
  const availableFuelOptions = useMemo(
    () => getFuelOptionsForVehicle(selectedVehicleType),
    [selectedVehicleType],
  );
  const selectedFuelOption = useMemo(
    () => resolveFuelForVehicle(selectedVehicleType, selectedFuelName),
    [selectedFuelName, selectedVehicleType],
  );

  useEffect(() => {
    setStopLocationIds((current) => current.filter((item) => item !== originLocationId));
  }, [originLocationId]);

  useEffect(() => {
    if (!selectedDriver) {
      return;
    }

    setSelectedVehicleType(selectedDriver.vehicle_type);
    setSelectedFuelName(getDefaultFuelNameForVehicle(selectedDriver.vehicle_type));
  }, [driverId, selectedDriver]);

  useEffect(() => {
    const nextFuel = resolveFuelForVehicle(selectedVehicleType, selectedFuelName);
    if (nextFuel.id !== selectedFuelName) {
      setSelectedFuelName(nextFuel.id);
    }
  }, [selectedFuelName, selectedVehicleType]);

  const simulationMutation = useMutation({
    mutationFn: simulateRoute,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      if (connectionStatus !== 'connected') {
        pushLocalEvents(result.notifications);
      }
    },
  });

  if (driversQuery.isLoading || locationsQuery.isLoading) {
    return <LoadingPanel message="Menyiapkan data driver dan mock address untuk simulator..." />;
  }

  if (driversQuery.isError || locationsQuery.isError || !driversQuery.data || !locationsQuery.data) {
    return <ErrorState message="Data driver atau lokasi mock belum tersedia dari backend EcoRoute." />;
  }

  const availableStops = locationsQuery.data.filter((item) => item.id !== originLocationId);
  const simulation = simulationMutation.data;
  const currentOrigin = simulation?.simulation.origin ?? selectedOrigin;
  const baselineStops = simulation?.baselineOrder ?? selectedStops;
  const optimizedStops = simulation?.optimizedOrder ?? selectedStops;
  const showOverspeedWarning = avgSpeedKmh > 80 || simulation?.simulation.speeding_flag === 1;
  const resultScenario = submittedScenario ?? {
    vehicleType: selectedVehicleType,
    fuelName: selectedFuelOption.id,
    fuelPricePerLiter: selectedFuelOption.pricePerLiter,
  };

  const toggleStop = (stopId: string) => {
    setStopLocationIds((current) =>
      current.includes(stopId) ? current.filter((item) => item !== stopId) : [...current, stopId],
    );
  };

  const handleRunSimulation = () => {
    if (!driverId || !originLocationId || stopLocationIds.length === 0) {
      return;
    }

    simulationMutation.mutate({
      driverId,
      originLocationId,
      stopLocationIds,
      avgSpeedKmh,
      vehicleType: selectedVehicleType,
      fuelName: selectedFuelOption.id,
      fuelPricePerLiter: selectedFuelOption.pricePerLiter,
    });
    setSubmittedScenario({
      vehicleType: selectedVehicleType,
      fuelName: selectedFuelOption.id,
      fuelPricePerLiter: selectedFuelOption.pricePerLiter,
    });
  };

  return (
    <div className="page-stack">
      <PageSection
        action={
          <button
            className="primary-button"
            disabled={!driverId || !originLocationId || stopLocationIds.length === 0 || simulationMutation.isPending}
            onClick={handleRunSimulation}
            type="button"
          >
            {simulationMutation.isPending ? 'Menghitung rute...' : 'Jalankan Simulasi'}
          </button>
        }
        description="Pilih driver, origin, dan multi-stop mock Indonesia untuk melihat perbandingan baseline vs rute optimal."
        eyebrow="Core Demo Experience"
        title="Route Simulator Multi-Alamat"
      >
        <div className="simulator-grid">
          <Surface className="form-panel">
            <div className="panel-head">
              <div>
                <p className="section-eyebrow">Scenario Builder</p>
                <h3>Set parameter eco-driving</h3>
              </div>
              {selectedDriver ? (
                <span className="meta-chip">
                  {getVehicleLabel(selectedVehicleType)} • {getFuelLabel(selectedFuelOption.id)}
                </span>
              ) : null}
            </div>

            <label className="field">
              <span>Driver aktif</span>
              <select value={driverId} onChange={(event) => setDriverId(event.target.value)}>
                {driversQuery.data.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} • {getVehicleLabel(driver.vehicle_type)}
                  </option>
                ))}
              </select>
            </label>

            <div className="scenario-glance">
              <div>
                <span>Driver Profile</span>
                <strong>{selectedDriver?.name ?? '-'}</strong>
              </div>
              <div>
                <span>Kendaraan aktif</span>
                <strong>{getVehicleLabel(selectedVehicleType)}</strong>
              </div>
              <div>
                <span>Fuel aktif</span>
                <strong>{getFuelLabel(selectedFuelOption.id)}</strong>
              </div>
              <div>
                <span>Harga / liter</span>
                <strong>{formatCurrency(selectedFuelOption.pricePerLiter)}</strong>
              </div>
            </div>

            <label className="field">
              <span>Jenis kendaraan</span>
              <select
                value={selectedVehicleType}
                onChange={(event) => setSelectedVehicleType(event.target.value as VehicleType)}
              >
                <option value="motorcycle">Motor Kurir</option>
                <option value="pickup_gasoline">Pickup Bensin</option>
                <option value="pickup_diesel">Pickup Diesel</option>
              </select>
            </label>

            <label className="field">
              <span>Jenis bahan bakar</span>
              <select
                value={selectedFuelName}
                onChange={(event) => setSelectedFuelName(event.target.value as FuelName)}
              >
                {availableFuelOptions.map((fuel) => (
                  <option key={fuel.id} value={fuel.id}>
                    {fuel.name} • {formatCurrency(fuel.pricePerLiter)}/L
                  </option>
                ))}
              </select>
              <small className="field-helper">
                {getFuelDescription(selectedFuelOption.id)} Kategori: {getFuelCategoryForVehicle(selectedVehicleType)}.
              </small>
            </label>

            <label className="field">
              <span>Origin distribusi</span>
              <select value={originLocationId} onChange={(event) => setOriginLocationId(event.target.value)}>
                {locationsQuery.data.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="field">
              <span>Kecepatan simulasi: {avgSpeedKmh} km/jam</span>
              <input
                max="100"
                min="40"
                onChange={(event) => setAvgSpeedKmh(Number(event.target.value))}
                type="range"
                value={avgSpeedKmh}
              />
            </div>

            <div className="field">
              <span>Stop pengantaran</span>
              <div className="stop-picker">
                {availableStops.map((item) => {
                  const active = stopLocationIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      className={`stop-chip ${active ? 'active' : ''}`}
                      onClick={() => toggleStop(item.id)}
                      type="button"
                    >
                      <strong>{item.label}</strong>
                      <span>{item.city}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              className="secondary-button"
              onClick={() => {
                setDriverId(DEFAULT_DEMO_PRESET.driverId);
                setSelectedVehicleType(DEFAULT_DEMO_PRESET.vehicleType);
                setSelectedFuelName(DEFAULT_DEMO_PRESET.fuelName);
                setOriginLocationId(DEFAULT_DEMO_PRESET.originLocationId);
                setStopLocationIds(DEFAULT_DEMO_PRESET.stopLocationIds);
                setAvgSpeedKmh(DEFAULT_DEMO_PRESET.avgSpeedKmh);
              }}
              type="button"
            >
              Load Mentor Demo
            </button>
          </Surface>

          <div className="simulator-visual-stack">
            {showOverspeedWarning ? (
              <AlertBanner
                event={{
                  type: 'overspeed_warning',
                  severity: 'warning',
                  title: 'Over-speeding warning',
                  message:
                    'Kecepatan di atas 80 km/jam meningkatkan konsumsi BBM hingga 14% dan menurunkan efisiensi eco-driving.',
                }}
              />
            ) : null}

            <RouteMapPanel baselineStops={baselineStops} optimizedStops={optimizedStops} origin={currentOrigin} />
            <StopSequencePanel baselineStops={baselineStops} optimizedStops={optimizedStops} />
          </div>
        </div>
      </PageSection>

      {simulationMutation.isError ? (
        <ErrorState message={(simulationMutation.error as Error).message} />
      ) : null}

      {simulation ? (
        <>
          <div className="kpi-grid">
            <KpiCard
              hint="Rute awal sebelum optimasi"
              label="Baseline Distance"
              value={formatDistance(simulation.summary.baselineDistanceKm)}
            />
            <KpiCard
              hint="Rute terbaik hasil EcoRoute"
              label="Optimized Distance"
              tone="accent"
              value={formatDistance(simulation.summary.optimizedDistanceKm)}
            />
            <KpiCard
              hint="Poin hijau untuk driver"
              label="Points Earned"
              tone="accent"
              value={`${simulation.summary.pointsEarned} pts`}
            />
            <KpiCard
              hint="Tingkat keberhasilan optimasi"
              label="Success Rate"
              value={formatPercent(simulation.summary.successRatePercent)}
            />
          </div>

          <div className="feature-grid two-up">
            <Surface className="results-card">
              <p className="section-eyebrow">Savings Impact</p>
              <h3>Penghematan hasil simulasi terbaru</h3>
              <div className="driver-stat-list">
                <div>
                  <span>Jarak Hemat</span>
                  <strong>{formatDistance(simulation.summary.distanceSavedKm)}</strong>
                </div>
                <div>
                  <span>Fuel Saved</span>
                  <strong>{formatLiters(simulation.summary.fuelSavedLiters)}</strong>
                </div>
                <div>
                  <span>Cost Saved</span>
                  <strong>{formatCurrency(simulation.summary.moneySavedIdr)}</strong>
                </div>
                <div>
                  <span>CO2 Reduced</span>
                  <strong>{formatCo2(simulation.summary.co2ReducedKg)}</strong>
                </div>
              </div>
            </Surface>

            <Surface className="results-card">
              <p className="section-eyebrow">Driver Update</p>
              <h3>{simulation.driver.name} selesai menyelesaikan rute eco-driving</h3>
              <div className="driver-stat-list">
                <div>
                  <span>Total Poin Driver</span>
                  <strong>{simulation.driver.points}</strong>
                </div>
                <div>
                  <span>Vehicle Profile</span>
                  <strong>{getVehicleLabel(resultScenario.vehicleType)}</strong>
                </div>
                <div>
                  <span>Fuel Scenario</span>
                  <strong>{getFuelLabel(resultScenario.fuelName)}</strong>
                </div>
                <div>
                  <span>Fuel Price</span>
                  <strong>{formatCurrency(resultScenario.fuelPricePerLiter)}/L</strong>
                </div>
                <div>
                  <span>Avg Speed</span>
                  <strong>{simulation.summary.avgSpeedKmh} km/jam</strong>
                </div>
              </div>
            </Surface>
          </div>
        </>
      ) : (
        <EmptyState
          action={
            <button className="primary-button" onClick={handleRunSimulation} type="button">
              Jalankan Simulasi Pertama
            </button>
          }
          description="Route map sudah menampilkan skenario seed. Jalankan simulasi untuk melihat perbandingan baseline, poin, dan notifikasi realtime."
          title="Simulator siap dipresentasikan"
        />
      )}
    </div>
  );
}
