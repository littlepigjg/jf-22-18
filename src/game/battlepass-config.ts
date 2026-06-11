import type {
  TaskDefinition,
  BattlePassSeason,
  CosmeticItem,
  PassReward,
} from './types';

export const DAILY_TASKS: TaskDefinition[] = [
  {
    id: 'daily_8ball_3',
    type: 'COMPLETE_8BALL_GAMES',
    frequency: 'daily',
    title: '日常对局',
    description: '完成 3 局 8 球比赛',
    targetValue: 3,
    xpReward: 500,
    icon: '🎱',
  },
  {
    id: 'daily_pocket_5',
    type: 'SINGLE_BREAK_5_PLUS',
    frequency: 'daily',
    title: '一杆制胜',
    description: '单杆打进 5 球以上',
    targetValue: 1,
    xpReward: 300,
    icon: '🎯',
  },
  {
    id: 'daily_shots_100',
    type: 'TOTAL_SHOTS',
    frequency: 'daily',
    title: '勤奋练习',
    description: '累计击球 100 次',
    targetValue: 100,
    xpReward: 400,
    icon: '🏋️',
  },
  {
    id: 'daily_pocket_20',
    type: 'POCKET_BALLS',
    frequency: 'daily',
    title: '精准落袋',
    description: '累计打进 20 颗球',
    targetValue: 20,
    xpReward: 350,
    icon: '⭐',
  },
];

export const WEEKLY_TASKS: TaskDefinition[] = [
  {
    id: 'weekly_8ball_15',
    type: 'COMPLETE_8BALL_GAMES',
    frequency: 'weekly',
    title: '每周之战',
    description: '完成 15 局 8 球比赛',
    targetValue: 15,
    xpReward: 1500,
    icon: '🏆',
  },
  {
    id: 'weekly_defeat_hard',
    type: 'DEFEAT_HARD_AI',
    frequency: 'weekly',
    title: '强者之路',
    description: '击败困难难度 AI 3 次',
    targetValue: 3,
    xpReward: 1200,
    icon: '👑',
  },
  {
    id: 'weekly_win_streak',
    type: 'WIN_STREAK',
    frequency: 'weekly',
    title: '连胜达人',
    description: '达成 5 连胜',
    targetValue: 5,
    xpReward: 1000,
    icon: '🔥',
  },
  {
    id: 'weekly_shots_500',
    type: 'TOTAL_SHOTS',
    frequency: 'weekly',
    title: '持之以恒',
    description: '累计击球 500 次',
    targetValue: 500,
    xpReward: 800,
    icon: '💪',
  },
  {
    id: 'weekly_clean_sheet',
    type: 'CLEAN_SHEET_WINS',
    frequency: 'weekly',
    title: '零封胜利',
    description: '零封对手获胜 2 次',
    targetValue: 2,
    xpReward: 900,
    icon: '🛡️',
  },
];

export const ALL_TASKS: TaskDefinition[] = [...DAILY_TASKS, ...WEEKLY_TASKS];

export const COSMETIC_ITEMS: CosmeticItem[] = [
  {
    id: 'cue_classic_mahogany',
    name: '经典红木球杆',
    type: 'CUE_SKIN',
    rarity: 'common',
    description: '传统红木材质，沉稳大气',
    gradientFrom: '#8B4513',
    gradientTo: '#654321',
  },
  {
    id: 'cue_ocean_blue',
    name: '深海蓝球杆',
    type: 'CUE_SKIN',
    rarity: 'rare',
    description: '如深海般湛蓝的优雅球杆',
    gradientFrom: '#1E3A5F',
    gradientTo: '#0077BE',
  },
  {
    id: 'cue_gold_glory',
    name: '黄金荣耀球杆',
    type: 'CUE_SKIN',
    rarity: 'epic',
    description: '24K 镀金工艺，彰显王者风范',
    gradientFrom: '#FFD700',
    gradientTo: '#DAA520',
  },
  {
    id: 'cue_cosmic_rainbow',
    name: '星辰彩虹球杆',
    type: 'CUE_SKIN',
    rarity: 'legendary',
    description: '传说中由星尘铸造的传奇球杆',
    gradientFrom: '#FF6B6B',
    gradientTo: '#4ECDC4',
    pattern: 'rainbow',
  },
  {
    id: 'cloth_emerald_green',
    name: '翡翠绿台呢',
    type: 'TABLE_CLOTH',
    rarity: 'common',
    description: '经典翡翠绿色台呢',
    color: '#0B6623',
  },
  {
    id: 'cloth_royal_purple',
    name: '皇家紫台呢',
    type: 'TABLE_CLOTH',
    rarity: 'rare',
    description: '高贵典雅的皇家紫色',
    color: '#6B3FA0',
  },
  {
    id: 'cloth_velvet_black',
    name: '丝绒黑台呢',
    type: 'TABLE_CLOTH',
    rarity: 'epic',
    description: '顶级赛事专用黑色台呢',
    color: '#1A1A2E',
  },
  {
    id: 'cloth_sakura_pink',
    name: '樱花粉台呢',
    type: 'TABLE_CLOTH',
    rarity: 'legendary',
    description: '限定樱花季主题台呢',
    color: '#FFB7C5',
  },
  {
    id: 'ball_classic_white',
    name: '经典白球',
    type: 'CUE_BALL_PATTERN',
    rarity: 'common',
    description: '标准纯白母球',
    color: '#FFFFFF',
  },
  {
    id: 'ball_aurora',
    name: '极光白球',
    type: 'CUE_BALL_PATTERN',
    rarity: 'rare',
    description: '带有极光光泽的母球',
    pattern: 'aurora',
  },
  {
    id: 'ball_galaxy',
    name: '星河白球',
    type: 'CUE_BALL_PATTERN',
    rarity: 'epic',
    description: '蕴含璀璨星河的神秘母球',
    pattern: 'galaxy',
  },
  {
    id: 'ball_phoenix',
    name: '凤凰白球',
    type: 'CUE_BALL_PATTERN',
    rarity: 'legendary',
    description: '浴火重生的凤凰图腾母球',
    pattern: 'phoenix',
  },
  {
    id: 'chalk_blue_pro',
    name: '职业蓝巧克',
    type: 'CHALK',
    rarity: 'common',
    description: '专业级蓝色巧克粉',
    color: '#1E90FF',
  },
  {
    id: 'chalk_gold_premium',
    name: '至尊金巧克',
    type: 'CHALK',
    rarity: 'epic',
    description: '锦标赛专用金色巧克粉',
    color: '#FFD700',
  },
  {
    id: 'frame_silver',
    name: '银色头像框',
    type: 'PORTRAIT_FRAME',
    rarity: 'rare',
    description: '精致银色边框',
    color: '#C0C0C0',
  },
  {
    id: 'frame_diamond',
    name: '钻石头像框',
    type: 'PORTRAIT_FRAME',
    rarity: 'legendary',
    description: '顶级钻石镶嵌头像框',
    color: '#B9F2FF',
    pattern: 'diamond',
  },
];

export function getCosmeticItem(id: string): CosmeticItem | undefined {
  return COSMETIC_ITEMS.find((item) => item.id === id);
}

export function generateSeasonRewards(): PassReward[] {
  const rewards: PassReward[] = [];
  const freeItems = COSMETIC_ITEMS.filter((i) => i.rarity === 'common' || i.rarity === 'rare');
  const premiumItems = COSMETIC_ITEMS;

  for (let level = 1; level <= 50; level++) {
    const reward: PassReward = { level };

    if (level % 5 === 0) {
      const freeIdx = Math.floor((level / 5 - 1) * 2) % freeItems.length;
      const freeItem = freeItems[freeIdx];
      if (freeItem) reward.free = freeItem;
    } else if (level % 2 === 0) {
      reward.free = { xpBonus: 50 + Math.floor(level / 10) * 25 };
    }

    if (level % 3 === 0) {
      const premiumIdx = Math.floor((level / 3 - 1)) % premiumItems.length;
      const premiumItem = premiumItems[premiumIdx];
      if (premiumItem) reward.premium = premiumItem;
    } else if (level % 2 === 1) {
      reward.premium = { xpBonus: 100 + Math.floor(level / 5) * 50 };
    }

    rewards.push(reward);
  }

  return rewards;
}

export function getCurrentSeason(): BattlePassSeason {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return {
    id: `season_${year}_${(month + 1).toString().padStart(2, '0')}`,
    name: `${year}年${month + 1}月赛季`,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalLevels: 50,
    xpPerLevel: 1000,
    rewards: generateSeasonRewards(),
  };
}

export const XP_PER_LEVEL = 1000;

export const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: {
    bg: 'bg-gray-600',
    border: 'border-gray-400',
    text: 'text-gray-200',
    glow: 'shadow-gray-500/30',
  },
  rare: {
    bg: 'bg-blue-600',
    border: 'border-blue-400',
    text: 'text-blue-200',
    glow: 'shadow-blue-500/40',
  },
  epic: {
    bg: 'bg-purple-600',
    border: 'border-purple-400',
    text: 'text-purple-200',
    glow: 'shadow-purple-500/50',
  },
  legendary: {
    bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    border: 'border-yellow-400',
    text: 'text-yellow-100',
    glow: 'shadow-yellow-500/60',
  },
};

export const RARITY_LABELS: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};
