import { create } from 'zustand';
import type {
  BattlePassState,
  TaskProgress,
  GameSessionStats,
  TaskType,
  CosmeticItem,
} from '../game/types';
import {
  loadBattlePass,
  saveBattlePass,
} from '../utils/storage';
import {
  ALL_TASKS,
  XP_PER_LEVEL,
  getCurrentSeason,
  getCosmeticItem,
} from '../game/battlepass-config';

interface BattlePassStore extends BattlePassState {
  currentWinStreak: number;
  lastGameResult: 'win' | 'loss' | null;
  addXp: (amount: number) => { leveledUp: boolean; newLevel: number };
  updateTaskProgress: (taskType: TaskType, increment: number) => void;
  claimTaskReward: (taskId: string, frequency: 'daily' | 'weekly') => void;
  claimLevelReward: (level: number) => void;
  processGameEnd: (stats: GameSessionStats) => void;
  processShotComplete: (pocketedCount: number, isPlayerTurn: boolean) => void;
  processShotTaken: (isPlayerTurn: boolean) => void;
  unlockPremium: () => void;
  refreshState: () => void;
  isItemUnlocked: (itemId: string) => boolean;
  getTotalXp: () => number;
  getXpToNextLevel: () => number;
  getCurrentSeasonEndDate: () => Date;
  getUnlockedCosmetics: () => CosmeticItem[];
}

export const useBattlePassStore = create<BattlePassStore>((set, get) => ({
  ...loadBattlePass(),
  currentWinStreak: 0,
  lastGameResult: null,

  addXp: (amount) => {
    const state = get();
    const season = getCurrentSeason();
    let currentXp = state.currentXp + amount;
    let currentLevel = state.currentLevel;
    let leveledUp = false;

    while (currentXp >= XP_PER_LEVEL && currentLevel < season.totalLevels) {
      currentXp -= XP_PER_LEVEL;
      currentLevel++;
      leveledUp = true;
    }

    if (currentLevel >= season.totalLevels) {
      currentXp = 0;
    }

    const newState = {
      ...state,
      currentXp,
      currentLevel,
    };
    saveBattlePass(newState);
    set(newState);

    return { leveledUp, newLevel: currentLevel };
  },

  updateTaskProgress: (taskType, increment) => {
    const state = get();
    const taskDefs = ALL_TASKS.filter((t) => t.type === taskType);

    const updateProgressList = (
      progressList: TaskProgress[],
    ): TaskProgress[] => {
      return progressList.map((progress) => {
        const taskDef = taskDefs.find((t) => t.id === progress.taskId);
        if (!taskDef || progress.completed || progress.claimed) {
          return progress;
        }
        const newValue = Math.min(progress.currentValue + increment, taskDef.targetValue);
        return {
          ...progress,
          currentValue: newValue,
          completed: newValue >= taskDef.targetValue,
        };
      });
    };

    const newDailyTasks = updateProgressList(state.dailyTasks);
    const newWeeklyTasks = updateProgressList(state.weeklyTasks);

    const newState = {
      ...state,
      dailyTasks: newDailyTasks,
      weeklyTasks: newWeeklyTasks,
    };
    saveBattlePass(newState);
    set(newState);
  },

  claimTaskReward: (taskId, frequency) => {
    const state = get();
    const taskKey = frequency === 'daily' ? 'dailyTasks' : 'weeklyTasks';
    const tasks = state[taskKey];
    const taskProgress = tasks.find((t) => t.taskId === taskId);
    const taskDef = ALL_TASKS.find((t) => t.id === taskId);

    if (!taskProgress || !taskDef || !taskProgress.completed || taskProgress.claimed) {
      return;
    }

    const updatedTasks = tasks.map((t) =>
      t.taskId === taskId ? { ...t, claimed: true } : t
    );

    const newState = {
      ...state,
      [taskKey]: updatedTasks,
    };
    saveBattlePass(newState);
    set(newState);

    get().addXp(taskDef.xpReward);
  },

  claimLevelReward: (level) => {
    const state = get();
    const season = getCurrentSeason();
    const reward = season.rewards.find((r) => r.level === level);

    if (!reward || state.claimedLevels.includes(level)) {
      return;
    }
    if (level > state.currentLevel) {
      return;
    }

    const unlockedItems = [...state.unlockedItems];

    if (reward.free && !('xpBonus' in reward.free)) {
      const freeItem = reward.free as CosmeticItem;
      if (!unlockedItems.includes(freeItem.id)) {
        unlockedItems.push(freeItem.id);
      }
    } else if (reward.free && 'xpBonus' in reward.free) {
      get().addXp(reward.free.xpBonus);
    }

    if (state.isPremium && reward.premium) {
      if (!('xpBonus' in reward.premium)) {
        const premiumItem = reward.premium as CosmeticItem;
        if (!unlockedItems.includes(premiumItem.id)) {
          unlockedItems.push(premiumItem.id);
        }
      } else {
        get().addXp(reward.premium.xpBonus);
      }
    }

    const newState = {
      ...state,
      claimedLevels: [...state.claimedLevels, level],
      unlockedItems,
    };
    saveBattlePass(newState);
    set(newState);
  },

  processGameEnd: (stats) => {
    const state = get();

    if (stats.gameCompleted && stats.isPlayerTurn && stats.is8Ball) {
      get().updateTaskProgress('COMPLETE_8BALL_GAMES', 1);
    }

    if (stats.won && stats.isPlayerTurn) {
      const newWinStreak = state.lastGameResult === 'win' ? state.currentWinStreak + 1 : 1;
      get().updateTaskProgress('WIN_STREAK', newWinStreak - state.currentWinStreak > 0 ? 1 : 0);
      if (newWinStreak >= 1) {
        get().updateTaskProgress('WIN_STREAK', newWinStreak);
      }
      set({ currentWinStreak: newWinStreak, lastGameResult: 'win' });

      if (stats.isAI && stats.opponentDifficulty === 'hard') {
        get().updateTaskProgress('DEFEAT_HARD_AI', 1);
      }

      if (stats.cleanSheet) {
        get().updateTaskProgress('CLEAN_SHEET_WINS', 1);
      }
    } else if (!stats.won && stats.isPlayerTurn) {
      set({ currentWinStreak: 0, lastGameResult: 'loss' });
    }
  },

  processShotComplete: (pocketedCount, isPlayerTurn) => {
    if (!isPlayerTurn) return;

    if (pocketedCount >= 5) {
      get().updateTaskProgress('SINGLE_BREAK_5_PLUS', 1);
    }

    if (pocketedCount > 0) {
      get().updateTaskProgress('POCKET_BALLS', pocketedCount);
    }
  },

  processShotTaken: (isPlayerTurn) => {
    if (isPlayerTurn) {
      get().updateTaskProgress('TOTAL_SHOTS', 1);
    }
  },

  unlockPremium: () => {
    const state = get();
    const newState = { ...state, isPremium: true };
    saveBattlePass(newState);
    set(newState);
  },

  refreshState: () => {
    const fresh = loadBattlePass();
    set({ ...fresh });
  },

  isItemUnlocked: (itemId) => {
    return get().unlockedItems.includes(itemId);
  },

  getTotalXp: () => {
    const state = get();
    return state.currentLevel * XP_PER_LEVEL + state.currentXp;
  },

  getXpToNextLevel: () => {
    return XP_PER_LEVEL - get().currentXp;
  },

  getCurrentSeasonEndDate: () => {
    return new Date(getCurrentSeason().endDate);
  },

  getUnlockedCosmetics: () => {
    return get()
      .unlockedItems.map((id) => getCosmeticItem(id))
      .filter((item): item is CosmeticItem => item !== undefined);
  },
}));
