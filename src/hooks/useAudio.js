import { useCallback, useEffect } from 'react';
import { audioManager } from '../utils/AudioManager';
import { useStorage } from './useStorage';

const SOUND_STORAGE_KEY = 'game-1024-sound';

export function useAudio() {
  const [soundEnabled, setSoundEnabled] = useStorage(SOUND_STORAGE_KEY, true);

  // Sync manager state with persisted value (only when value changes)
  useEffect(() => {
    audioManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    const newValue = audioManager.toggle();
    setSoundEnabled(newValue);
    return newValue;
  }, [setSoundEnabled]);

  const playMove = useCallback(() => {
    audioManager.playMove();
  }, []);

  const playMerge = useCallback((value) => {
    audioManager.playMerge(value);
  }, []);

  const playWin = useCallback(() => {
    audioManager.playWin();
  }, []);

  const playGameOver = useCallback(() => {
    audioManager.playGameOver();
  }, []);

  const playNewGame = useCallback(() => {
    audioManager.playNewGame();
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playMove,
    playMerge,
    playWin,
    playGameOver,
    playNewGame,
  };
}
