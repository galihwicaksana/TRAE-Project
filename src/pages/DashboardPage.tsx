import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationFeed } from '../components/NotificationFeed';
import {
  EmptyState,
  ErrorState,
  HeroSurface,
  KpiCard,
  LoadingPanel,
  PageSection,
  ProgressCard,
  StatusPill,
  Surface,
} from '../components/ui';
import { usePageTitle } from '../hooks/usePageTitle';
import { useRealtime } from '../hooks/useRealtime';
import {
  formatCo2,
  formatCompactNumber,
  formatCurrency,
  formatDistance,
  formatLiters,
  formatPercent,
  getVehicleLabel,
} from '../lib/formatters';
import { getAnalyticsOverview, getLeaderboardSummary } from '../services/analytics.api';
import { getNotifications } from '../services/notifications.api';

export function DashboardPage() {
  usePageTitle('Dashboard');
  const navigate = useNavigate();
  const { liveEvents, connectionStatus } = useRealtime();

  const overviewQuery = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: getAnalyticsOverview,
  });

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard-summary'],
    queryFn: getLeaderboardSummary,
  });

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  const feedItems = useMemo(
    () => (liveEvents.length > 0 ? liveEvents : notificationsQuery.data?.slice(0, 4) ?? []),
    [liveEvents, notificationsQuery.data],
  );

  if (overviewQuery.isLoading || leaderboardQuery.isLoading || notificationsQuery.isLoading) {
    return <LoadingPanel message="Menyiapkan dashboard dampak EcoRoute..." />;
  }

  if (overviewQuery.isError || leaderboardQuery.isError || notificationsQuery.isError || !overviewQuery.data) {
    return <ErrorState message="API EcoRoute belum dapat dijangkau. Jalankan backend untuk melihat dashboard penuh." />;
  }

  const overview = overviewQuery.data;
  const leaders = leaderboardQuery.data ?? [];

  return (
    <div className="page-stack">
      <HeroSurface
        title="Optimasi rute lokal, tekan emisi CO2, dan turunkan biaya BBM armada UMKM."
        subtitle="EcoRoute menghubungkan simulasi rute, eco-driving, leaderboard, dan reward retention dalam satu dashboard presentasi yang langsung terbaca."
      >
        <div className="hero-actions">
          <button
            className="primary-button"
            onClick={() => navigate('/routes', { state: { useDemoPreset: true } })}
            type="button"
          >
            Run Demo
          </button>
          <button className="secondary-button" onClick={() => navigate('/analytics')} type="button">
            Lihat Analytics
          </button>
        </div>
        <div className="hero-metrics">
          <div>
            <span>Realtime</span>
            <strong>{connectionStatus}</strong>
          </div>
          <div>
            <span>Top Driver</span>
            <strong>{leaders[0]?.name ?? '-'}</strong>
          </div>
        </div>
      </HeroSurface>

      <div className="kpi-grid">
        <KpiCard
          hint="Akumulasi dekarbonisasi armada"
          label="CO2 Reduced"
          tone="accent"
          value={formatCo2(overview.totalCo2ReducedKg)}
        />
        <KpiCard
          hint="Volume BBM yang dipangkas"
          label="Fuel Saved"
          tone="accent"
          value={formatLiters(overview.totalFuelSavedLiters)}
        />
        <KpiCard
          hint="Efisiensi biaya operasional"
          label="Cost Saved"
          value={formatCurrency(overview.totalMoneySavedIdr)}
        />
        <KpiCard
          hint="Rata-rata efisiensi rute"
          label="Saved Distance"
          value={formatDistance(overview.totalDistanceSavedKm)}
        />
      </div>

      <div className="two-column-layout">
        <ProgressCard
          currentLabel={formatPercent(
            overview.totalBaselineDistanceKm > 0
              ? (overview.totalSavedDistanceKm / overview.totalBaselineDistanceKm) * 100
              : 0,
          )}
          minimum={formatPercent(overview.targets.minimumPercent, 0)}
          progress={overview.targets.progressToMinimumPercent}
          stretch={formatPercent(overview.targets.stretchPercent, 0)}
          title="Progress target reduksi CO2 logistik"
        />
        <Surface className="insight-card">
          <p className="section-eyebrow">Operational Snapshot</p>
          <h3>Distribusi aktif Malang Raya dan koridor Jatim</h3>
          <div className="insight-grid">
            <div>
              <span>Total Driver</span>
              <strong>{formatCompactNumber(overview.totalDrivers)}</strong>
            </div>
            <div>
              <span>Total Poin</span>
              <strong>{formatCompactNumber(overview.totalPoints)}</strong>
            </div>
            <div>
              <span>Total Route</span>
              <strong>{formatCompactNumber(overview.totalRoutes)}</strong>
            </div>
            <div>
              <span>Total Simulasi</span>
              <strong>{formatCompactNumber(overview.totalSimulations)}</strong>
            </div>
          </div>
        </Surface>
      </div>

      <PageSection
        action={
          <button className="secondary-button" onClick={() => navigate('/leaderboard')} type="button">
            Full Leaderboard
          </button>
        }
        description="Driver dengan poin tertinggi dan kontribusi dekarbonisasi terbesar."
        eyebrow="Gamification Loop"
        title="Top 3 Eco-Driver"
      >
        <div className="feature-grid three-up">
          {leaders.map((leader) => (
            <Surface key={leader.id} className="driver-card">
              <div className="driver-card-head">
                <div>
                  <p className="section-eyebrow">Rank #{leader.rank}</p>
                  <h3>{leader.name}</h3>
                </div>
                <StatusPill tone={leader.rank === 1 ? 'success' : 'neutral'}>
                  {getVehicleLabel(leader.vehicle_type)}
                </StatusPill>
              </div>
              <div className="driver-stat-list">
                <div>
                  <span>Poin Hijau</span>
                  <strong>{formatCompactNumber(leader.points)}</strong>
                </div>
                <div>
                  <span>CO2 Ditekan</span>
                  <strong>{formatCo2(leader.total_co2_reduced_kg)}</strong>
                </div>
                <div>
                  <span>Biaya Hemat</span>
                  <strong>{formatCurrency(leader.total_money_saved_idr)}</strong>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </PageSection>

      <div className="two-column-layout">
        {feedItems.length > 0 ? (
          <NotificationFeed items={feedItems} title="Alert dan event sistem terbaru" />
        ) : (
          <EmptyState
            action={
              <button className="secondary-button" onClick={() => navigate('/notifications')} type="button">
                Buka Notification Center
              </button>
            }
            description="Belum ada alert realtime baru. Dashboard tetap siap untuk skenario demo."
            title="Notification stream standby"
          />
        )}
        <Surface className="cta-surface">
          <p className="section-eyebrow">Presentation Flow</p>
          <h3>Alur demo yang direkomendasikan mentor</h3>
          <ol className="journey-list">
            <li>Buka KPI dampak dan target reduksi di dashboard.</li>
            <li>Tekan tombol Run Demo untuk mengisi skenario rute Malang Raya.</li>
            <li>Tunjukkan warning overspeed, poin, dan rute optimal di simulator.</li>
            <li>Tutup dengan leaderboard, reward, dan analytics manajemen.</li>
          </ol>
        </Surface>
      </div>
    </div>
  );
}
