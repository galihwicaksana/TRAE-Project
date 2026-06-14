import { useLocation } from 'react-router-dom';
import { StatusPill } from '../../components/ui';
import { useRealtime } from '../../hooks/useRealtime';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard Dampak Logistik',
  '/routes': 'Route Simulator',
  '/analytics': 'Analytics Dekarbonisasi',
  '/leaderboard': 'Top Eco-Driver',
  '/rewards': 'Reward Store',
  '/notifications': 'Notification Center',
};

export function Topbar() {
  const location = useLocation();
  const { connectionStatus } = useRealtime();

  return (
    <header className="topbar">
      <div>
        <p className="section-eyebrow">Eco-Green Clean Corporate Dashboard</p>
        <h2>{pageTitles[location.pathname] ?? 'EcoRoute'}</h2>
      </div>
      <div className="topbar-status">
        <StatusPill tone={connectionStatus === 'connected' ? 'success' : connectionStatus === 'reconnecting' ? 'warning' : 'neutral'}>
          SSE {connectionStatus}
        </StatusPill>
        <StatusPill tone={connectionStatus === 'connected' ? 'neutral' : 'warning'}>
          {connectionStatus === 'connected' ? 'Backend API aktif via Fastify' : 'Demo fallback data aktif'}
        </StatusPill>
      </div>
    </header>
  );
}
