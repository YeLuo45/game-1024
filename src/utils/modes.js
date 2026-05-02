// Mode configuration for game-1024
export const MODES = {
  '2048': {
    key: 'game-1024-state-2048',
    winValue: 2048,
    hasGameOver: true,
  },
  'infinite': {
    key: 'game-1024-state-infinite',
    winValue: null,
    hasGameOver: true,
  }
};

export const MODE_KEY_STORAGE = 'game-1024-mode';

export const getModeConfig = (mode) => MODES[mode] || MODES['2048'];
