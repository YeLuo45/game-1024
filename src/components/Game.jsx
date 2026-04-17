import React, { useEffect, useCallback } from 'react';
import { Grid } from './Grid';
import { ScoreBoard } from './ScoreBoard';
import { Controls } from './Controls';
import { SkinPicker } from './SkinPicker';
import { GameOver } from './GameOver';
import { useGame } from '../hooks/useGame';
import { getSkin } from '../utils/skins';

export function Game() {
  const {
    grid,
    score,
    won,
    gameOver,
    skin: skinName,
    setSkin,
    doMove,
    newGame
  } = useGame();

  const skin = getSkin(skinName);
  const [showGameOver, setShowGameOver] = React.useState(false);
  const [keepPlaying, setKeepPlaying] = React.useState(false);

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
    newGame();
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
        <h1 className="game-title" style={{ color: skin.textColor }}>1024</h1>
        <ScoreBoard score={score} skin={skin} />
      </header>
      
      <SkinPicker
        currentSkin={skinName}
        onSkinChange={setSkin}
        skin={skin}
      />
      
      <Grid grid={grid} skin={skin} />
      
      <Controls onMove={doMove} skin={skin} />
      
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
    </div>
  );
}
