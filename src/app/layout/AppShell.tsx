import { Outlet } from 'react-router-dom';
import { CelebrationModal, ToastStack, AlertBanner } from '../../components/ui';
import { useRealtime } from '../../hooks/useRealtime';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  const { banner, celebration, dismissBanner, dismissCelebration, toasts, dismissToast } = useRealtime();

  return (
    <div className="app-frame">
      <div className="ambient-glow ambient-one" />
      <div className="ambient-glow ambient-two" />
      <Sidebar />
      <div className="main-shell">
        <Topbar />
        <div className="content-shell">
          {banner ? <AlertBanner event={banner} onDismiss={dismissBanner} /> : null}
          <Outlet />
        </div>
      </div>
      <ToastStack items={toasts} onDismiss={dismissToast} />
      <CelebrationModal event={celebration} onClose={dismissCelebration} />
    </div>
  );
}
