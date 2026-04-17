import React from 'react';

export function Controls({ onMove, skin }) {
  return (
    <div className="controls">
      <div className="controls-row">
        <button
          className="control-btn"
          onClick={() => onMove('up')}
          style={{ backgroundColor: skin.buttonBg }}
        >
          ↑
        </button>
      </div>
      <div className="controls-row">
        <button
          className="control-btn"
          onClick={() => onMove('left')}
          style={{ backgroundColor: skin.buttonBg }}
        >
          ←
        </button>
        <button
          className="control-btn"
          onClick={() => onMove('down')}
          style={{ backgroundColor: skin.buttonBg }}
        >
          ↓
        </button>
        <button
          className="control-btn"
          onClick={() => onMove('right')}
          style={{ backgroundColor: skin.buttonBg }}
        >
          →
        </button>
      </div>
    </div>
  );
}
