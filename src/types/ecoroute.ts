export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
}

export type VehicleType = 'motorcycle' | 'pickup_gasoline' | 'pickup_diesel';
export type FuelType = 'gasoline' | 'diesel';
export type FuelName =
  | 'pertalite'
  | 'pertamax'
  | 'pertamax_green'
  | 'pertamax_turbo'
  | 'bio_solar'
  | 'dexlite'
  | 'pertamina_dex';
export type NotificationSeverity = 'info' | 'warning' | 'success';
export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

export interface FuelOption {
  id: FuelName;
  name: string;
  category: FuelType;
  pricePerLiter: number;
  description: string;
}

export interface Driver {
  id: string;
  name: string;
  vehicle_type: VehicleType;
  fuel_type: FuelType;
  base_km_per_liter: number;
  fuel_price_per_liter: number;
  co2_factor_per_liter: number;
  points: number;
  total_distance_saved_km: number;
  total_fuel_saved_liters: number;
  total_money_saved_idr: number;
  total_co2_reduced_kg: number;
  total_routes: number;
  created_at: string;
  updated_at: string;
}

export interface MockLocation {
  id: string;
  label: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  category: string;
}

export interface AnalyticsOverview {
  totalDrivers: number;
  totalPoints: number;
  totalDistanceSavedKm: number;
  totalFuelSavedLiters: number;
  totalMoneySavedIdr: number;
  totalCo2ReducedKg: number;
  totalRoutes: number;
  totalSimulations: number;
  totalBaselineDistanceKm: number;
  totalSavedDistanceKm: number;
  targets: {
    minimumPercent: number;
    stretchPercent: number;
    progressToMinimumPercent: number;
    progressToStretchPercent: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  vehicle_type: VehicleType;
  points: number;
  total_co2_reduced_kg: number;
  total_distance_saved_km: number;
  total_money_saved_idr: number;
  total_routes: number;
}

export interface Reward {
  id: string;
  name: string;
  points_required: number;
  reward_type: 'fuel_voucher' | 'data_package';
  reward_value_label: string;
  description: string;
  is_active: number;
}

export interface RewardRedemption {
  id: string;
  driver_id: string;
  reward_id: string;
  points_spent: number;
  status: string;
  created_at: string;
  reward_name?: string;
  reward_value_label?: string;
}

export interface NotificationEvent {
  id?: string;
  driverId?: string | null;
  routeSimulationId?: string | null;
  type: string;
  severity: NotificationSeverity;
  title: string;
  message: string;
  createdAt?: string;
  timestamp?: string;
  payload?: Record<string, unknown>;
}

export interface RouteStopDetail extends MockLocation {
  location_id?: string;
  stop_order_input?: number;
  stop_order_optimized?: number;
}

export interface StoredRouteSimulation {
  id: string;
  driver_id: string;
  origin_location_id: string;
  vehicle_type: VehicleType;
  fuel_type: FuelType;
  baseline_distance_km: number;
  optimized_distance_km: number;
  distance_saved_km: number;
  fuel_saved_liters: number;
  money_saved_idr: number;
  co2_reduced_kg: number;
  avg_speed_kmh: number;
  speeding_flag: number;
  points_earned: number;
  success_rate_percent: number;
  reward_milestone_unlocked: string | null;
  created_at: string;
  origin?: MockLocation;
  stops?: RouteStopDetail[];
}

export interface SimulationSummary {
  baselineDistanceKm: number;
  optimizedDistanceKm: number;
  distanceSavedKm: number;
  fuelSavedLiters: number;
  moneySavedIdr: number;
  co2ReducedKg: number;
  avgSpeedKmh: number;
  pointsEarned: number;
  successRatePercent: number;
  rewardMilestoneUnlocked: string | null;
  fuelPricePerLiter: number;
}

export interface SimulationResult {
  simulation: StoredRouteSimulation;
  notifications: NotificationEvent[];
  driver: Driver;
  baselineOrder: MockLocation[];
  optimizedOrder: MockLocation[];
  summary: SimulationSummary;
}

export interface DriverAnalytics extends Driver {
  simulations_count: number;
  avg_success_rate_percent: number;
  avg_speed_kmh: number;
}

export interface DemoPreset {
  driverId: string;
  vehicleType: VehicleType;
  fuelName: FuelName;
  originLocationId: string;
  stopLocationIds: string[];
  avgSpeedKmh: number;
}
