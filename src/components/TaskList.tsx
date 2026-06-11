import { useBattlePassStore } from '../stores/useBattlePassStore';
import { DAILY_TASKS, WEEKLY_TASKS } from '../game/battlepass-config';
import { Check, Gift, Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';

type TabType = 'daily' | 'weekly';

export function TaskList() {
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const dailyTasks = useBattlePassStore((s) => s.dailyTasks);
  const weeklyTasks = useBattlePassStore((s) => s.weeklyTasks);
  const claimTaskReward = useBattlePassStore((s) => s.claimTaskReward);

  const tasks = activeTab === 'daily' ? DAILY_TASKS : WEEKLY_TASKS;
  const progressList = activeTab === 'daily' ? dailyTasks : weeklyTasks;

  const getTimeRemaining = () => {
    const now = new Date();
    if (activeTab === 'daily') {
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      return `${hours}小时${minutes}分钟`;
    } else {
      const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
      const daysLeft = 7 - dayOfWeek;
      const end = new Date(now);
      end.setDate(end.getDate() + daysLeft);
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      return `${days}天${hours}小时`;
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Gift size={22} className="text-amber-400" />
          任务中心
        </h2>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock size={14} />
          <span>剩余 {getTimeRemaining()}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'daily'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
          }`}
        >
          每日任务
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'weekly'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
          }`}
        >
          每周任务
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((taskDef) => {
          const progress = progressList.find((p) => p.taskId === taskDef.id);
          if (!progress) return null;

          const percent = Math.min(
            (progress.currentValue / taskDef.targetValue) * 100,
            100
          );
          const canClaim = progress.completed && !progress.claimed;

          return (
            <div
              key={taskDef.id}
              className={`rounded-xl p-4 transition-all ${
                progress.claimed
                  ? 'bg-slate-900/40 border border-slate-700/50'
                  : canClaim
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/50 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-700/50 border border-slate-600/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    progress.claimed
                      ? 'bg-slate-800'
                      : canClaim
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg'
                      : 'bg-slate-600'
                  }`}
                >
                  {progress.claimed ? (
                    <Check size={24} className="text-emerald-400" />
                  ) : (
                    taskDef.icon
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3
                        className={`font-semibold ${
                          progress.claimed
                            ? 'text-slate-500 line-through'
                            : 'text-white'
                        }`}
                      >
                        {taskDef.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {taskDef.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-amber-400 font-bold text-lg">
                        +{taskDef.xpReward}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        经验值
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400">
                        进度 {progress.currentValue}/{taskDef.targetValue}
                      </span>
                      <span className="text-slate-400">
                        {Math.floor(percent)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress.claimed
                            ? 'bg-slate-600'
                            : progress.completed
                            ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center shrink-0 h-full">
                  {canClaim ? (
                    <button
                      onClick={() => claimTaskReward(taskDef.id, activeTab)}
                      className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-105"
                    >
                      <Gift size={16} />
                      领取
                    </button>
                  ) : progress.claimed ? (
                    <div className="text-emerald-400 font-semibold text-sm flex items-center gap-1">
                      <Check size={16} />
                      已领取
                    </div>
                  ) : (
                    <div className="text-slate-500">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
