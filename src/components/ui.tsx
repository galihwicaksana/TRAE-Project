import type { PropsWithChildren, ReactNode } from 'react';
import { getSeverityLabel } from '../lib/formatters';
import type { NotificationEvent, NotificationSeverity } from '../types/ecoroute';

export function PageSection({
  title,
  eyebrow,
  description,
  action,
  children,
}: PropsWithChildren<{
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
}>) {
  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {description ? <p className="section-description">{description}</p> : null}
        </div>
        {action ? <div className="section-action">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function Surface({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  return <div className={`surface ${className}`.trim()}>{children}</div>;
}

export function HeroSurface({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title: string; subtitle: string }>) {
  return (
    <section className="hero-surface">
      <div className="hero-copy">
        <p className="section-eyebrow">Malang Route Intelligence</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="hero-aux">{children}</div>
    </section>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  hint: string;
  tone?: 'neutral' | 'accent';
}) {
  return (
    <Surface className={`kpi-card ${tone === 'accent' ? 'kpi-card-accent' : ''}`}>
      <p className="kpi-label">{label}</p>
      <strong className="kpi-value">{value}</strong>
      <span className="kpi-hint">{hint}</span>
    </Surface>
  );
}

export function ProgressCard({
  title,
  currentLabel,
  minimum,
  stretch,
  progress,
}: {
  title: string;
  currentLabel: string;
  minimum: string;
  stretch: string;
  progress: number;
}) {
  return (
    <Surface className="progress-card">
      <div className="progress-head">
        <div>
          <p className="section-eyebrow">Target Reduction</p>
          <h3>{title}</h3>
        </div>
        <strong>{currentLabel}</strong>
      </div>
      <div className="progress-rail">
        <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <div className="progress-meta">
        <span>Minimum {minimum}</span>
        <span>Stretch {stretch}</span>
      </div>
    </Surface>
  );
}

export function AlertBanner({
  event,
  onDismiss,
}: {
  event: NotificationEvent;
  onDismiss?: () => void;
}) {
  return (
    <div className={`alert-banner alert-${event.severity}`}>
      <div>
        <p className="alert-title">{event.title}</p>
        <p className="alert-message">{event.message}</p>
      </div>
      {onDismiss ? (
        <button className="ghost-button" onClick={onDismiss} type="button">
          Tutup
        </button>
      ) : null}
    </div>
  );
}

export function StatusPill({ tone, children }: PropsWithChildren<{ tone: NotificationSeverity | 'neutral' }>) {
  return <span className={`status-pill tone-${tone}`}>{children}</span>;
}

export function LoadingPanel({ message = 'Memuat data EcoRoute...' }: { message?: string }) {
  return (
    <Surface className="state-panel">
      <div className="loader" />
      <p>{message}</p>
    </Surface>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Surface className="state-panel">
      <p className="section-eyebrow">Ready State</p>
      <h3>{title}</h3>
      <p className="section-description">{description}</p>
      {action}
    </Surface>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Surface className="state-panel error-panel">
      <p className="section-eyebrow">Connection Issue</p>
      <h3>Backend belum terhubung</h3>
      <p className="section-description">{message}</p>
    </Surface>
  );
}

export function ToastStack({
  items,
  onDismiss,
}: {
  items: Array<NotificationEvent & { id: string }>;
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="toast-stack">
      {items.map((item) => (
        <div key={item.id} className={`toast-card toast-${item.severity}`}>
          <div>
            <strong>{item.title}</strong>
            <p>{item.message}</p>
          </div>
          <button className="ghost-button small" onClick={() => onDismiss(item.id)} type="button">
            x
          </button>
        </div>
      ))}
    </div>
  );
}

export function CelebrationModal({
  event,
  onClose,
}: {
  event: NotificationEvent | null;
  onClose: () => void;
}) {
  if (!event) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="celebration-modal" role="dialog" aria-modal="true" aria-labelledby="celebration-title">
        <p className="section-eyebrow">Milestone Reward</p>
        <h3 id="celebration-title">{event.title}</h3>
        <p>{event.message}</p>
        <div className="celebration-ring">
          <span>Top Eco-Driver</span>
        </div>
        <button className="primary-button" onClick={onClose} type="button">
          Lanjutkan Demo
        </button>
      </div>
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: NotificationSeverity }) {
  return <StatusPill tone={severity}>{getSeverityLabel(severity)}</StatusPill>;
}
