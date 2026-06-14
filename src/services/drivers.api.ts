import { apiGet, withDemoFallback } from './api-client';
import type { Driver } from '../types/ecoroute';
import { getDemoDriver, getDemoDrivers } from './demo-store';

export async function getDrivers() {
  return withDemoFallback(
    async () => {
      const response = await apiGet<Driver[]>('/drivers');
      return response.data;
    },
    () => getDemoDrivers(),
  );
}

export async function getDriver(driverId: string) {
  return withDemoFallback(
    async () => {
      const response = await apiGet<Driver>(`/drivers/${driverId}`);
      return response.data;
    },
    () => getDemoDriver(driverId),
  );
}
