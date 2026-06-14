import { useQuery } from '@tanstack/react-query';
import { NotificationFeed } from '../components/NotificationFeed';
import { ErrorState, LoadingPanel, PageSection, StatusPill } from '../components/ui';
import { usePageTitle } from '../hooks/usePageTitle';
import { useRealtime } from '../hooks/useRealtime';
import { getNotifications } from '../services/notifications.api';

export function NotificationsPage() {
  usePageTitle('Notifications');
  const { connectionStatus, liveEvents } = useRealtime();

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  if (notificationsQuery.isLoading) {
    return <LoadingPanel message="Memuat histori notifikasi EcoRoute..." />;
  }

  if (notificationsQuery.isError || !notificationsQuery.data) {
    return <ErrorState message="Notification center belum dapat mengambil histori event." />;
  }

  return (
    <div className="page-stack">
      <PageSection
        action={<StatusPill tone={connectionStatus === 'connected' ? 'success' : connectionStatus === 'reconnecting' ? 'warning' : 'neutral'}>{connectionStatus}</StatusPill>}
        description="Pusat arsip event sistem dan status koneksi stream realtime untuk kebutuhan demo atau monitoring."
        eyebrow="Realtime Center"
        title="Notifications"
      />

      {liveEvents.length > 0 ? <NotificationFeed items={liveEvents} title="Realtime events yang baru masuk" /> : null}
      <NotificationFeed items={notificationsQuery.data} title="Histori event tersimpan di backend" />
    </div>
  );
}
