import { useState } from 'react';
import { useBattlePassStore } from '../stores/useBattlePassStore';
import { COSMETIC_ITEMS, RARITY_COLORS, RARITY_LABELS } from '../game/battlepass-config';
import type { RewardType, CosmeticItem } from '../game/types';
import { Package, Lock, Check, Filter } from 'lucide-react';

type FilterType = 'all' | RewardType;

const TYPE_LABELS: Record<RewardType, string> = {
  CUE_SKIN: '球杆皮肤',
  TABLE_CLOTH: '台呢主题',
  CUE_BALL_PATTERN: '白球图案',
  CHALK: '巧克粉',
  PORTRAIT_FRAME: '头像框',
};

const TYPE_ICONS: Record<RewardType, string> = {
  CUE_SKIN: '🎱',
  TABLE_CLOTH: '🎯',
  CUE_BALL_PATTERN: '⚪',
  CHALK: '✏️',
  PORTRAIT_FRAME: '🖼️',
};

function ItemCard({ item, unlocked }: { item: CosmeticItem; unlocked: boolean }) {
  const rarity = RARITY_COLORS[item.rarity];
  return (
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-300 ${
        unlocked
          ? `${rarity.bg}/10 border-2 ${rarity.border}/40 hover:border-opacity-80 hover:scale-[1.02] shadow-lg ${rarity.glow}`
          : 'bg-slate-800/40 border-2 border-slate-700/40'
      }`}
    >
      <div
        className={`w-full aspect-square rounded-xl mb-3 flex items-center justify-center text-5xl relative overflow-hidden ${
          unlocked ? '' : 'grayscale opacity-40'
        }`}
        style={{
          background: item.gradientFrom && item.gradientTo
            ? `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`
            : item.color
              ? item.color
              : 'linear-gradient(135deg, #374151, #1f2937)',
        }}
      >
        <span className="drop-shadow-lg">{TYPE_ICONS[item.type]}</span>
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Lock size={28} className="text-slate-400" />
          </div>
        )}
        {unlocked && item.pattern && (
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            backgroundImage: item.pattern === 'rainbow'
              ? 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)'
              : item.pattern === 'galaxy'
              ? 'radial-gradient(circle at 30% 30%, #fff, transparent 2px), radial-gradient(circle at 70% 60%, #fff, transparent 1px), radial-gradient(circle at 50% 80%, #ffd700, transparent 1.5px)'
              : item.pattern === 'aurora'
              ? 'linear-gradient(135deg, rgba(0,255,136,0.5), rgba(0,200,255,0.5), rgba(255,100,255,0.5))'
              : item.pattern === 'phoenix'
              ? 'radial-gradient(circle, rgba(255,100,0,0.6), rgba(255,0,0,0.3), transparent)'
              : item.pattern === 'diamond'
              ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)'
              : undefined,
            backgroundSize: item.pattern === 'galaxy' ? '100% 100%' : undefined,
          }} />
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-slate-500'}`}>
            {item.name}
          </h4>
          {unlocked && (
            <div className={`w-5 h-5 rounded-full ${rarity.bg} flex items-center justify-center`}>
              <Check size={12} className="text-white" />
            </div>
          )}
        </div>
        <p className={`text-[11px] ${unlocked ? 'text-slate-400' : 'text-slate-600'} line-clamp-2`}>
          {item.description}
        </p>
        <div className="pt-1">
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${rarity.bg} ${rarity.text}`}>
            {RARITY_LABELS[item.rarity]}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CosmeticInventory() {
  const isItemUnlocked = useBattlePassStore((s) => s.isItemUnlocked);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredItems = filter === 'all'
    ? COSMETIC_ITEMS
    : COSMETIC_ITEMS.filter((item) => item.type === filter);

  const unlockedCount = COSMETIC_ITEMS.filter((item) => isItemUnlocked(item.id)).length;
  const totalCount = COSMETIC_ITEMS.length;

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'CUE_SKIN', label: TYPE_LABELS.CUE_SKIN },
    { value: 'TABLE_CLOTH', label: TYPE_LABELS.TABLE_CLOTH },
    { value: 'CUE_BALL_PATTERN', label: TYPE_LABELS.CUE_BALL_PATTERN },
    { value: 'CHALK', label: TYPE_LABELS.CHALK },
    { value: 'PORTRAIT_FRAME', label: TYPE_LABELS.PORTRAIT_FRAME },
  ];

  return (
    <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-6 border border-slate-700 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <Package size={22} className="text-purple-400" />
            我的收藏
          </h2>
          <p className="text-sm text-slate-400">
            已解锁 {unlockedCount} / {totalCount} 件物品
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter size={14} />
            <span>筛选</span>
          </div>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === option.value
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-full transition-all duration-700"
          style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            unlocked={isItemUnlocked(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
