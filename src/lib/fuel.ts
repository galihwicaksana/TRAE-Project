import type { FuelName, FuelOption, FuelType, VehicleType } from '../types/ecoroute';

export const FUEL_OPTIONS: FuelOption[] = [
  {
    id: 'pertalite',
    name: 'Pertalite',
    category: 'gasoline',
    pricePerLiter: 10000,
    description: 'Bensin subsidi untuk operasional harian yang efisien.',
  },
  {
    id: 'pertamax',
    name: 'Pertamax',
    category: 'gasoline',
    pricePerLiter: 16250,
    description: 'Pilihan bensin utama untuk armada bensin dengan performa stabil.',
  },
  {
    id: 'pertamax_green',
    name: 'Pertamax Green',
    category: 'gasoline',
    pricePerLiter: 17000,
    description: 'Varian bensin dengan narasi greener fuel untuk demo transisi energi.',
  },
  {
    id: 'pertamax_turbo',
    name: 'Pertamax Turbo',
    category: 'gasoline',
    pricePerLiter: 20750,
    description: 'Bensin premium performa tinggi untuk simulasi biaya maksimum.',
  },
  {
    id: 'bio_solar',
    name: 'Bio Solar',
    category: 'diesel',
    pricePerLiter: 6800,
    description: 'Solar subsidi untuk skenario biaya operasional paling rendah.',
  },
  {
    id: 'dexlite',
    name: 'Dexlite',
    category: 'diesel',
    pricePerLiter: 23000,
    description: 'Solar efisien yang cocok untuk armada pickup diesel.',
  },
  {
    id: 'pertamina_dex',
    name: 'Pertamina Dex',
    category: 'diesel',
    pricePerLiter: 24800,
    description: 'Solar premium untuk simulasi kualitas bahan bakar tertinggi.',
  },
];

const VEHICLE_FUEL_MAP: Record<VehicleType, FuelType> = {
  motorcycle: 'gasoline',
  pickup_gasoline: 'gasoline',
  pickup_diesel: 'diesel',
};

const DEFAULT_FUEL_BY_VEHICLE: Record<VehicleType, FuelName> = {
  motorcycle: 'pertamax',
  pickup_gasoline: 'pertalite',
  pickup_diesel: 'dexlite',
};

export function getFuelCategoryForVehicle(vehicleType: VehicleType) {
  return VEHICLE_FUEL_MAP[vehicleType];
}

export function getFuelOptionsForVehicle(vehicleType: VehicleType) {
  const category = getFuelCategoryForVehicle(vehicleType);
  return FUEL_OPTIONS.filter((fuel) => fuel.category === category);
}

export function getFuelOptionByName(fuelName: FuelName) {
  return FUEL_OPTIONS.find((fuel) => fuel.id === fuelName) ?? FUEL_OPTIONS[0];
}

export function getDefaultFuelNameForVehicle(vehicleType: VehicleType) {
  return DEFAULT_FUEL_BY_VEHICLE[vehicleType];
}

export function resolveFuelForVehicle(vehicleType: VehicleType, fuelName?: FuelName) {
  const allowedOptions = getFuelOptionsForVehicle(vehicleType);
  const selected = fuelName ? allowedOptions.find((fuel) => fuel.id === fuelName) : undefined;
  return selected ?? getFuelOptionByName(getDefaultFuelNameForVehicle(vehicleType));
}
