import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './layout/AppShell';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LeaderboardPage } from '../pages/LeaderboardPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { RewardStorePage } from '../pages/RewardStorePage';
import { RouteSimulatorPage } from '../pages/RouteSimulatorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'routes',
        element: <RouteSimulatorPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'rewards',
        element: <RewardStorePage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
    ],
  },
]);
