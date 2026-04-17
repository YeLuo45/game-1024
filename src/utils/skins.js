export const SKINS = {
  classic: {
    name: 'Classic',
    background: '#faf8ef',
    gridBackground: '#bbada0',
    cellBackground: '#cdc1b4',
    cellColors: {
      2: { bg: '#eee4da', text: '#776e65' },
      4: { bg: '#ede0c8', text: '#776e65' },
      8: { bg: '#f2b179', text: '#f9f6f2' },
      16: { bg: '#f59563', text: '#f9f6f2' },
      32: { bg: '#f67c5f', text: '#f9f6f2' },
      64: { bg: '#f65e3b', text: '#f9f6f2' },
      128: { bg: '#edcf72', text: '#f9f6f2' },
      256: { bg: '#edcc61', text: '#f9f6f2' },
      512: { bg: '#edc850', text: '#f9f6f2' },
      1024: { bg: '#edc53f', text: '#f9f6f2' },
      2048: { bg: '#edc22e', text: '#f9f6f2' }
    },
    textColor: '#776e65',
    buttonBg: '#8f7a66',
    buttonHover: '#9f8b77'
  },
  neon: {
    name: 'Neon',
    background: '#0a0a0f',
    gridBackground: '#1a1a2e',
    cellBackground: '#16213e',
    cellColors: {
      2: { bg: '#0f3460', text: '#00fff5' },
      4: { bg: '#1a1a40', text: '#00fff5' },
      8: { bg: '#e94560', text: '#ffffff' },
      16: { bg: '#ff2e63', text: '#ffffff' },
      32: { bg: '#ff6b6b', text: '#0a0a0f' },
      64: { bg: '#ffd93d', text: '#0a0a0f' },
      128: { bg: '#6bcb77', text: '#0a0a0f' },
      256: { bg: '#4d96ff', text: '#ffffff' },
      512: { bg: '#9b59b6', text: '#ffffff' },
      1024: { bg: '#ff00ff', text: '#0a0a0f' },
      2048: { bg: '#00ff00', text: '#0a0a0f' }
    },
    textColor: '#00fff5',
    buttonBg: '#e94560',
    buttonHover: '#ff2e63'
  },
  candy: {
    name: 'Candy',
    background: '#fff0f5',
    gridBackground: '#ffd1dc',
    cellBackground: '#fff5f5',
    cellColors: {
      2: { bg: '#ffb6c1', text: '#d1477a' },
      4: { bg: '#ffc0cb', text: '#d1477a' },
      8: { bg: '#ff69b4', text: '#ffffff' },
      16: { bg: '#ff1493', text: '#ffffff' },
      32: { bg: '#db7093', text: '#ffffff' },
      64: { bg: '#c71585', text: '#ffffff' },
      128: { bg: '#ffb347', text: '#ffffff' },
      256: { bg: '#ff8c00', text: '#ffffff' },
      512: { bg: '#87ceeb', text: '#ffffff' },
      1024: { bg: '#7b68ee', text: '#ffffff' },
      2048: { bg: '#32cd32', text: '#ffffff' }
    },
    textColor: '#d1477a',
    buttonBg: '#ff69b4',
    buttonHover: '#ff1493'
  }
};

export const getSkin = (skinName) => SKINS[skinName] || SKINS.classic;
