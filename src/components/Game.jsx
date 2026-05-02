import { useEffect, useCallback, useState, useRef } from 'react';
import { Grid } from './Grid';
import { ScoreBoard } from './ScoreBoard';
import { Controls } from './Controls';
import { SkinPicker } from './SkinPicker';
import { GameOver } from './GameOver';
import { AchievementPopup } from './AchievementPopup';
import { ModeSwitcher } from './ModeSwitcher';
import { useGame } from '../hooks/useGame';
import { useDaily } from '../hooks/useDaily';
import { useAchievements } from '../hooks/useAchievements';
import { useAudio } from '../hooks/useAudio';
import { useStats } from '../hooks/useStats';
import { getSkin } from '../utils/skins';

export function Game({ gameMode, playMode, onPlayModeChange, onShowMenu }) {
  const isInDailyChallenge = gameMode === 'daily';

  const {
    grid,
    score,
    won,
    gameOver,
    skin: skinName,
    setSkin,
    doMove,
    newGame,
    resetWithGrid,
    undo,
    retry,
    canUndo,
    moveCount
  } = useGame(gameMode, playMode);

  const { soundEnabled, toggleSound, playNewGame, playWin, playGameOver, playUndo } = useAudio();

  const skin = getSkin(skinName);
  const [showGameOver, setShowGameOver] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  
  const { daily, dailyGrid, updateBestScore, getPlayedDaysCount } = useDaily();
  const {
    pendingPopup,
    dismissPopup,
    checkMergeAchievements,
    checkReachAchievements,
    checkNoDead50,
    trackSkinUsage,
    checkDaily3: checkDaily3Ach,
  } = useAchievements();

  const { updateStats } = useStats();

  const prevGridRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Initialize daily challenge with seeded grid
  useEffect(() => {
    if (isInDailyChallenge && dailyGrid && !isInitializedRef.current) {
      resetWithGrid(dailyGrid);
      isInitializedRef.current = true;
    }
    if (!isInDailyChallenge) {
      isInitializedRef.current = false;
    }
  }, [isInDailyChallenge, dailyGrid, resetWithGrid]);

  // Track skin usage for all-skins achievement
  useEffect(() => {
    if (isInDailyChallenge && dailyGrid && !isInitializedRef.current) {
      resetWithGrid(dailyGrid);
      isInitializedRef.current = true;
    }
    if (!isInDailyChallenge) {
      isInitializedRef.current = false;
    }
  }, [isInDailyChallenge, dailyGrid, resetWithGrid]);

  // Track skin usage for all-skins achievement
  useEffect(() => {
    trackSkinUsage(skinName);
  }, [skinName, trackSkinUsage]);

  // Achievement: check reach achievements when grid changes
  useEffect(() => {
    if (grid) {
      checkReachAchievements(grid);
    }
  }, [grid, checkReachAchievements]);

  // Achievement: check no-dead-50 and update daily score when game ends
  useEffect(() => {
    if ((gameOver || won) && moveCount > 0) {
      checkNoDead50(won, moveCount);
      // Update game stats
      const maxTile = grid ? Math.max(...grid.flat()) : 0;
      updateStats(playMode, { won, score, maxTile, isDaily: isInDailyChallenge });
      if (isInDailyChallenge) {
        updateBestScore(score);
        const playedCount = getPlayedDaysCount();
        checkDaily3Ach(playedCount);
      }
    }
  }, [gameOver, won, moveCount, score, isInDailyChallenge, updateBestScore, getPlayedDaysCount, checkNoDead50, checkDaily3Ach, playMode, grid, updateStats]);

  useEffect(() => {
    if (won && !keepPlaying) {
      setShowGameOver(true);
    }
  }, [won, keepPlaying]);

  const handleContinue = () => {
    setShowGameOver(false);
    setKeepPlaying(true);
  };

  const handleNewGame = () => {
    setShowGameOver(false);
    setKeepPlaying(false);
    playNewGame();
    if (isInDailyChallenge && dailyGrid) {
      resetWithGrid(dailyGrid);
    } else {
      newGame();
    }
  };

  const handleTouchStart = useCallback((e) => {
    const touchStartX = e.touches[0].clientX;
    const touchStartY = e.touches[0].clientY;
    
    const handleTouchEnd = (endEvent) => {
      const touchEndX = endEvent.changedTouches[0].clientX;
      const touchEndY = endEvent.changedTouches[0].clientY;
      
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      
      if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
          doMove(dx > 0 ? 'right' : 'left');
        } else {
          doMove(dy > 0 ? 'down' : 'up');
        }
      }
    };
    
    document.addEventListener('touchend', handleTouchEnd, { once: true });
  }, [doMove]);

  const handleKeyDown = useCallback((e) => {
    const keyMap = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'
    };
    if (keyMap[e.key]) {
      e.preventDefault();
      doMove(keyMap[e.key]);
    }
  }, [doMove]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Check for first-merge and combo achievements by comparing grids before/after move
  const handleMove = useCallback((direction) => {
    prevGridRef.current = grid.map(row => [...row]);
    doMove(direction);
  }, [grid, doMove]);

  // After move, check achievements
  useEffect(() => {
    if (prevGridRef.current && grid) {
      // Count merges by comparing cell values - a merge is when a cell doubles
      let merges = 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const newVal = grid[r][c];
          const oldVal = prevGridRef.current[r][c];
          // A merge happened if the new value is double the old value
          // and the value is greater than 0
          if (newVal > 0 && newVal === oldVal * 2) {
            merges++;
          }
        }
      }
      if (merges > 0) {
        checkMergeAchievements(merges, grid, prevGridRef.current);
      }
    }
  }, [grid, checkMergeAchievements]);

  return (
    <div
      className="game"
      style={{
        backgroundColor: skin.background,
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
    >
      <header className="game-header">
        <div className="header-left">
          <h1 className="game-title" style={{ color: skin.textColor }}>
            {isInDailyChallenge ? '📅 每日挑战' : '1024'}
          </h1>
        </div>
        <div className="header-right">
          <ScoreBoard score={score} skin={skin} />
          <button
            className="sound-btn"
            onClick={toggleSound}
            style={{ backgroundColor: skin.buttonBg }}
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            className="menu-btn"
            onClick={onShowMenu}
            style={{ backgroundColor: skin.buttonBg }}
          >
            ☰
          </button>
        </div>
      </header>

      <div className="game-actions">
        <button
          className="undo-btn"
          onClick={undo}
          disabled={!canUndo}
          style={{ backgroundColor: skin.buttonBg, opacity: canUndo ? 1 : 0.4 }}
          title="撤销"
        >
          ↩️
        </button>
        <button
          className="retry-btn"
          onClick={retry}
          style={{ backgroundColor: skin.buttonBg }}
          title="重试"
        >
          🔄
        </button>
      </div>
      
      <SkinPicker
        currentSkin={skinName}
        onSkinChange={setSkin}
        skin={skin}
      />

      {!isInDailyChallenge && (
        <ModeSwitcher
          currentMode={playMode}
          onModeChange={onPlayModeChange}
          skin={skin}
        />
      )}
      
      <Grid 
        grid={grid} 
        skin={skin} 
        tileMap={tileMap}
        showScorePopup={showScorePopup}
        scoreIncrease={scoreIncrease}
      />
      
      <Controls onMove={handleMove} skin={skin} />
      
      <button
        className="new-game-btn"
        onClick={handleNewGame}
        style={{ backgroundColor: skin.buttonBg }}
      >
        New Game
      </button>
      
      <GameOver
        won={showGameOver && won}
        gameOver={gameOver && !keepPlaying}
        onNewGame={handleNewGame}
        onContinue={handleContinue}
        skin={skin}
      />
      
      <AchievementPopup 
        achievement={pendingPopup} 
        onDismiss={dismissPopup} 
      />
    </div>
  );
}
