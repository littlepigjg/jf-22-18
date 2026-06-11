import type { ReplayFile, BattlePassState } from '../game/types';
import { getCurrentSeason, DAILY_TASKS, WEEKLY_TASKS } from '../game/battlepass-config';

const REPLAYS_KEY = 'billiards_replays';
const SETTINGS_KEY = 'billiards_settings';
const BATTLEPASS_KEY = 'billiards_battlepass';

export function loadReplays(): ReplayFile[] {
  try {
    const raw = localStorage.getItem(REPLAYS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReplay(replay: ReplayFile): void {
  const replays = loadReplays();
  replays.unshift(replay);
  const limited = replays.slice(0, 20);
  try {
    localStorage.setItem(REPLAYS_KEY, JSON.stringify(limited));
  } catch (e) {
    console.error('Failed to save replay:', e);
  }
}

export function deleteReplay(id: string): void {
  const replays = loadReplays();
  const filtered = replays.filter((r) => r.id !== id);
  try {
    localStorage.setItem(REPLAYS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete replay:', e);
  }
}

export function getReplay(id: string): ReplayFile | null {
  const replays = loadReplays();
  return replays.find((r) => r.id === id) || null;
}

interface GameSettings {
  aiDifficulty: 'easy' | 'hard';
  showAimLine: boolean;
  volume: number;
}

const defaultSettings: GameSettings = {
  aiDifficulty: 'easy',
  showAimLine: true,
  volume: 0.7,
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Partial<GameSettings>): void {
  const current = loadSettings();
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

function isSameDay(dateStr1: string, dateStr2: string): boolean {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isSameWeek(dateStr1: string, dateStr2: string): boolean {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay));
  const dayOfWeek1 = d1.getDay() === 0 ? 7 : d1.getDay();
  const dayOfWeek2 = d2.getDay() === 0 ? 7 : d2.getDay();
  return diffDays < 7 && dayOfWeek1 >= dayOfWeek2;
}

function createInitialBattlePassState(): BattlePassState {
  const season = getCurrentSeason();
  const now = new Date().toISOString();
  return {
    seasonId: season.id,
    currentLevel: 0,
    currentXp: 0,
    isPremium: false,
    dailyTasks: DAILY_TASKS.map((t) => ({
      taskId: t.id,
      currentValue: 0,
      completed: false,
      claimed: false,
    })),
    weeklyTasks: WEEKLY_TASKS.map((t) => ({
      taskId: t.id,
      currentValue: 0,
      completed: false,
      claimed: false,
    })),
    claimedLevels: [],
    lastDailyReset: now,
    lastWeeklyReset: now,
    unlockedItems: [],
  };
}

export function loadBattlePass(): BattlePassState {
  try {
    const raw = localStorage.getItem(BATTLEPASS_KEY);
    const now = new Date();
    const nowStr = now.toISOString();
    const currentSeason = getCurrentSeason();

    if (!raw) {
      return createInitialBattlePassState();
    }

    const parsed: BattlePassState = JSON.parse(raw);

    if (parsed.seasonId !== currentSeason.id) {
      const newState = createInitialBattlePassState();
      newState.unlockedItems = [...(parsed.unlockedItems || [])];
      return newState;
    }

    if (!isSameDay(parsed.lastDailyReset, nowStr)) {
      parsed.dailyTasks = DAILY_TASKS.map((t) => ({
        taskId: t.id,
        currentValue: 0,
        completed: false,
        claimed: false,
      }));
      parsed.lastDailyReset = nowStr;
    }

    if (!isSameWeek(parsed.lastWeeklyReset, nowStr)) {
      parsed.weeklyTasks = WEEKLY_TASKS.map((t) => ({
        taskId: t.id,
        currentValue: 0,
        completed: false,
        claimed: false,
      }));
      parsed.lastWeeklyReset = nowStr;
    }

    return {
      ...createInitialBattlePassState(),
      ...parsed,
      dailyTasks: parsed.dailyTasks || DAILY_TASKS.map((t) => ({
        taskId: t.id,
        currentValue: 0,
        completed: false,
        claimed: false,
      })),
      weeklyTasks: parsed.weeklyTasks || WEEKLY_TASKS.map((t) => ({
        taskId: t.id,
        currentValue: 0,
        completed: false,
        claimed: false,
      })),
      unlockedItems: parsed.unlockedItems || [],
    };
  } catch (e) {
    console.error('Failed to load battle pass:', e);
    return createInitialBattlePassState();
  }
}

export function saveBattlePass(state: BattlePassState): void {
  try {
    localStorage.setItem(BATTLEPASS_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save battle pass:', e);
  }
}

export function getUnlockedCosmeticItems(): string[] {
  try {
    const state = loadBattlePass();
    return state.unlockedItems || [];
  } catch {
    return [];
  }
}
