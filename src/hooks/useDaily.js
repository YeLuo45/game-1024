import { useState, useEffect, useCallback } from 'react';
import { getDailyDateStr, generateDailyGrid, isToday } from '../utils/daily';

const STORAGE_KEY = 'game-1024-daily';

function loadDailyState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error loading daily state:', e);
  }
  return null;
}

function saveDailyState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Error saving daily state:', e);
  }
}

export function useDaily() {
  const [dailyState, setDailyState] = useState(() => {
    const saved = loadDailyState();
    const today = getDailyDateStr();
    
    // If saved date is not today, reset for new day
    if (saved && saved.date !== today) {
      // Check if they played yesterday and 2 days before for daily-3 achievement
      const newState = {
        date: today,
        bestScore: 0,
        playedToday: false,
        history: saved.history || {},
      };
      // Record yesterday's score in history
      if (saved.playedToday && saved.date) {
        newState.history[saved.date] = saved.bestScore;
      }
      return newState;
    }
    
    return saved || {
      date: today,
      bestScore: 0,
      playedToday: false,
      history: {},
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveDailyState(dailyState);
  }, [dailyState]);

  const dailyGrid = generateDailyGrid(new Date(dailyState.date));

  const updateBestScore = useCallback((score) => {
    setDailyState(prev => {
      if (score > prev.bestScore) {
        return { ...prev, bestScore: score, playedToday: true };
      }
      return { ...prev, playedToday: true };
    });
  }, []);

  const getPlayedDaysCount = useCallback(() => {
    return Object.keys(dailyState.history).length + (dailyState.playedToday ? 1 : 0);
  }, [dailyState]);

  return {
    dailyDate: dailyState.date,
    bestScore: dailyState.bestScore,
    playedToday: dailyState.playedToday,
    dailyHistory: dailyState.history,
    dailyGrid,
    updateBestScore,
    getPlayedDaysCount,
  };
}
