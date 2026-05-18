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

// Grid size options for custom board
export const GRID_SIZES = {
  '4x4': { size: 4, label: '4×4', initialTiles: 2 },
  '5x5': { size: 5, label: '5×5', initialTiles: 3 },
  '6x6': { size: 6, label: '6×6', initialTiles: 4 },
};

export const MODE_KEY_STORAGE = 'game-1024-mode';

export const getModeConfig = (mode) => MODES[mode] || MODES['2048'];
