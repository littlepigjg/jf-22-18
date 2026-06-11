export interface Vec2 {
  x: number;
  y: number;
}

export interface Ball {
  id: number;
  pos: Vec2;
  vel: Vec2;
  acc: Vec2;
  radius: number;
  color: string;
  stripe: boolean;
  pocketed: boolean;
  pocketedAt: number | null;
  spin: Vec2;
  number: number;
}

export interface Pocket {
  pos: Vec2;
  radius: number;
}

export interface Table {
  width: number;
  height: number;
  x: number;
  y: number;
  borderWidth: number;
  pockets: Pocket[];
}

export interface HitRecord {
  ballId: number;
  timestamp: number;
}

export enum FoulType {
  NONE = 'NONE',
  CUE_BALL_POCKETED = 'CUE_BALL_POCKETED',
  WRONG_FIRST_CONTACT = 'WRONG_FIRST_CONTACT',
  NO_BALL_HIT = 'NO_BALL_HIT',
  EIGHT_BALL_POCKETED_EARLY = 'EIGHT_BALL_POCKETED_EARLY',
}

export interface Shot {
  aimAngle: number;
  power: number;
  playerId: number;
  timestamp: number;
  hits: HitRecord[];
  pocketedBalls: number[];
  foul: FoulType;
}

export interface Player {
  id: number;
  name: string;
  isAI: boolean;
  aiDifficulty?: 'easy' | 'hard';
  group?: 'solid' | 'stripe' | null;
  score: number;
}

export type GameMode = '8ball' | '9ball';
export type PlayMode = 'pvp' | 'pve';
export type GamePhase =
  | 'setup'
  | 'aiming'
  | 'charging'
  | 'shooting'
  | 'simulating'
  | 'resolving'
  | 'gameover';

export interface GameState {
  mode: GameMode;
  playMode: PlayMode;
  phase: GamePhase;
  balls: Ball[];
  table: Table;
  currentPlayerId: number;
  players: Player[];
  currentShot: Shot | null;
  shotHistory: Shot[];
  foul: FoulType;
  foulMessage: string | null;
  winner: Player | null;
  turnNumber: number;
  targetBallHint: string | null;
  replayRecording: boolean;
  freeBall: boolean;
  groupsAssigned: boolean;
}

export interface ReplayFile {
  id: string;
  timestamp: number;
  duration: number;
  mode: GameMode;
  players: Player[];
  winner: Player | null;
  initialBalls: Ball[];
  shots: Shot[];
  frames: ReplayFrame[];
}

export interface ReplayFrame {
  frameIndex: number;
  balls: Ball[];
  phase: GamePhase;
  currentPlayerId: number;
}

export interface AIShotDecision {
  aimAngle: number;
  power: number;
  targetBallId: number;
}

export type TaskType =
  | 'COMPLETE_8BALL_GAMES'
  | 'SINGLE_BREAK_5_PLUS'
  | 'DEFEAT_HARD_AI'
  | 'TOTAL_SHOTS'
  | 'WIN_STREAK'
  | 'POCKET_BALLS'
  | 'CLEAN_SHEET_WINS';

export type TaskFrequency = 'daily' | 'weekly';

export interface TaskDefinition {
  id: string;
  type: TaskType;
  frequency: TaskFrequency;
  title: string;
  description: string;
  targetValue: number;
  xpReward: number;
  icon: string;
}

export interface TaskProgress {
  taskId: string;
  currentValue: number;
  completed: boolean;
  claimed: boolean;
}

export type RewardType = 'CUE_SKIN' | 'TABLE_CLOTH' | 'CUE_BALL_PATTERN' | 'CHALK' | 'PORTRAIT_FRAME';

export interface CosmeticItem {
  id: string;
  name: string;
  type: RewardType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  pattern?: string;
}

export interface PassReward {
  level: number;
  free?: CosmeticItem | { xpBonus: number };
  premium?: CosmeticItem | { xpBonus: number };
}

export interface BattlePassSeason {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalLevels: number;
  xpPerLevel: number;
  rewards: PassReward[];
}

export interface BattlePassState {
  seasonId: string;
  currentLevel: number;
  currentXp: number;
  isPremium: boolean;
  dailyTasks: TaskProgress[];
  weeklyTasks: TaskProgress[];
  claimedLevels: number[];
  lastDailyReset: string;
  lastWeeklyReset: string;
  unlockedItems: string[];
}

export interface GameSessionStats {
  is8Ball: boolean;
  gameCompleted: boolean;
  won: boolean;
  opponentDifficulty?: 'easy' | 'hard';
  isAI: boolean;
  pocketedBallsThisShot: number[];
  maxPocketedSingleShot: number;
  totalShots: number;
  totalPocketedBalls: number;
  cleanSheet: boolean;
  isPlayerTurn: boolean;
}
