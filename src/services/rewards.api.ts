import { apiGet, apiPost, withDemoFallback } from './api-client';
import type { Driver, NotificationEvent, Reward, RewardRedemption } from '../types/ecoroute';
import { getDemoRedemptions, getDemoRewards, redeemDemoReward } from './demo-store';

interface RedeemRewardResponse {
  redemption: RewardRedemption;
  driver: Driver;
  notification: NotificationEvent;
}

export async function getRewards() {
  return withDemoFallback(
    async () => {
      const response = await apiGet<Reward[]>('/rewards');
      return response.data;
    },
    () => getDemoRewards(),
  );
}

export async function getRewardRedemptions(driverId: string) {
  return withDemoFallback(
    async () => {
      const response = await apiGet<RewardRedemption[]>(`/rewards/redemptions/${driverId}`);
      return response.data;
    },
    () => getDemoRedemptions(driverId),
  );
}

export async function redeemReward(payload: { driverId: string; rewardId: string }) {
  return withDemoFallback(
    async () => {
      const response = await apiPost<RedeemRewardResponse, { driverId: string; rewardId: string }>(
        '/rewards/redeem',
        payload,
      );
      return response.data;
    },
    () => redeemDemoReward(payload.driverId, payload.rewardId),
  );
}
