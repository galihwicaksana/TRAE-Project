import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/routes', label: 'Route Simulator' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/rewards', label: 'Reward Store' },
  { to: '/notifications', label: 'Notifications' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="brand-kicker">SDG 12 + SDG 13</p>
        <h1>EcoRoute</h1>
        <span>Climate-tech dashboard untuk armada logistik UMKM.</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={item.end}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Eco-driving score armada Jatim</p>
        <strong>Target reduksi 15-20%</strong>
      </div>
    </aside>
  );
}
