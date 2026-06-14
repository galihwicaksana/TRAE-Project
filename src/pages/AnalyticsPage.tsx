import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ErrorState, KpiCard, LoadingPanel, PageSection, Surface } from '../components/ui';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatCo2, formatCompactNumber, formatCurrency, formatLiters, formatPercent } from '../lib/formatters';
import { getAnalyticsOverview } from '../services/analytics.api';
import { getLeaderboard } from '../services/leaderboard.api';

const chartPalette = ['#8eff75', '#42d392', '#2cb67d', '#c8ff89', '#8aa476'];

export function AnalyticsPage() {
  usePageTitle('Analytics');

  const overviewQuery = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: getAnalyticsOverview,
  });

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });

  if (overviewQuery.isLoading || leaderboardQuery.isLoading) {
    return <LoadingPanel message="Menyiapkan analytics dampak EcoRoute..." />;
  }

  if (overviewQuery.isError || leaderboardQuery.isError || !overviewQuery.data || !leaderboardQuery.data) {
    return <ErrorState message="Analytics belum bisa dimuat dari backend EcoRoute." />;
  }

  const overview = overviewQuery.data;
  const leaderData = leaderboardQuery.data.slice(0, 5);
  const progressData = [
    {
      name: 'Minimum',
      value: overview.targets.progressToMinimumPercent,
      fill: '#8eff75',
    },
  ];

  return (
    <div className="page-stack">
      <PageSection
        description="Transparansi dampak untuk manajemen UMKM: volume BBM hemat, biaya logistik yang dipangkas, dan progres reduksi karbon."
        eyebrow="Management Dashboard"
        title="Analytics Dekarbonisasi"
      >
        <div className="kpi-grid">
          <KpiCard hint="Total platform" label="Fuel Saved" tone="accent" value={formatLiters(overview.totalFuelSavedLiters)} />
          <KpiCard hint="Akumulasi biaya" label="Cost Saved" tone="accent" value={formatCurrency(overview.totalMoneySavedIdr)} />
          <KpiCard hint="Dampak lingkungan" label="CO2 Reduced" tone="accent" value={formatCo2(overview.totalCo2ReducedKg)} />
          <KpiCard hint="Rute tersimulasi" label="Total Simulations" value={formatCompactNumber(overview.totalSimulations)} />
        </div>
      </PageSection>

      <div className="analytics-grid">
        <Surface className="chart-panel">
          <div className="panel-head">
            <div>
              <p className="section-eyebrow">Target Reduction</p>
              <h3>Progress menuju target minimum</h3>
            </div>
            <strong>{formatPercent(overview.targets.progressToMinimumPercent)}</strong>
          </div>
          <div className="chart-wrap radial-chart">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" data={progressData} innerRadius="68%" outerRadius="100%" startAngle={90} endAngle={-270}>
                <PolarAngleAxis angleAxisId={0} domain={[0, 100]} tick={false} type="number" />
                <RadialBar background dataKey="value" cornerRadius={18} />
                <Tooltip formatter={(value: number) => formatPercent(value)} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="insight-grid">
            <div>
              <span>Target Minimum</span>
              <strong>{formatPercent(overview.targets.minimumPercent, 0)}</strong>
            </div>
            <div>
              <span>Target Stretch</span>
              <strong>{formatPercent(overview.targets.stretchPercent, 0)}</strong>
            </div>
          </div>
        </Surface>

        <Surface className="chart-panel">
          <div className="panel-head">
            <div>
              <p className="section-eyebrow">Driver Breakdown</p>
              <h3>Kontribusi penghematan biaya per driver</h3>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaderData}>
                <CartesianGrid stroke="rgba(210, 229, 205, 0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#9db29d" tickLine={false} axisLine={false} />
                <YAxis stroke="#9db29d" tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="total_money_saved_idr" radius={[10, 10, 0, 0]}>
                  {leaderData.map((entry, index) => (
                    <Cell key={entry.id} fill={chartPalette[index % chartPalette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>

      <Surface className="chart-panel">
        <div className="panel-head">
          <div>
            <p className="section-eyebrow">Platform Summary</p>
            <h3>Ringkasan performa sistem EcoRoute</h3>
          </div>
        </div>
        <div className="insight-grid expanded">
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
            <span>Saved Distance</span>
            <strong>{formatPercent((overview.totalSavedDistanceKm / overview.totalBaselineDistanceKm) * 100 || 0)}</strong>
          </div>
        </div>
      </Surface>
    </div>
  );
}
