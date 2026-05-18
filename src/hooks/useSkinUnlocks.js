import { useState, useEffect, useCallback } from 'react';
import { SKIN_CONFIGS, getAchievementSkins } from '../utils/skinConfigs';

const UNLOCKS_KEY = 'game-1024-unlocks';

function loadUnlocks() {
  try {
    const saved = localStorage.getItem(UNLOCKS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error loading skin unlocks:', e);
  }
  return [];
}

function saveUnlocks(unlocks) {
  try {
    localStorage.setItem(UNLOCKS_KEY, JSON.stringify(unlocks));
  } catch (e) {
    console.warn('Error saving skin unlocks:', e);
  }
}

export function useSkinUnlocks(stats) {
  const [unlockedSkins, setUnlockedSkins] = useState(() => loadUnlocks());

  // Save whenever unlocked skins change
  useEffect(() => {
    saveUnlocks(unlockedSkins);
  }, [unlockedSkins]);

  // Check if a skin is unlocked
  const isUnlocked = useCallback((skinId) => {
    // Festival skins are always available
    const config = SKIN_CONFIGS[skinId];
    if (!config) return true; // Unknown skins default to unlocked
    if (config.type === 'festival') return true;
    
    // Check if in unlocked list
    return unlockedSkins.includes(skinId);
  }, [unlockedSkins]);

  // Check all achievement conditions and unlock any newly qualified skins
  const checkUnlocks = useCallback(() => {
    if (!stats) return;

    const achievementSkins = getAchievementSkins();
    const newlyUnlocked = [];

    for (const skinId of achievementSkins) {
      const config = SKIN_CONFIGS[skinId];
      if (!config) continue;
      
      // Skip if already unlocked
      if (unlockedSkins.includes(skinId)) continue;
      
      // Check if condition is met
      if (config.condition && config.condition(stats)) {
        newlyUnlocked.push(skinId);
      }
    }

    if (newlyUnlocked.length > 0) {
      setUnlockedSkins(prev => [...prev, ...newlyUnlocked]);
    }
  }, [stats, unlockedSkins]);

  // Auto-check unlocks when stats change
  useEffect(() => {
    checkUnlocks();
  }, [stats, checkUnlocks]);

  // Get all available skin IDs (for SkinPicker)
  const getAllAvailableSkins = useCallback(() => {
    return Object.keys(SKIN_CONFIGS);
  }, []);

  return {
    unlockedSkins,
    isUnlocked,
    checkUnlocks,
    getAllAvailableSkins,
  };
}
