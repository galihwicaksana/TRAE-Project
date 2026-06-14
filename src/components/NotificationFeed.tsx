import { formatDateTime } from '../lib/formatters';
import type { NotificationEvent } from '../types/ecoroute';
import { SeverityBadge, Surface } from './ui';

export function NotificationFeed({
  items,
  title = 'Feed notifikasi terbaru',
}: {
  items: NotificationEvent[];
  title?: string;
}) {
  return (
    <Surface className="feed-panel">
      <div className="panel-head">
        <div>
          <p className="section-eyebrow">Notification Stream</p>
          <h3>{title}</h3>
        </div>
      </div>
      <div className="feed-list">
        {items.map((item, index) => (
          <article key={item.id ?? `${item.type}-${index}`} className="feed-item">
            <div className="feed-item-head">
              <strong>{item.title}</strong>
              <SeverityBadge severity={item.severity} />
            </div>
            <p>{item.message}</p>
            <span>{formatDateTime(item.createdAt ?? item.timestamp)}</span>
          </article>
        ))}
      </div>
    </Surface>
  );
}
