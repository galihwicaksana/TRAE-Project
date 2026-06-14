import { API_BASE_URL } from './api-client';

export function createNotificationEventSource() {
  return new EventSource(`${API_BASE_URL}/notifications/stream`);
}
