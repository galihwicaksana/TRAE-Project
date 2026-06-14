import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MALANG_CENTER } from '../lib/demo';
import { Surface } from './ui';
import type { MockLocation } from '../types/ecoroute';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface RouteMapPanelProps {
  origin?: MockLocation | null;
  baselineStops: MockLocation[];
  optimizedStops: MockLocation[];
}

function buildPath(origin?: MockLocation | null, stops: MockLocation[] = []) {
  const points = [origin, ...stops].filter(Boolean) as MockLocation[];
  return points.map((point) => [point.latitude, point.longitude] as [number, number]);
}

export function RouteMapPanel({ origin, baselineStops, optimizedStops }: RouteMapPanelProps) {
  const baselinePath = buildPath(origin, baselineStops);
  const optimizedPath = buildPath(origin, optimizedStops);
  const allPoints = [...baselinePath, ...optimizedPath];
  const center = allPoints[0] ?? MALANG_CENTER;

  return (
    <Surface className="map-panel">
      <div className="panel-head">
        <div>
          <p className="section-eyebrow">Interactive Route Map</p>
          <h3>Perbandingan baseline dan rute optimal</h3>
        </div>
        <div className="map-legend">
          <span>
            <i className="legend-line baseline" />
            Baseline
          </span>
          <span>
            <i className="legend-line optimized" />
            Optimized
          </span>
        </div>
      </div>
      <div className="map-shell">
        <MapContainer center={center} zoom={10} scrollWheelZoom className="map-canvas">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {origin ? (
            <Marker position={[origin.latitude, origin.longitude]}>
              <Popup>{origin.label}</Popup>
            </Marker>
          ) : null}
          {baselineStops.map((stop) => (
            <Marker key={stop.id} position={[stop.latitude, stop.longitude]}>
              <Popup>{stop.label}</Popup>
            </Marker>
          ))}
          {baselinePath.length > 1 ? (
            <Polyline pathOptions={{ color: '#9ca790', weight: 5, opacity: 0.72 }} positions={baselinePath} />
          ) : null}
          {optimizedPath.length > 1 ? (
            <Polyline pathOptions={{ color: '#8eff75', weight: 6, opacity: 0.92 }} positions={optimizedPath} />
          ) : null}
        </MapContainer>
      </div>
    </Surface>
  );
}
