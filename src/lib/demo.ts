import type { DemoPreset } from '../types/ecoroute';

export const DEFAULT_DEMO_PRESET: DemoPreset = {
  driverId: 'drv_003',
  vehicleType: 'pickup_diesel',
  fuelName: 'dexlite',
  originLocationId: 'loc_011',
  stopLocationIds: ['loc_010', 'loc_007', 'loc_009'],
  avgSpeedKmh: 74,
};

export const MALANG_CENTER: [number, number] = [-7.9666, 112.6326];
