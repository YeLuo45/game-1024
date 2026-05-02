import { useCallback } from 'react';
import { useStorage } from './useStorage';

const STATS_KEY = 'game-1024-stats';

const defaultStats = {
  '2048': {
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
    totalScore: 0,
    maxTile: 0,
  },
  'infinite': {
    gamesPlayed: 0,
    bestScore: 0,
    totalScore: 0,
    maxTile: 0,
  },
  'daily': {
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
    totalScore: 0,
    maxTile: 0,
    perfectDays: 0,
  },
};

export function useStats() {
  const [stats, setStats] = useStorage(STATS_KEY, defaultStats);

  const updateStats = useCallback((playMode, { won, score, maxTile, isDaily }) => {
    const mode = isDaily ? 'daily' : playMode;
    
    setStats(prev => {
      const modeStats = prev[mode] || { ...defaultStats[mode] };
      const maxTileValue = typeof maxTile === 'number' ? maxTile : 0;
      
      return {
        ...prev,
        [mode]: {
          ...modeStats,
          gamesPlayed: (modeStats.gamesPlayed || 0) + 1,
          gamesWon: mode !== 'infinite' && won ? (modeStats.gamesWon || 0) + 1 : modeStats.gamesWon || 0,
          bestScore: Math.max(modeStats.bestScore || 0, score || 0),
          totalScore: (modeStats.totalScore || 0) + (score || 0),
          maxTile: Math.max(modeStats.maxTile || 0, maxTileValue),
          perfectDays: mode === 'daily' && won ? (modeStats.perfectDays || 0) + 1 : modeStats.perfectDays || 0,
        },
      };
    });
  }, [setStats]);

  const getStats = useCallback(() => stats, [stats]);

  return {
    stats,
    updateStats,
    getStats,
  };
}
