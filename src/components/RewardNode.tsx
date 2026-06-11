import type { PassReward, CosmeticItem } from '../game/types';
import { RARITY_COLORS, RARITY_LABELS } from '../game/battlepass-config';
import { Lock, Check, Gift, Star } from 'lucide-react';

interface RewardNodeProps {
  reward: PassReward;
  currentLevel: number;
  isPremium: boolean;
  isClaimed: boolean;
  onClaim: (level: number) => void;
  position: 'start' | 'middle' | 'end';
}

function isCosmeticItem(item: unknown): item is CosmeticItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'type' in item &&
    'rarity' in item
  );
}

function RewardPreview({ item }: { item: CosmeticItem | { xpBonus: number } }) {
  if (isCosmeticItem(item)) {
    const rarity = RARITY_COLORS[item.rarity];
    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'CUE_SKIN': return '🎱';
        case 'TABLE_CLOTH': return '🎯';
        case 'CUE_BALL_PATTERN': return '⚪';
        case 'CHALK': return '✏️';
        case 'PORTRAIT_FRAME': return '🖼️';
        default: return '🎁';
      }
    };
    return (
      <div
        className={`w-12 h-12 rounded-lg ${rarity.bg} ${rarity.border} border-2 flex items-center justify-center text-2xl shadow-lg ${rarity.glow}`}
        title={`${item.name} - ${RARITY_LABELS[item.rarity]}`}
      >
        {getTypeIcon(item.type)}
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-yellow-400 flex items-center justify-center text-white font-bold shadow-lg shadow-yellow-500/40">
      <div className="text-center">
        <Star size={14} className="mx-auto" />
        <div className="text-[10px] leading-tight">{item.xpBonus}</div>
      </div>
    </div>
  );
}

export function RewardNode({
  reward,
  currentLevel,
  isPremium,
  isClaimed,
  onClaim,
  position,
}: RewardNodeProps) {
  const isUnlocked = reward.level <= currentLevel;
  const canClaim = isUnlocked && !isClaimed;
  const levelReached = reward.level <= currentLevel;

  const freeItem = reward.free;
  const premiumItem = reward.premium;

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-0 h-1 bg-gray-700 w-full -z-10" style={{
        left: position === 'start' ? '50%' : '0',
        width: position === 'start' ? '50%' : position === 'end' ? '50%' : '100%',
      }} />
      {levelReached && (
        <div
          className="absolute top-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 -z-10"
          style={{
            left: position === 'start' ? '50%' : '0',
            width: position === 'start' ? '50%' : position === 'end' ? '50%' : '100%',
          }}
        />
      )}

      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-all duration-300 ${
          levelReached
            ? 'bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 scale-100'
            : 'bg-gray-700 text-gray-400 border-2 border-gray-600'
        } ${canClaim ? 'animate-pulse ring-4 ring-yellow-400/50' : ''}`}
      >
        {isClaimed ? (
          <Check size={28} />
        ) : canClaim ? (
          <Gift size={24} />
        ) : (
          reward.level
        )}
      </div>

      <div className="space-y-1">
        {freeItem && (
          <div
            className={`group relative cursor-pointer transition-transform ${
              isUnlocked ? 'hover:scale-105' : 'opacity-60 grayscale'
            }`}
            onClick={() => canClaim && onClaim(reward.level)}
          >
            <div className="text-[10px] text-center text-emerald-400 mb-1">免费</div>
            <div className="flex justify-center">
              <RewardPreview item={freeItem} />
            </div>
            {canClaim && (
              <div className="absolute -inset-1 rounded-lg bg-yellow-400/20 animate-pulse -z-10" />
            )}
          </div>
        )}

        {premiumItem && (
          <div
            className={`group relative cursor-pointer transition-transform ${
              isUnlocked && isPremium
                ? 'hover:scale-105'
                : 'opacity-40 grayscale'
            }`}
            onClick={() => canClaim && isPremium && onClaim(reward.level)}
          >
            <div className="text-[10px] text-center text-purple-400 mb-1 mt-2 flex items-center justify-center gap-1">
              <Star size={10} /> 高级
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <RewardPreview item={premiumItem} />
                {!isPremium && (
                  <div className="absolute inset-0 rounded-lg bg-black/60 flex items-center justify-center">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            {canClaim && isPremium && (
              <div className="absolute -inset-1 rounded-lg bg-purple-400/20 animate-pulse -z-10" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
