import { useState, useEffect, useCallback } from 'react';
import { useStorage } from './useStorage';

const GRID_SIZE = 4;
const WIN_VALUE = 1024;

const createEmptyGrid = () => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
};

const getEmptyCells = (grid) => {
  const empty = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  return empty;
};

const addRandomTile = (grid, rng = Math.random) => {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;
  const { r, c } = empty[Math.floor(rng() * empty.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = rng() < 0.9 ? 2 : 4;
  return newGrid;
};

const rotateGrid = (grid, times = 1) => {
  let result = grid.map(row => [...row]);
  for (let t = 0; t < times; t++) {
    const rotated = createEmptyGrid();
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        rotated[c][GRID_SIZE - 1 - r] = result[r][c];
      }
    }
    result = rotated;
  }
  return result;
};

const slideRow = (row) => {
  const filtered = row.filter(x => x !== 0);
  const merged = [];
  let score = 0;
  let mergeCount = 0;
  
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      const newVal = filtered[i] * 2;
      merged.push(newVal);
      score += newVal;
      mergeCount++;
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }
  
  while (merged.length < GRID_SIZE) merged.push(0);
  return { row: merged, score, mergeCount };
};

const moveLeft = (grid) => {
  let totalScore = 0;
  let totalMerges = 0;
  const newGrid = grid.map(row => {
    const { row: newRow, score, mergeCount } = slideRow(row);
    totalScore += score;
    totalMerges += mergeCount;
    return newRow;
  });
  return { grid: newGrid, score: totalScore, merges: totalMerges };
};

const move = (grid, direction) => {
  let rotations = { left: 0, up: 1, right: 2, down: 3 }[direction];
  let rotated = rotateGrid(grid, rotations);
  let { grid: moved, score, merges } = moveLeft(rotated);
  rotated = rotateGrid(moved, (4 - rotations) % 4);
  return { grid: rotated, score, merges };
};

const gridsEqual = (a, b) => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
};

const canMove = (grid) => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
};

// Mode-specific storage keys
const MODE_STORAGE_KEYS = {
  normal: 'game-1024-state',
  daily: 'game-1024-state-daily',
};

export function useGame(gameMode = 'normal') {
  const [moveCount, setMoveCount] = useState(0);
  
  const storageKey = MODE_STORAGE_KEYS[gameMode] || MODE_STORAGE_KEYS.normal;
  const [savedState, setSavedState] = useStorage(storageKey, null);
  const [skin, setSkin] = useStorage('game-1024-skin', 'classic');
  
  const getInitialGrid = useCallback(() => {
    if (savedState?.grid) return savedState.grid;
    const g = createEmptyGrid();
    return addRandomTile(addRandomTile(g));
  }, [savedState]);

  const [grid, setGrid] = useState(() => getInitialGrid());
  
  const [score, setScore] = useState(savedState?.score || 0);
  const [won, setWon] = useState(savedState?.won || false);
  const [gameOver, setGameOver] = useState(savedState?.gameOver || false);

  // Reset grid when mode changes
  useEffect(() => {
    setGrid(getInitialGrid());
    setScore(savedState?.score || 0);
    setWon(savedState?.won || false);
    setGameOver(savedState?.gameOver || false);
    setMoveCount(0);
  }, [gameMode, storageKey]);

  useEffect(() => {
    if (!gameOver && !won) {
      setSavedState({ grid, score, won, gameOver });
    }
  }, [grid, score, won, gameOver, setSavedState]);

  const doMove = useCallback((direction) => {
    if (gameOver) return;
    
    const result = move(grid, direction);
    if (gridsEqual(result.grid, grid)) return;
    
    const newGrid = addRandomTile(result.grid);
    setGrid(newGrid);
    setScore(s => s + result.score);
    setMoveCount(c => c + 1);
    
    if (!won && result.score >= WIN_VALUE) {
      setWon(true);
    }
    
    if (!canMove(newGrid)) {
      setGameOver(true);
    }
  }, [grid, gameOver, won]);

  const newGame = useCallback(() => {
    const g = createEmptyGrid();
    setGrid(addRandomTile(addRandomTile(g)));
    setScore(0);
    setWon(false);
    setGameOver(false);
    setMoveCount(0);
  }, []);

  // Reset game with a specific grid (for daily challenge)
  const resetWithGrid = useCallback((dailyGrid) => {
    setGrid([...dailyGrid.map(row => [...row])]);
    setScore(0);
    setWon(false);
    setGameOver(false);
    setMoveCount(0);
  }, []);

  return {
    grid,
    score,
    won,
    gameOver,
    skin,
    setSkin,
    doMove,
    newGame,
    resetWithGrid,
    mode: gameMode,
    moveCount,
  };
}
