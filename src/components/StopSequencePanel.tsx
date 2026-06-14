import { Surface } from './ui';
import type { MockLocation } from '../types/ecoroute';

interface StopSequencePanelProps {
  baselineStops: MockLocation[];
  optimizedStops: MockLocation[];
}

export function StopSequencePanel({ baselineStops, optimizedStops }: StopSequencePanelProps) {
  const optimizedIndexMap = new Map(optimizedStops.map((stop, index) => [stop.id, index + 1]));

  return (
    <Surface className="sequence-panel">
      <div className="panel-head">
        <div>
          <p className="section-eyebrow">Stop Sequence Shift</p>
          <h3>Urutan input vs hasil optimasi</h3>
        </div>
      </div>
      <div className="sequence-list">
        {baselineStops.map((stop, index) => (
          <div key={stop.id} className="sequence-row">
            <div>
              <span className="sequence-index">{index + 1}</span>
              <div>
                <strong>{stop.label}</strong>
                <p>
                  {stop.city}, {stop.province}
                </p>
              </div>
            </div>
            <div className="sequence-shift">
              <span>Optimal #{optimizedIndexMap.get(stop.id) ?? '-'}</span>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}
