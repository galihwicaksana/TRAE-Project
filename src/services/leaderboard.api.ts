import { apiGet, withDemoFallback } from './api-client';
import type { LeaderboardEntry } from '../types/ecoroute';
import { getDemoLeaderboard } from './demo-store';

export async function getLeaderboard() {
  return withDemoFallback(
    async () => {
      const response = await apiGet<LeaderboardEntry[]>('/leaderboard');
      return response.data;
    },
    () => getDemoLeaderboard(),
  );
}
