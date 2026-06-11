import { useMemo, useRef, useState, useEffect } from 'react';
import { useBattlePassStore } from '../stores/useBattlePassStore';
import { getCurrentSeason, XP_PER_LEVEL } from '../game/battlepass-config';
import { RewardNode } from './RewardNode';
import { TaskList } from './TaskList';
import { CosmeticInventory } from './CosmeticInventory';
import {
  Trophy,
  Crown,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BattlePassPage() {
  const navigate = useNavigate();
  const currentLevel = useBattlePassStore((s) => s.currentLevel);
  const currentXp = useBattlePassStore((s) => s.currentXp);
  const isPremium = useBattlePassStore((s) => s.isPremium);
  const claimedLevels = useBattlePassStore((s) => s.claimedLevels);
  const claimLevelReward = useBattlePassStore((s) => s.claimLevelReward);
  const unlockPremium = useBattlePassStore((s) => s.unlockPremium);
  const getTotalXp = useBattlePassStore((s) => s.getTotalXp);
  const season = useMemo(() => getCurrentSeason(), []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const visibleLevels = 10;
  const startLevel = Math.max(1, Math.min(currentLevel - 2, season.totalLevels - visibleLevels + 1));
  const endLevel = Math.min(startLevel + visibleLevels - 1, season.totalLevels);
  const levelsToShow = season.rewards.filter(
    (r) => r.level >= startLevel && r.level <= endLevel
  );

  const totalXpNeeded = season.totalLevels * XP_PER_LEVEL;
  const totalXpHave = getTotalXp();
  const overallPercent = Math.min((totalXpHave / totalXpNeeded) * 100, 100);

  const xpPercent = (currentXp / XP_PER_LEVEL) * 100;

  const seasonEndDate = new Date(season.endDate);
  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((seasonEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  const handleScroll = () => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const max = el.scrollWidth - el.clientWidth;
      setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollBy = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  const pendingClaims = season.rewards.filter(
    (r) =>
      r.level <= currentLevel &&
      !claimedLevels.includes(r.level) &&
      (r.free || (isPremium && r.premium))
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white font-semibold transition-all w-fit"
        >
          <ArrowLeft size={18} />
          返回主菜单
        </button>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-8 shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-300 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy size={32} className="text-yellow-300 drop-shadow-lg" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    {season.name}
                  </h1>
                  <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                    <Calendar size={14} />
                    <span>赛季剩余 {daysLeft} 天</span>
                  </div>
                </div>
              </div>
            </div>

            {!isPremium && (
              <button
                onClick={unlockPremium}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 font-bold rounded-2xl shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform"
              >
                <Crown size={20} />
                解锁高级通行证
              </button>
            )}
            {isPremium && (
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 border-2 border-amber-400 text-amber-300 font-bold rounded-2xl">
                <Crown size={20} className="text-amber-400" />
                高级通行证已激活
              </div>
            )}
          </div>

          <div className="relative z-10 mt-6 md:mt-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white drop-shadow-lg">
                  Lv.{currentLevel}
                </span>
                <span className="text-white/70 font-semibold">
                  / {season.totalLevels}
                </span>
              </div>
              <div className="text-right">
                <div className="text-white/90 font-bold">
                  {currentXp.toLocaleString()} / {XP_PER_LEVEL.toLocaleString()} XP
                </div>
                <div className="text-white/60 text-sm">
                  总进度 {totalXpHave.toLocaleString()} / {totalXpNeeded.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="h-4 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-300 rounded-full transition-all duration-700 relative overflow-hidden"
                style={{ width: `${xpPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
              </div>
            </div>

            <div className="mt-2 h-1.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400/50 to-pink-400/50 rounded-full transition-all duration-700"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur rounded-3xl p-4 md:p-6 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" />
              <h2 className="text-lg font-bold text-white">奖励里程碑</h2>
              {pendingClaims > 0 && (
                <span className="px-2.5 py-0.5 bg-amber-500 text-amber-900 text-xs font-bold rounded-full animate-pulse">
                  {pendingClaims} 待领取
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollBy('left')}
                className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={scrollProgress < 0.05}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollBy('right')}
                className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={scrollProgress > 0.95}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div
              className="flex gap-6 min-w-max py-4"
              style={{ paddingLeft: startLevel === 1 ? '0.5rem' : '0', paddingRight: endLevel === season.totalLevels ? '0.5rem' : '0' }}
            >
              {levelsToShow.map((reward, index) => {
                const position =
                  index === 0 && startLevel === 1
                    ? 'start'
                    : index === levelsToShow.length - 1 && endLevel === season.totalLevels
                    ? 'end'
                    : 'middle';
                return (
                  <RewardNode
                    key={reward.level}
                    reward={reward}
                    currentLevel={currentLevel}
                    isPremium={isPremium}
                    isClaimed={claimedLevels.includes(reward.level)}
                    onClaim={claimLevelReward}
                    position={position as 'start' | 'middle' | 'end'}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-4 h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>

        <TaskList />

        <CosmeticInventory />
      </div>
    </div>
  );
}
