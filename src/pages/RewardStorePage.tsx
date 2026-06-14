import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RewardCard } from '../components/RewardCard';
import { ErrorState, LoadingPanel, PageSection, Surface } from '../components/ui';
import { usePageTitle } from '../hooks/usePageTitle';
import { useRealtime } from '../hooks/useRealtime';
import { formatCompactNumber, formatDateTime } from '../lib/formatters';
import { getDrivers } from '../services/drivers.api';
import { getRewardRedemptions, getRewards, redeemReward } from '../services/rewards.api';

export function RewardStorePage() {
  usePageTitle('Reward Store');
  const queryClient = useQueryClient();
  const { connectionStatus, pushLocalEvents } = useRealtime();
  const [driverId, setDriverId] = useState('');

  const driversQuery = useQuery({
    queryKey: ['drivers'],
    queryFn: getDrivers,
  });

  const rewardsQuery = useQuery({
    queryKey: ['rewards'],
    queryFn: getRewards,
  });

  useEffect(() => {
    if (!driverId && driversQuery.data?.length) {
      setDriverId(driversQuery.data[0].id);
    }
  }, [driverId, driversQuery.data]);

  const selectedDriver = driversQuery.data?.find((item) => item.id === driverId) ?? null;

  const redemptionsQuery = useQuery({
    queryKey: ['reward-redemptions', driverId],
    queryFn: () => getRewardRedemptions(driverId),
    enabled: Boolean(driverId),
  });

  const redeemMutation = useMutation({
    mutationFn: redeemReward,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['reward-redemptions', driverId] });
      if (connectionStatus !== 'connected') {
        pushLocalEvents([result.notification]);
      }
    },
  });

  if (driversQuery.isLoading || rewardsQuery.isLoading) {
    return <LoadingPanel message="Menyiapkan katalog reward dan profil driver..." />;
  }

  if (driversQuery.isError || rewardsQuery.isError || !driversQuery.data || !rewardsQuery.data) {
    return <ErrorState message="Reward store belum bisa memuat data dari backend EcoRoute." />;
  }

  return (
    <div className="page-stack">
      <PageSection
        description="Poin hijau dapat dikonversi menjadi reward nyata untuk program retensi driver."
        eyebrow="Reward Conversion"
        title="Mock Reward Store"
      >
        <div className="reward-toolbar">
          <label className="field compact">
            <span>Pilih driver</span>
            <select value={driverId} onChange={(event) => setDriverId(event.target.value)}>
              {driversQuery.data.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </label>
          <Surface className="points-pocket">
            <span>Poin tersedia</span>
            <strong>{formatCompactNumber(selectedDriver?.points ?? 0)} poin</strong>
          </Surface>
        </div>
      </PageSection>

      <div className="feature-grid three-up">
        {rewardsQuery.data.map((reward) => (
          <RewardCard
            key={reward.id}
            canRedeem={(selectedDriver?.points ?? 0) >= reward.points_required}
            isRedeeming={redeemMutation.isPending}
            onRedeem={() => redeemMutation.mutate({ driverId, rewardId: reward.id })}
            reward={reward}
          />
        ))}
      </div>

      <div className="two-column-layout">
        <Surface className="results-card">
          <p className="section-eyebrow">Retention Program</p>
          <h3>Benefit yang tersedia untuk driver</h3>
          <div className="journey-list">
            <div>1.000 poin = Voucher BBM Rp50.000</div>
            <div>2.500 poin = Voucher BBM Rp150.000</div>
            <div>5.000 poin = Paket data 50GB</div>
          </div>
          {redeemMutation.isError ? (
            <p className="error-copy">{(redeemMutation.error as Error).message}</p>
          ) : null}
        </Surface>

        <Surface className="feed-panel">
          <div className="panel-head">
            <div>
              <p className="section-eyebrow">Redemption History</p>
              <h3>Riwayat penukaran driver</h3>
            </div>
          </div>
          {redemptionsQuery.isLoading ? (
            <p className="section-description">Memuat riwayat redeem...</p>
          ) : (
            <div className="feed-list">
              {(redemptionsQuery.data ?? []).map((item) => (
                <article key={item.id} className="feed-item">
                  <div className="feed-item-head">
                    <strong>{item.reward_name ?? item.reward_id}</strong>
                    <span>{formatCompactNumber(item.points_spent)} poin</span>
                  </div>
                  <p>Status: {item.status}</p>
                  <span>{formatDateTime(item.created_at)}</span>
                </article>
              ))}
              {redemptionsQuery.data?.length === 0 ? (
                <p className="section-description">Belum ada redemption untuk driver ini.</p>
              ) : null}
            </div>
          )}
        </Surface>
      </div>
    </div>
  );
}
