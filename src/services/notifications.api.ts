import { apiGet, withDemoFallback } from './api-client';
import type { NotificationEvent } from '../types/ecoroute';
import { getDemoNotifications } from './demo-store';

export async function getNotifications() {
  return withDemoFallback(
    async () => {
      const response = await apiGet<NotificationEvent[]>('/notifications');
      return response.data;
    },
    () => getDemoNotifications(),
  );
}
