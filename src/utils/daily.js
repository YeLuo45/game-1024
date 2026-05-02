// Daily Challenge utilities - seeded random based on date

const GRID_SIZE = 4;

export function getDailyDateStr(date = new Date()) {
  return date.toISOString().split('T')[0]; // "2026-05-02"
}

// Hash function to convert date string to seed
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Seeded random number generator
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}

function createEmptyGrid() {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
}

function getEmptyCells(grid) {
  const empty = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  return empty;
}

// Generate daily grid with seeded random
export function generateDailyGrid(date = new Date()) {
  const dateStr = getDailyDateStr(date);
  const seed = hashString(dateStr);
  const rng = seededRandom(seed);
  
  const g = createEmptyGrid();
  // Place 2-3 random tiles
  const count = rng() < 0.5 ? 2 : 3;
  
  for (let i = 0; i < count; i++) {
    const empty = getEmptyCells(g);
    if (empty.length === 0) break;
    const { r, c } = empty[Math.floor(rng() * empty.length)];
    g[r][c] = rng() < 0.9 ? 2 : 4;
  }
  
  return g;
}

// Check if date string is today
export function isToday(dateStr) {
  return dateStr === getDailyDateStr();
}

// Get time until midnight
export function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}
