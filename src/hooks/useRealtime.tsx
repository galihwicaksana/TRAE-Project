import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createNotificationEventSource } from '../services/sse-client';
import { API_MODE } from '../services/api-client';
import type { ConnectionStatus, NotificationEvent } from '../types/ecoroute';

interface ToastItem extends NotificationEvent {
  id: string;
}

interface RealtimeContextValue {
  connectionStatus: ConnectionStatus;
  liveEvents: NotificationEvent[];
  banner: NotificationEvent | null;
  celebration: NotificationEvent | null;
  toasts: ToastItem[];
  pushLocalEvents: (events: NotificationEvent[]) => void;
  dismissBanner: () => void;
  dismissCelebration: () => void;
  dismissToast: (id: string) => void;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

function normalizeEvent(event: NotificationEvent): NotificationEvent {
  return {
    ...event,
    createdAt: event.createdAt ?? event.timestamp,
  };
}

export function RealtimeProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const sourceRef = useRef<EventSource | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [liveEvents, setLiveEvents] = useState<NotificationEvent[]>([]);
  const [banner, setBanner] = useState<NotificationEvent | null>(null);
  const [celebration, setCelebration] = useState<NotificationEvent | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissBanner = useCallback(() => setBanner(null), []);
  const dismissCelebration = useCallback(() => setCelebration(null), []);
  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const handleEvent = useCallback(
    (event: NotificationEvent) => {
      const normalized = normalizeEvent(event);

      setLiveEvents((current) => [normalized, ...current].slice(0, 6));

      if (normalized.type === 'route_optimized') {
        setBanner(normalized);
        queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      }

      if (normalized.type === 'overspeed_warning' || normalized.type === 'reward_redeemed') {
        setToasts((current) => [
          {
            ...normalized,
            id: `${normalized.type}-${Date.now()}-${current.length}`,
          },
          ...current,
        ].slice(0, 4));
      }

      if (normalized.type === 'reward_milestone') {
        setCelebration(normalized);
      }

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    [queryClient],
  );

  const pushLocalEvents = useCallback(
    (events: NotificationEvent[]) => {
      events.forEach((event) => handleEvent(event));
    },
    [handleEvent],
  );

  useEffect(() => {
    if (API_MODE === 'demo') {
      setConnectionStatus('disconnected');
      return undefined;
    }

    const source = createNotificationEventSource();
    sourceRef.current = source;

    const handleConnected = () => {
      setConnectionStatus('connected');
    };

    const addTypedListener = (type: string) => {
      source.addEventListener(type, (rawEvent) => {
        const parsed = JSON.parse((rawEvent as MessageEvent<string>).data) as NotificationEvent;
        handleEvent(parsed);
      });
    };

    source.onopen = () => {
      setConnectionStatus('connected');
    };

    source.onerror = () => {
      setConnectionStatus((current) => (current === 'connected' ? 'reconnecting' : 'disconnected'));
    };

    source.addEventListener('connected', handleConnected);
    addTypedListener('route_optimized');
    addTypedListener('overspeed_warning');
    addTypedListener('reward_milestone');
    addTypedListener('reward_redeemed');

    return () => {
      source.removeEventListener('connected', handleConnected);
      source.close();
      sourceRef.current = null;
    };
  }, [handleEvent]);

  const value = useMemo<RealtimeContextValue>(
    () => ({
      connectionStatus,
      liveEvents,
      banner,
      celebration,
      toasts,
      pushLocalEvents,
      dismissBanner,
      dismissCelebration,
      dismissToast,
    }),
    [
      banner,
      celebration,
      connectionStatus,
      dismissBanner,
      dismissCelebration,
      dismissToast,
      liveEvents,
      pushLocalEvents,
      toasts,
    ],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);

  if (!context) {
    throw new Error('useRealtime harus digunakan di dalam RealtimeProvider');
  }

  return context;
}
