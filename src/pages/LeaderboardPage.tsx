import { useQuery } from '@tanstack/react-query';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { ErrorState, KpiCard, LoadingPanel, PageSection } from '../components/ui';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatCompactNumber, formatDistance } from '../lib/formatters';
import { getLeaderboard } from '../services/leaderboard.api';

export function LeaderboardPage() {
  usePageTitle('Leaderboard');

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });

  if (leaderboardQuery.isLoading) {
    return <LoadingPanel message="Menyusun leaderboard Eco-Driver..." />;
  }

  if (leaderboardQuery.isError || !leaderboardQuery.data) {
    return <ErrorState message="Leaderboard belum dapat dimuat dari backend." />;
  }

  const entries = leaderboardQuery.data;
  const totalPoints = entries.reduce((sum, item) => sum + item.points, 0);
  const totalDistance = entries.reduce((sum, item) => sum + item.total_distance_saved_km, 0);

  return (
    <div className="page-stack">
      <PageSection
        description="Leaderboard mendorong perilaku eco-driving melalui kompetisi poin hijau, penghematan rute, dan kontribusi reduksi CO2."
        eyebrow="Gamification Analytics"
        title="Top Eco-Driver"
      >
        <div className="kpi-grid">
          <KpiCard hint="Total kompetisi" label="Driver Ranked" value={formatCompactNumber(entries.length)} />
          <KpiCard hint="Akumulasi poin" label="Green Points" tone="accent" value={formatCompactNumber(totalPoints)} />
          <KpiCard hint="Jarak hemat oleh armada" label="Saved Distance" tone="accent" value={formatDistance(totalDistance)} />
          <KpiCard
            hint="Peringkat utama"
            label="Current Leader"
            value={entries[0] ? `#1 ${entries[0].name}` : '-'}
          />
        </div>
      </PageSection>

      <LeaderboardTable entries={entries} />
    </div>
  );
}
