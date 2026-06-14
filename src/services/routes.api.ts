import { apiGet, apiPost, withDemoFallback } from './api-client';
import type { FuelName, MockLocation, SimulationResult, StoredRouteSimulation, VehicleType } from '../types/ecoroute';
import { getDemoLocations, getDemoSimulation, simulateDemoRoute } from './demo-store';

export interface SimulateRoutePayload {
  driverId: string;
  originLocationId: string;
  stopLocationIds: string[];
  vehicleType?: VehicleType;
  fuelName?: FuelName;
  fuelPricePerLiter?: number;
  avgSpeedKmh?: number;
}

export async function getMockAddresses() {
  return withDemoFallback(
    async () => {
      const response = await apiGet<MockLocation[]>('/routes/mock-addresses');
      return response.data;
    },
    () => getDemoLocations(),
  );
}

export async function simulateRoute(payload: SimulateRoutePayload) {
  return withDemoFallback(
    async () => {
      const response = await apiPost<SimulationResult, SimulateRoutePayload>('/routes/simulate', payload);
      return response.data;
    },
    () => simulateDemoRoute(payload),
  );
}

export async function getRouteSimulation(routeId: string) {
  return withDemoFallback(
    async () => {
      const response = await apiGet<StoredRouteSimulation>(`/routes/${routeId}`);
      return response.data;
    },
    () => getDemoSimulation(routeId),
  );
}
