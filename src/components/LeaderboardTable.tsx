import { formatCo2, formatCompactNumber, formatCurrency, formatDistance, getVehicleLabel } from '../lib/formatters';
import type { LeaderboardEntry } from '../types/ecoroute';
import { Surface } from './ui';

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <Surface className="table-panel">
      <div className="panel-head">
        <div>
          <p className="section-eyebrow">Top Eco-Driver</p>
          <h3>Leaderboard hemat BBM dan emisi</h3>
        </div>
      </div>
      <div className="table-wrap">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Driver</th>
              <th>Kendaraan</th>
              <th>Poin</th>
              <th>CO2</th>
              <th>Jarak Hemat</th>
              <th>Biaya Hemat</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>#{entry.rank}</td>
                <td>{entry.name}</td>
                <td>{getVehicleLabel(entry.vehicle_type)}</td>
                <td>{formatCompactNumber(entry.points)}</td>
                <td>{formatCo2(entry.total_co2_reduced_kg)}</td>
                <td>{formatDistance(entry.total_distance_saved_km)}</td>
                <td>{formatCurrency(entry.total_money_saved_idr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}
