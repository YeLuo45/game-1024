import React from 'react';

export function GameOver({ won, gameOver, onNewGame, onContinue, skin }) {
  if (!won && !gameOver) return null;
  
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal" style={{ backgroundColor: skin.gridBackground }}>
        <h2 style={{ color: '#ffffff' }}>
          {won ? '🎉 You Win!' : 'Game Over'}
        </h2>
        <p style={{ color: skin.cellBackground }}>
          {won ? 'You reached 1024!' : 'No more moves available'}
        </p>
        <div className="game-over-buttons">
          {won && (
            <button
              className="game-btn continue"
              onClick={onContinue}
              style={{ backgroundColor: skin.buttonBg }}
            >
              Keep Playing
            </button>
          )}
          <button
            className="game-btn new-game"
            onClick={onNewGame}
            style={{ backgroundColor: skin.buttonBg }}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
