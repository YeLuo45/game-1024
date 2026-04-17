import React from 'react';

export function ScoreBoard({ score, skin }) {
  return (
    <div className="score-board">
      <div className="score-box" style={{ backgroundColor: skin.gridBackground }}>
        <div className="score-label" style={{ color: skin.cellBackground }}>SCORE</div>
        <div className="score-value" style={{ color: '#ffffff' }}>{score}</div>
      </div>
    </div>
  );
}
