import type {
  AnalyticsOverview,
  Driver,
  FuelName,
  LeaderboardEntry,
  MockLocation,
  NotificationEvent,
  Reward,
  RewardRedemption,
  SimulationResult,
  StoredRouteSimulation,
  VehicleType,
} from '../types/ecoroute';
import { resolveFuelForVehicle } from '../lib/fuel';
import type { SimulateRoutePayload } from './routes.api';

const vehicleDefaults: Record<VehicleType, { baseKmPerLiter: number; co2FactorPerLiter: number; fuelType: 'gasoline' | 'diesel' }> = {
  motorcycle: { baseKmPerLiter: 50, co2FactorPerLiter: 2.35, fuelType: 'gasoline' },
  pickup_gasoline: { baseKmPerLiter: 14, co2FactorPerLiter: 2.35, fuelType: 'gasoline' },
  pickup_diesel: { baseKmPerLiter: 14, co2FactorPerLiter: 2.69, fuelType: 'diesel' },
};

const milestoneThresholds = [1000, 2500, 5000];

const drivers: Driver[] = [
  {
    id: 'drv_001',
    name: 'Rizky Pratama',
    vehicle_type: 'motorcycle',
    fuel_type: 'gasoline',
    base_km_per_liter: 50,
    fuel_price_per_liter: 16250,
    co2_factor_per_liter: 2.35,
    points: 1180,
    total_distance_saved_km: 72.4,
    total_fuel_saved_liters: 1.45,
    total_money_saved_idr: 23562.5,
    total_co2_reduced_kg: 3.41,
    total_routes: 4,
    created_at: '2026-06-12T07:00:00.000Z',
    updated_at: '2026-06-14T05:00:00.000Z',
  },
  {
    id: 'drv_002',
    name: 'Bagus Saputra',
    vehicle_type: 'pickup_gasoline',
    fuel_type: 'gasoline',
    base_km_per_liter: 14,
    fuel_price_per_liter: 16250,
    co2_factor_per_liter: 2.35,
    points: 2540,
    total_distance_saved_km: 132.1,
    total_fuel_saved_liters: 9.44,
    total_money_saved_idr: 153400,
    total_co2_reduced_kg: 22.18,
    total_routes: 6,
    created_at: '2026-06-12T07:00:00.000Z',
    updated_at: '2026-06-14T05:00:00.000Z',
  },
  {
    id: 'drv_003',
    name: 'Lailatul Hasanah',
    vehicle_type: 'pickup_diesel',
    fuel_type: 'diesel',
    base_km_per_liter: 14,
    fuel_price_per_liter: 23000,
    co2_factor_per_liter: 2.69,
    points: 3410,
    total_distance_saved_km: 166.8,
    total_fuel_saved_liters: 11.91,
    total_money_saved_idr: 273930,
    total_co2_reduced_kg: 32.04,
    total_routes: 7,
    created_at: '2026-06-12T07:00:00.000Z',
    updated_at: '2026-06-14T05:00:00.000Z',
  },
  {
    id: 'drv_004',
    name: 'Dimas Kurniawan',
    vehicle_type: 'motorcycle',
    fuel_type: 'gasoline',
    base_km_per_liter: 50,
    fuel_price_per_liter: 16250,
    co2_factor_per_liter: 2.35,
    points: 870,
    total_distance_saved_km: 44.2,
    total_fuel_saved_liters: 0.88,
    total_money_saved_idr: 14300,
    total_co2_reduced_kg: 2.07,
    total_routes: 3,
    created_at: '2026-06-12T07:00:00.000Z',
    updated_at: '2026-06-14T05:00:00.000Z',
  },
  {
    id: 'drv_005',
    name: 'Nanda Putri',
    vehicle_type: 'pickup_gasoline',
    fuel_type: 'gasoline',
    base_km_per_liter: 14,
    fuel_price_per_liter: 16250,
    co2_factor_per_liter: 2.35,
    points: 1960,
    total_distance_saved_km: 98.7,
    total_fuel_saved_liters: 7.05,
    total_money_saved_idr: 114562.5,
    total_co2_reduced_kg: 16.57,
    total_routes: 5,
    created_at: '2026-06-12T07:00:00.000Z',
    updated_at: '2026-06-14T05:00:00.000Z',
  },
  {
    id: 'drv_006',
    name: 'Yoga Fajar',
    vehicle_type: 'pickup_diesel',
    fuel_type: 'diesel',
    base_km_per_liter: 14,
    fuel_price_per_liter: 23000,
    co2_factor_per_liter: 2.69,
    points: 1425,
    total_distance_saved_km: 81.3,
    total_fuel_saved_liters: 5.81,
    total_money_saved_idr: 133630,
    total_co2_reduced_kg: 15.63,
    total_routes: 4,
    created_at: '2026-06-12T07:00:00.000Z',
    updated_at: '2026-06-14T05:00:00.000Z',
  },
];

const locations: MockLocation[] = [
  { id: 'loc_001', label: 'Gudang Kota Malang', city: 'Kota Malang', province: 'Jawa Timur', latitude: -7.9817, longitude: 112.6304, category: 'warehouse' },
  { id: 'loc_002', label: 'Lowokwaru Distribution Hub', city: 'Malang', province: 'Jawa Timur', latitude: -7.9446, longitude: 112.6133, category: 'hub' },
  { id: 'loc_003', label: 'Blimbing Retail Cluster', city: 'Malang', province: 'Jawa Timur', latitude: -7.9399, longitude: 112.6522, category: 'retail' },
  { id: 'loc_004', label: 'Klojen Service Point', city: 'Malang', province: 'Jawa Timur', latitude: -7.9771, longitude: 112.6309, category: 'service' },
  { id: 'loc_005', label: 'Singosari Fulfillment', city: 'Malang', province: 'Jawa Timur', latitude: -7.8925, longitude: 112.6658, category: 'warehouse' },
  { id: 'loc_006', label: 'Kepanjen Market Node', city: 'Malang', province: 'Jawa Timur', latitude: -8.1319, longitude: 112.5744, category: 'market' },
  { id: 'loc_007', label: 'Batu Fresh Produce Center', city: 'Batu', province: 'Jawa Timur', latitude: -7.8719, longitude: 112.5267, category: 'market' },
  { id: 'loc_008', label: 'Pakis Industrial Gate', city: 'Malang', province: 'Jawa Timur', latitude: -7.9346, longitude: 112.7317, category: 'industrial' },
  { id: 'loc_009', label: 'Lawang Transit Point', city: 'Malang', province: 'Jawa Timur', latitude: -7.8352, longitude: 112.6942, category: 'transit' },
  { id: 'loc_010', label: 'Sidoarjo Retail Warehouse', city: 'Sidoarjo', province: 'Jawa Timur', latitude: -7.4478, longitude: 112.7183, category: 'warehouse' },
  { id: 'loc_011', label: 'Surabaya Port Logistic Point', city: 'Surabaya', province: 'Jawa Timur', latitude: -7.2575, longitude: 112.7521, category: 'port' },
  { id: 'loc_012', label: 'Karangploso Partner Outlet', city: 'Malang', province: 'Jawa Timur', latitude: -7.8911, longitude: 112.5839, category: 'partner' },
];

const rewards: Reward[] = [
  { id: 'rwd_001', name: 'Voucher BBM Rp50.000', points_required: 1000, reward_type: 'fuel_voucher', reward_value_label: 'Rp50.000', description: 'Voucher BBM digital untuk pengisian operasional harian.', is_active: 1 },
  { id: 'rwd_002', name: 'Voucher BBM Rp150.000', points_required: 2500, reward_type: 'fuel_voucher', reward_value_label: 'Rp150.000', description: 'Voucher BBM digital untuk armada dengan poin tinggi.', is_active: 1 },
  { id: 'rwd_003', name: 'Paket Data 50GB', points_required: 5000, reward_type: 'data_package', reward_value_label: '50GB', description: 'Paket data untuk menunjang operasional driver dan kurir.', is_active: 1 },
];

const routeSimulations: StoredRouteSimulation[] = [
  {
    id: 'sim_001',
    driver_id: 'drv_001',
    origin_location_id: 'loc_001',
    vehicle_type: 'motorcycle',
    fuel_type: 'gasoline',
    baseline_distance_km: 28.4,
    optimized_distance_km: 22.1,
    distance_saved_km: 6.3,
    fuel_saved_liters: 0.13,
    money_saved_idr: 2112.5,
    co2_reduced_kg: 0.31,
    avg_speed_kmh: 54,
    speeding_flag: 0,
    points_earned: 108,
    success_rate_percent: 22.18,
    reward_milestone_unlocked: null,
    created_at: '2026-06-12T08:15:00.000Z',
    origin: locations.find((item) => item.id === 'loc_001'),
    stops: [
      { ...locations.find((item) => item.id === 'loc_004')!, stop_order_input: 1, stop_order_optimized: 2 },
      { ...locations.find((item) => item.id === 'loc_003')!, stop_order_input: 2, stop_order_optimized: 1 },
    ],
  },
  {
    id: 'sim_002',
    driver_id: 'drv_003',
    origin_location_id: 'loc_011',
    vehicle_type: 'pickup_diesel',
    fuel_type: 'diesel',
    baseline_distance_km: 118.6,
    optimized_distance_km: 91.4,
    distance_saved_km: 27.2,
    fuel_saved_liters: 1.94,
    money_saved_idr: 44620,
    co2_reduced_kg: 5.22,
    avg_speed_kmh: 78,
    speeding_flag: 0,
    points_earned: 317,
    success_rate_percent: 22.93,
    reward_milestone_unlocked: '2500',
    created_at: '2026-06-12T10:45:00.000Z',
    origin: locations.find((item) => item.id === 'loc_011'),
    stops: [
      { ...locations.find((item) => item.id === 'loc_010')!, stop_order_input: 1, stop_order_optimized: 1 },
      { ...locations.find((item) => item.id === 'loc_009')!, stop_order_input: 2, stop_order_optimized: 3 },
      { ...locations.find((item) => item.id === 'loc_007')!, stop_order_input: 3, stop_order_optimized: 2 },
    ],
  },
  {
    id: 'sim_003',
    driver_id: 'drv_005',
    origin_location_id: 'loc_005',
    vehicle_type: 'pickup_gasoline',
    fuel_type: 'gasoline',
    baseline_distance_km: 54.8,
    optimized_distance_km: 45.3,
    distance_saved_km: 9.5,
    fuel_saved_liters: 0.68,
    money_saved_idr: 11050,
    co2_reduced_kg: 1.6,
    avg_speed_kmh: 84,
    speeding_flag: 1,
    points_earned: 90,
    success_rate_percent: 17.34,
    reward_milestone_unlocked: null,
    created_at: '2026-06-13T06:20:00.000Z',
    origin: locations.find((item) => item.id === 'loc_005'),
    stops: [
      { ...locations.find((item) => item.id === 'loc_012')!, stop_order_input: 1, stop_order_optimized: 1 },
      { ...locations.find((item) => item.id === 'loc_002')!, stop_order_input: 2, stop_order_optimized: 3 },
      { ...locations.find((item) => item.id === 'loc_008')!, stop_order_input: 3, stop_order_optimized: 2 },
    ],
  },
];

const notifications: NotificationEvent[] = [
  {
    id: 'ntf_001',
    driverId: 'drv_003',
    routeSimulationId: 'sim_002',
    type: 'reward_milestone',
    severity: 'success',
    title: 'Milestone 2500 poin tercapai',
    message: 'Lailatul Hasanah berhasil melewati ambang 2500 poin eco-driving.',
    createdAt: '2026-06-12T10:46:00.000Z',
  },
  {
    id: 'ntf_002',
    driverId: 'drv_005',
    routeSimulationId: 'sim_003',
    type: 'overspeed_warning',
    severity: 'warning',
    title: 'Kecepatan melebihi batas aman',
    message: 'Kecepatan di atas 80 km/jam meningkatkan konsumsi BBM dan mengurangi efisiensi eco-driving.',
    createdAt: '2026-06-13T06:20:30.000Z',
  },
];

const redemptions: RewardRedemption[] = [];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function distanceKm(a: MockLocation, b: MockLocation) {
  const earthRadius = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const value =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function calculatePathDistance(origin: MockLocation, stops: MockLocation[]) {
  let previous = origin;
  return Number(
    stops
      .reduce((sum, stop) => {
        const next = sum + distanceKm(previous, stop);
        previous = stop;
        return next;
      }, 0)
      .toFixed(2),
  );
}

function nearestNeighbor(origin: MockLocation, stops: MockLocation[]) {
  const pool = [...stops];
  const ordered: MockLocation[] = [];
  let current = origin;

  while (pool.length > 0) {
    const sorted = [...pool].sort((left, right) => distanceKm(current, left) - distanceKm(current, right));
    const next = sorted[0];
    ordered.push(next);
    current = next;
    pool.splice(pool.findIndex((item) => item.id === next.id), 1);
  }

  return ordered;
}

function calculatePoints(distanceSavedKm: number, avgSpeedKmh: number) {
  const basePoints = Math.floor(distanceSavedKm * 10);
  const bonusSpeedSafe = avgSpeedKmh <= 80 ? 20 : 0;
  const bonusNoOverspeed = avgSpeedKmh <= 80 ? 15 : 0;
  const bonusFollowRoute = 10;
  const penaltyOverspeed = avgSpeedKmh > 80 ? 15 : 0;
  return Math.max(0, basePoints + bonusSpeedSafe + bonusNoOverspeed + bonusFollowRoute - penaltyOverspeed);
}

function getDriverOrThrow(driverId: string) {
  const driver = drivers.find((item) => item.id === driverId);
  if (!driver) {
    throw new Error('Driver tidak ditemukan');
  }
  return driver;
}

function getLocationOrThrow(locationId: string) {
  const location = locations.find((item) => item.id === locationId);
  if (!location) {
    throw new Error('Lokasi tidak ditemukan');
  }
  return location;
}

function pushNotification(event: NotificationEvent) {
  notifications.unshift(event);
  return event;
}

export function getDemoDrivers() {
  return clone(drivers);
}

export function getDemoDriver(driverId: string) {
  return clone(getDriverOrThrow(driverId));
}

export function getDemoLocations() {
  return clone([...locations].sort((left, right) => left.city.localeCompare(right.city) || left.label.localeCompare(right.label)));
}

export function getDemoRewards() {
  return clone(rewards);
}

export function getDemoRedemptions(driverId: string) {
  return clone(redemptions.filter((item) => item.driver_id === driverId).sort((left, right) => right.created_at.localeCompare(left.created_at)));
}

export function getDemoNotifications() {
  return clone([...notifications].sort((left, right) => (right.createdAt ?? '').localeCompare(left.createdAt ?? '')));
}

export function getDemoLeaderboard(limit?: number): LeaderboardEntry[] {
  const ranked = [...drivers]
    .sort((left, right) => right.points - left.points || right.total_co2_reduced_kg - left.total_co2_reduced_kg || left.name.localeCompare(right.name))
    .map((driver, index) => ({
      rank: index + 1,
      id: driver.id,
      name: driver.name,
      vehicle_type: driver.vehicle_type,
      points: driver.points,
      total_co2_reduced_kg: driver.total_co2_reduced_kg,
      total_distance_saved_km: driver.total_distance_saved_km,
      total_money_saved_idr: driver.total_money_saved_idr,
      total_routes: driver.total_routes,
    }));

  return clone(typeof limit === 'number' ? ranked.slice(0, limit) : ranked);
}

export function getDemoAnalyticsOverview(): AnalyticsOverview {
  const totalDrivers = drivers.length;
  const totalPoints = drivers.reduce((sum, item) => sum + item.points, 0);
  const totalDistanceSavedKm = drivers.reduce((sum, item) => sum + item.total_distance_saved_km, 0);
  const totalFuelSavedLiters = drivers.reduce((sum, item) => sum + item.total_fuel_saved_liters, 0);
  const totalMoneySavedIdr = drivers.reduce((sum, item) => sum + item.total_money_saved_idr, 0);
  const totalCo2ReducedKg = drivers.reduce((sum, item) => sum + item.total_co2_reduced_kg, 0);
  const totalRoutes = drivers.reduce((sum, item) => sum + item.total_routes, 0);
  const totalBaselineDistanceKm = routeSimulations.reduce((sum, item) => sum + item.baseline_distance_km, 0);
  const totalSavedDistanceKm = routeSimulations.reduce((sum, item) => sum + item.distance_saved_km, 0);
  const reductionPercent = totalBaselineDistanceKm > 0 ? (totalSavedDistanceKm / totalBaselineDistanceKm) * 100 : 0;

  return clone({
    totalDrivers,
    totalPoints,
    totalDistanceSavedKm: Number(totalDistanceSavedKm.toFixed(2)),
    totalFuelSavedLiters: Number(totalFuelSavedLiters.toFixed(2)),
    totalMoneySavedIdr: Number(totalMoneySavedIdr.toFixed(2)),
    totalCo2ReducedKg: Number(totalCo2ReducedKg.toFixed(2)),
    totalRoutes,
    totalSimulations: routeSimulations.length,
    totalBaselineDistanceKm: Number(totalBaselineDistanceKm.toFixed(2)),
    totalSavedDistanceKm: Number(totalSavedDistanceKm.toFixed(2)),
    targets: {
      minimumPercent: 15,
      stretchPercent: 20,
      progressToMinimumPercent: Math.min(100, (reductionPercent / 15) * 100),
      progressToStretchPercent: Math.min(100, (reductionPercent / 20) * 100),
    },
  });
}

export function simulateDemoRoute(payload: SimulateRoutePayload): SimulationResult {
  const driver = getDriverOrThrow(payload.driverId);
  const origin = getLocationOrThrow(payload.originLocationId);
  const stops = payload.stopLocationIds.map((stopId) => getLocationOrThrow(stopId));
  const optimizedStops = nearestNeighbor(origin, stops);
  const baselineDistanceKm = calculatePathDistance(origin, stops);
  const optimizedDistanceKm = calculatePathDistance(origin, optimizedStops);
  const distanceSavedKm = Number(Math.max(0, baselineDistanceKm - optimizedDistanceKm).toFixed(2));
  const vehicleType = payload.vehicleType ?? driver.vehicle_type;
  const vehicle = vehicleDefaults[vehicleType];
  const selectedFuel = resolveFuelForVehicle(vehicleType, payload.fuelName as FuelName | undefined);
  const fuelPricePerLiter = payload.fuelPricePerLiter ?? selectedFuel.pricePerLiter;
  const fuelSavedLiters = Number((distanceSavedKm / vehicle.baseKmPerLiter).toFixed(2));
  const moneySavedIdr = Number((fuelSavedLiters * fuelPricePerLiter).toFixed(2));
  const co2ReducedKg = Number((fuelSavedLiters * vehicle.co2FactorPerLiter).toFixed(2));
  const avgSpeedKmh = payload.avgSpeedKmh ?? 60;
  const speedingFlag = avgSpeedKmh > 80 ? 1 : 0;
  const pointsEarned = calculatePoints(distanceSavedKm, avgSpeedKmh);
  const successRatePercent = baselineDistanceKm > 0 ? Number(((distanceSavedKm / baselineDistanceKm) * 100).toFixed(2)) : 0;

  const previousPoints = driver.points;
  driver.points += pointsEarned;
  driver.total_distance_saved_km = Number((driver.total_distance_saved_km + distanceSavedKm).toFixed(2));
  driver.total_fuel_saved_liters = Number((driver.total_fuel_saved_liters + fuelSavedLiters).toFixed(2));
  driver.total_money_saved_idr = Number((driver.total_money_saved_idr + moneySavedIdr).toFixed(2));
  driver.total_co2_reduced_kg = Number((driver.total_co2_reduced_kg + co2ReducedKg).toFixed(2));
  driver.total_routes += 1;
  driver.updated_at = new Date().toISOString();

  const rewardMilestoneUnlocked =
    milestoneThresholds.find((threshold) => previousPoints < threshold && driver.points >= threshold)?.toString() ?? null;

  const simulation: StoredRouteSimulation = {
    id: `sim_local_${Date.now()}`,
    driver_id: driver.id,
    origin_location_id: origin.id,
    vehicle_type: vehicleType,
    fuel_type: vehicle.fuelType,
    baseline_distance_km: baselineDistanceKm,
    optimized_distance_km: optimizedDistanceKm,
    distance_saved_km: distanceSavedKm,
    fuel_saved_liters: fuelSavedLiters,
    money_saved_idr: moneySavedIdr,
    co2_reduced_kg: co2ReducedKg,
    avg_speed_kmh: avgSpeedKmh,
    speeding_flag: speedingFlag,
    points_earned: pointsEarned,
    success_rate_percent: successRatePercent,
    reward_milestone_unlocked: rewardMilestoneUnlocked,
    created_at: new Date().toISOString(),
    origin,
    stops: stops.map((stop, index) => ({
      ...stop,
      stop_order_input: index + 1,
      stop_order_optimized: optimizedStops.findIndex((item) => item.id === stop.id) + 1,
    })),
  };

  routeSimulations.unshift(simulation);

  const generatedNotifications: NotificationEvent[] = [
    pushNotification({
      id: `ntf_local_${Date.now()}`,
      type: 'route_optimized',
      severity: 'info',
      title: 'Rute optimal berhasil dihitung',
      message: `Simulasi baru menghemat ${distanceSavedKm} km untuk ${driver.name}.`,
      createdAt: new Date().toISOString(),
      driverId: driver.id,
      routeSimulationId: simulation.id,
      payload: { routeId: simulation.id },
    }),
  ];

  if (speedingFlag) {
    generatedNotifications.push(
      pushNotification({
        id: `ntf_local_speed_${Date.now()}`,
        type: 'overspeed_warning',
        severity: 'warning',
        title: 'Kecepatan melebihi batas aman',
        message: 'Kecepatan di atas 80 km/jam meningkatkan konsumsi BBM dan mengurangi efisiensi eco-driving.',
        createdAt: new Date().toISOString(),
        driverId: driver.id,
        routeSimulationId: simulation.id,
      }),
    );
  }

  if (rewardMilestoneUnlocked) {
    generatedNotifications.push(
      pushNotification({
        id: `ntf_local_reward_${Date.now()}`,
        type: 'reward_milestone',
        severity: 'success',
        title: `Milestone ${rewardMilestoneUnlocked} poin tercapai`,
        message: `${driver.name} baru saja melampaui ambang ${rewardMilestoneUnlocked} poin.`,
        createdAt: new Date().toISOString(),
        driverId: driver.id,
        routeSimulationId: simulation.id,
      }),
    );
  }

  return clone({
    simulation,
    notifications: generatedNotifications,
    driver,
    baselineOrder: stops,
    optimizedOrder: optimizedStops,
    summary: {
      baselineDistanceKm,
      optimizedDistanceKm,
      distanceSavedKm,
      fuelSavedLiters,
      moneySavedIdr,
      co2ReducedKg,
      avgSpeedKmh,
      pointsEarned,
      successRatePercent,
      rewardMilestoneUnlocked,
      fuelPricePerLiter,
    },
  });
}

export function getDemoSimulation(routeId: string) {
  const simulation = routeSimulations.find((item) => item.id === routeId);
  if (!simulation) {
    throw new Error('Simulasi tidak ditemukan');
  }
  return clone(simulation);
}

export function redeemDemoReward(driverId: string, rewardId: string) {
  const driver = getDriverOrThrow(driverId);
  const reward = rewards.find((item) => item.id === rewardId);
  if (!reward) {
    throw new Error('Reward tidak ditemukan');
  }
  if (driver.points < reward.points_required) {
    throw new Error('Poin driver tidak mencukupi');
  }

  driver.points -= reward.points_required;
  driver.updated_at = new Date().toISOString();

  const redemption: RewardRedemption = {
    id: `red_local_${Date.now()}`,
    driver_id: driver.id,
    reward_id: reward.id,
    points_spent: reward.points_required,
    status: 'issued',
    created_at: new Date().toISOString(),
    reward_name: reward.name,
    reward_value_label: reward.reward_value_label,
  };
  redemptions.unshift(redemption);

  const notification = pushNotification({
    id: `ntf_local_redemption_${Date.now()}`,
    type: 'reward_redeemed',
    severity: 'success',
    title: 'Reward berhasil ditukar',
    message: `${driver.name} menukar ${reward.name} dengan ${reward.points_required} poin.`,
    createdAt: new Date().toISOString(),
    driverId: driver.id,
    payload: { rewardId: reward.id },
  });

  return clone({
    redemption,
    driver,
    notification,
  });
}
