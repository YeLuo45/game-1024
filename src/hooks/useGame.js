import { useState, useEffect, useCallback, useRef } from 'react';
import { useStorage } from './useStorage';
import { audioManager } from '../utils/AudioManager';

const GRID_SIZE = 4;

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

let globalTileId = 0;
const nextTileId = () => ++globalTileId;

const addRandomTile = (grid, rng = Math.random) => {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return { grid, newPos: null };
  const { r, c } = empty[Math.floor(rng() * empty.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = rng() < 0.9 ? 2 : 4;
  return { grid: newGrid, newPos: { r, c } };
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

// Play mode storage keys (2048 vs infinite)
const PLAYMODE_STORAGE_KEYS = {
  '2048': 'game-1024-state-2048',
  'infinite': 'game-1024-state-infinite',
};

// Game mode storage keys (normal vs daily)
const GAMEMODE_STORAGE_KEYS = {
  'normal': 'game-1024-state',
  'daily': 'game-1024-state-daily',
};

export function useGame(gameMode = 'normal', playMode = '2048') {
  const [moveCount, setMoveCount] = useState(0);
  const prevGridRef = useRef(null);
  const [history, setHistory] = useState([]); // Array<{grid, score, won}> max 10

  // Combined storage key based on gameMode + playMode
  const getStorageKey = () => {
    if (gameMode === 'daily') return 'game-1024-state-daily';
    return `game-1024-state-${playMode}`;
  };
  const storageKey = getStorageKey();
  const [savedState, setSavedState] = useStorage(storageKey, null);
  const [skin, setSkin] = useStorage('game-1024-skin', 'classic');

  // Get win value based on playMode
  const winValue = playMode === 'infinite' ? null : (playMode === '2048' ? 2048 : 1024);

  const getInitialGrid = useCallback(() => {
    if (savedState?.grid) return savedState.grid;
    const g = createEmptyGrid();
    return addRandomTile(addRandomTile(g).grid).grid;
  }, [savedState]);

  const [grid, setGrid] = useState(() => getInitialGrid());

  const [score, setScore] = useState(savedState?.score || 0);
  const [won, setWon] = useState(savedState?.won || false);
  const [gameOver, setGameOver] = useState(savedState?.gameOver || false);

  // Animation state - tileMap contains all current tiles with their properties
  const [tileMap, setTileMap] = useState(() => {
    const initialGrid = getInitialGrid();
    const map = new Map();
    initialGrid.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0) {
          map.set(`${r}-${c}`, { id: nextTileId(), r, c, value: val, isNew: true, isMerged: false });
        }
      });
    });
    return map;
  });

  const [scoreIncrease, setScoreIncrease] = useState(0);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const scorePopupTimerRef = useRef(null);
  const tileIdCounterRef = useRef(globalTileId);

  // Reset when gameMode or playMode changes
  useEffect(() => {
    const newGrid = getInitialGrid();
    const newMap = new Map();
    newGrid.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0) {
          newMap.set(`${r}-${c}`, { id: nextTileId(), r, c, value: val, isNew: true, isMerged: false });
        }
      });
    });
    globalTileId = tileIdCounterRef.current;
    setGrid(newGrid);
    setTileMap(newMap);
    setScore(savedState?.score || 0);
    setWon(savedState?.won || false);
    setGameOver(savedState?.gameOver || false);
    setMoveCount(0);
    prevGridRef.current = null;
  }, [gameMode, playMode]);

  useEffect(() => {
    if (!gameOver && !won) {
      setSavedState({ grid, score, won, gameOver });
    }
  }, [grid, score, won, gameOver, setSavedState]);

  const doMove = useCallback((direction, { onMerge } = {}) => {
    if (gameOver) return;

    // Store previous grid for animation computation
    prevGridRef.current = grid.map(row => [...row]);

    const result = move(grid, direction);
    if (gridsEqual(result.grid, grid)) return;

    // Save current state to history before moving (max 9 entries, newest first)
    const snapshot = {
      grid: JSON.parse(JSON.stringify(grid)),
      score,
      won
    };
    setHistory(prev => {
      const newHistory = [snapshot, ...prev].slice(0, 9);
      return newHistory;
    });

    // Track score increase for popup
    if (result.score > 0) {
      setScoreIncrease(result.score);
      setShowScorePopup(true);
      if (scorePopupTimerRef.current) clearTimeout(scorePopupTimerRef.current);
      scorePopupTimerRef.current = setTimeout(() => setShowScorePopup(false), 800);
    }

    const { grid: newGrid, newPos } = addRandomTile(result.grid);

    // Compute animation flags by comparing grids
    const prevGrid = result.grid; // grid before random tile was added
    const mergedSet = new Set();
    const newSet = new Set();

    // Find merged positions (value doubled)
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (prevGrid[r][c] !== 0 && newGrid[r][c] === prevGrid[r][c] * 2) {
          mergedSet.add(`${r}-${c}`);
        }
      }
    }

    // Find new tile position
    if (newPos) {
      newSet.add(`${newPos.r}-${newPos.c}`);
    }

    // Build new tile map
    const newTileMap = new Map();
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] !== 0) {
          const key = `${r}-${c}`;
          const isNew = newSet.has(key);
          const isMerged = mergedSet.has(key);

          newTileMap.set(key, {
            id: nextTileId(),
            r,
            c,
            value: newGrid[r][c],
            isNew,
            isMerged,
          });
        }
      }
    }

    setGrid(newGrid);
    setTileMap(newTileMap);
    setScore(s => s + result.score);
    setMoveCount(c => c + 1);

    // Play sounds
    if (result.merges > 0) {
      audioManager.playMerge(newGrid[Object.keys(mergedSet)[0]?.split('-')[0]][Object.keys(mergedSet)[0]?.split('-')[1]]);
    } else {
      audioManager.playMove();
    }

    // Win condition
    if (!won && winValue !== null) {
      const maxTile = Math.max(...newGrid.flat());
      if (maxTile >= winValue) {
        setWon(true);
      }
    }

    if (!canMove(newGrid)) {
      setGameOver(true);
    }
  }, [grid, gameOver, won, winValue]);

  const newGame = useCallback(() => {
    const g = createEmptyGrid();
    const { grid: newGrid } = addRandomTile(addRandomTile(g).grid);
    const newMap = new Map();
    newGrid.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0) {
          newMap.set(`${r}-${c}`, { id: nextTileId(), r, c, value: val, isNew: true, isMerged: false });
        }
      });
    });
    setGrid(newGrid);
    setTileMap(newMap);
    setScore(0);
    setWon(false);
    setGameOver(false);
    setMoveCount(0);
    prevGridRef.current = null;
  }, []);

  const resetWithGrid = useCallback((dailyGrid) => {
    const gridCopy = [...dailyGrid.map(row => [...row])];
    const newMap = new Map();
    gridCopy.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0) {
          newMap.set(`${r}-${c}`, { id: nextTileId(), r, c, value: val, isNew: true, isMerged: false });
        }
      });
    });
    setGrid(gridCopy);
    setTileMap(newMap);
    setScore(0);
    setWon(false);
    setGameOver(false);
    setMoveCount(0);
    setHistory([]);
    prevGridRef.current = null;
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;

    const [latest, ...rest] = history;
    setHistory(rest);

    // Rebuild tileMap from restored grid
    const newTileMap = new Map();
    latest.grid.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0) {
          newTileMap.set(`${r}-${c}`, { id: nextTileId(), r, c, value: val, isNew: false, isMerged: false });
        }
      });
    });

    setGrid(latest.grid);
    setTileMap(newTileMap);
    setScore(latest.score);
    setWon(false); // Reset won state on undo
    audioManager.playUndo();
  }, [history]);

  const retry = useCallback(() => {
    setHistory([]);
    audioManager.playNewGame();
    if (gameMode === 'daily') {
      // For daily challenge, retry should reset with the same seed grid
      // The parent component will handle providing the dailyGrid
      newGame();
    } else {
      newGame();
    }
  }, [gameMode, newGame]);

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
    undo,
    retry,
    canUndo: history.length > 0,
    history,
    gameMode,
    playMode,
    moveCount,
    tileMap,
    scoreIncrease,
    showScorePopup,
  };
}
