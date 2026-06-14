import { formatCompactNumber } from '../lib/formatters';
import type { Reward } from '../types/ecoroute';
import { StatusPill, Surface } from './ui';

export function RewardCard({
  reward,
  canRedeem,
  isRedeeming,
  onRedeem,
}: {
  reward: Reward;
  canRedeem: boolean;
  isRedeeming?: boolean;
  onRedeem: () => void;
}) {
  return (
    <Surface className="reward-card">
      <div className="reward-card-head">
        <div>
          <p className="section-eyebrow">Reward Store</p>
          <h3>{reward.name}</h3>
        </div>
        <StatusPill tone={canRedeem ? 'success' : 'neutral'}>
          {formatCompactNumber(reward.points_required)} poin
        </StatusPill>
      </div>
      <p className="reward-value">{reward.reward_value_label}</p>
      <p className="reward-description">{reward.description}</p>
      <button
        className={canRedeem ? 'primary-button' : 'secondary-button'}
        disabled={!canRedeem || isRedeeming}
        onClick={onRedeem}
        type="button"
      >
        {isRedeeming ? 'Memproses...' : canRedeem ? 'Redeem Reward' : 'Poin Belum Cukup'}
      </button>
    </Surface>
  );
}
