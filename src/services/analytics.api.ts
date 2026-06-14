import { apiGet, withDemoFallback } from './api-client';
import type { AnalyticsOverview, DriverAnalytics, LeaderboardEntry } from '../types/ecoroute';
import { getDemoAnalyticsOverview, getDemoDriver, getDemoLeaderboard } from './demo-store';

export async function getAnalyticsOverview() {
  return withDemoFallback(
    async () => {
      const response = await apiGet<AnalyticsOverview>('/analytics/overview');
      return response.data;
    },
    () => getDemoAnalyticsOverview(),
  );
}

export async function getDriverAnalytics(driverId: string) {
  return withDemoFallback(
    async () => {
      const response = await apiGet<DriverAnalytics>(`/analytics/drivers/${driverId}`);
      return response.data;
    },
    () => {
      const driver = getDemoDriver(driverId);
      return {
        ...driver,
        simulations_count: driver.total_routes,
        avg_success_rate_percent: 18.6,
        avg_speed_kmh: 74,
      };
    },
  );
}

export async function getLeaderboardSummary() {
  return withDemoFallback(
    async () => {
      const response = await apiGet<LeaderboardEntry[]>('/analytics/leaderboard-summary');
      return response.data;
    },
    () => getDemoLeaderboard(3),
  );
}
