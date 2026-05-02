import { useState, useEffect, useCallback, useRef } from 'react';
import { ACHIEVEMENTS } from '../utils/achievements';

const STORAGE_KEY = 'game-1024-achievements';

function loadAchievementsState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error loading achievements:', e);
  }
  return { unlocked: [], unlockDates: {}, usedSkins: [] };
}

function saveAchievementsState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Error saving achievements:', e);
  }
}

export function useAchievements() {
  const [achievementsState, setAchievementsState] = useState(() => loadAchievementsState());
  const [pendingPopup, setPendingPopup] = useState(null);
  const popupTimeoutRef = useRef(null);

  useEffect(() => {
    saveAchievementsState(achievementsState);
  }, [achievementsState]);

  // Track combo in current move sequence
  const comboCountRef = useRef(0);
  const lastGridRef = useRef(null);

  const isUnlocked = useCallback((id) => {
    return achievementsState.unlocked.includes(id);
  }, [achievementsState.unlocked]);

  const unlock = useCallback((id) => {
    if (isUnlocked(id)) return false;
    
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) return false;

    setAchievementsState(prev => ({
      ...prev,
      unlocked: [...prev.unlocked, id],
      unlockDates: {
        ...prev.unlockDates,
        [id]: new Date().toISOString().split('T')[0],
      }
    }));

    // Show popup
    setPendingPopup(achievement);
    
    // Auto dismiss after 2.5 seconds
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    popupTimeoutRef.current = setTimeout(() => {
      setPendingPopup(null);
    }, 2500);

    return true;
  }, [isUnlocked]);

  const dismissPopup = useCallback(() => {
    setPendingPopup(null);
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
  }, []);

  // Check for first-merge and combo-3 during merge
  const checkMergeAchievements = useCallback((mergedCount, newGrid, prevGrid) => {
    // first-merge: any merge
    if (mergedCount > 0) {
      unlock('first-merge');
      
      // combo-3: 3 or more merges in one move
      // Actually combo-3 means 3+ merge pairs in single move
      if (mergedCount >= 3) {
        unlock('combo-3');
      }
    }
  }, [unlock]);

  // Check for reach achievements
  const checkReachAchievements = useCallback((grid) => {
    const values = grid.flat();
    const maxVal = Math.max(...values);
    
    if (maxVal >= 128) unlock('reach-128');
    if (maxVal >= 512) unlock('reach-512');
    if (maxVal >= 1024) unlock('reach-1024');
    if (maxVal >= 2048) unlock('reach-2048');
    if (maxVal >= 4096) unlock('reach-4096');
  }, [unlock]);

  // Check for no-dead-50
  const checkNoDead50 = useCallback((won, moveCount) => {
    if (won && moveCount <= 50) {
      unlock('no-dead-50');
    }
  }, [unlock]);

  // Track skin usage for all-skins achievement
  const trackSkinUsage = useCallback((skinName) => {
    setAchievementsState(prev => {
      const usedSkins = prev.usedSkins || [];
      if (!usedSkins.includes(skinName)) {
        const newUsedSkins = [...usedSkins, skinName];
        // Check if all 3 skins have been used
        if (newUsedSkins.length >= 3) {
          // Schedule the unlock check after state update
          setTimeout(() => unlock('all-skins'), 0);
        }
        return { ...prev, usedSkins: newUsedSkins };
      }
      return prev;
    });
  }, [unlock]);

  // Check for daily-3 (called when daily challenge is played 3 days)
  const checkDaily3 = useCallback((playedDaysCount) => {
    if (playedDaysCount >= 3) {
      unlock('daily-3');
    }
  }, [unlock]);

  return {
    achievementsState,
    pendingPopup,
    dismissPopup,
    isUnlocked,
    unlock,
    checkMergeAchievements,
    checkReachAchievements,
    checkNoDead50,
    trackSkinUsage,
    checkDaily3,
  };
}
