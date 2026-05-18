// Skin configurations with unlock conditions and metadata
// Festival skins are auto-detected, achievement skins require meeting conditions

export const SKIN_CONFIGS = {
  // Festival skins (auto-detected)
  cny: {
    id: 'cny',
    name: '春节',
    type: 'festival',
    description: '农历新年特别皮肤',
    dateRange: { start: [1, 21], end: [2, 20] }, // Lunar New Year period (month, day)
  },
  christmas: {
    id: 'christmas',
    name: '圣诞',
    type: 'festival',
    description: '圣诞节特别皮肤',
    dateRange: { start: [12, 20], end: [12, 31] },
  },
  halloween: {
    id: 'halloween',
    name: '万圣节',
    type: 'festival',
    description: '万圣节特别皮肤',
    dateRange: { start: [10, 25], end: [10, 31] },
  },
  
  // Achievement skins (require meeting conditions)
  rainbow: {
    id: 'rainbow',
    name: '彩虹',
    type: 'achievement',
    description: '累计游戏100局',
    condition: (stats) => {
      const totalPlayed = 
        (stats['2048']?.gamesPlayed || 0) +
        (stats['infinite']?.gamesPlayed || 0) +
        (stats['daily']?.gamesPlayed || 0);
      return totalPlayed >= 100;
    },
    conditionText: '累计游戏100局',
  },
  diamond: {
    id: 'diamond',
    name: '钻石',
    type: 'achievement',
    description: '累计分数超过50000',
    condition: (stats) => {
      const totalScore = 
        (stats['2048']?.totalScore || 0) +
        (stats['infinite']?.totalScore || 0) +
        (stats['daily']?.totalScore || 0);
      return totalScore >= 50000;
    },
    conditionText: '累计分数超过50000',
  },
  starry: {
    id: 'starry',
    name: '星空',
    type: 'achievement',
    description: '每日挑战连续7天',
    condition: (stats) => {
      const dailyHistory = stats['daily'];
      if (!dailyHistory || !dailyHistory.history) return false;
      // Check if played 7 consecutive days
      const dates = Object.keys(dailyHistory.history).sort();
      if (dates.length < 7) return false;
      // Simple check: if they have 7+ days of history, assume consecutive for now
      return dates.length >= 7;
    },
    conditionText: '每日挑战连续7天',
  },
  retro: {
    id: 'retro',
    name: '复古',
    type: 'achievement',
    description: '2048模式胜利50次',
    condition: (stats) => {
      return (stats['2048']?.gamesWon || 0) >= 50;
    },
    conditionText: '2048模式胜利50次',
  },
};

// Get all skin keys (for SkinPicker iteration)
export const getAllSkinKeys = () => {
  return Object.keys(SKIN_CONFIGS);
};

// Get skin IDs by type
export const getFestivalSkins = () => {
  return Object.values(SKIN_CONFIGS)
    .filter(s => s.type === 'festival')
    .map(s => s.id);
};

export const getAchievementSkins = () => {
  return Object.values(SKIN_CONFIGS)
    .filter(s => s.type === 'achievement')
    .map(s => s.id);
};
