import React, { useEffect, useRef, useState } from 'react';
import { Cell } from './Cell';

export function Grid({ grid, skin, tileMap, showScorePopup, scoreIncrease }) {
  const prevTileMapRef = useRef(new Map());
  const [animKey, setAnimKey] = useState(0);
  const [scorePopupPos, setScorePopupPos] = useState({ top: '50%', left: '50%' });

  // Trigger animation reset when tileMap changes
  useEffect(() => {
    setAnimKey(k => k + 1);
    prevTileMapRef.current = tileMap;
  }, [tileMap]);

  // Find score popup position (center of grid)
  useEffect(() => {
    if (showScorePopup) {
      setScorePopupPos({ top: '50%', left: '50%' });
    }
  }, [showScorePopup]);

  return (
    <div className="grid-container" style={{ backgroundColor: skin.gridBackground }}>
      <div className="grid-background">
        {Array(16).fill(null).map((_, i) => (
          <div key={i} className="cell-empty" style={{ backgroundColor: skin.cellBackground }} />
        ))}
      </div>
      <div className="grid-tiles" key={animKey}>
        {Array.from(tileMap.values()).map((tile) => (
          <div
            key={tile.id}
            className={`tile ${tile.isNew ? 'tile-new' : ''} ${tile.isMerged ? 'tile-merged' : ''} ${tile.isMoved ? 'tile-moved' : ''}`}
            style={{
              top: `${tile.r * 25}%`,
              left: `${tile.c * 25}%`,
              width: '25%',
              height: '25%'
            }}
          >
            <Cell value={tile.value} skin={skin} />
          </div>
        ))}
      </div>
      
      {/* Score popup */}
      {showScorePopup && (
        <div 
          className="score-popup"
          style={scorePopupPos}
        >
          +{scoreIncrease}
        </div>
      )}
    </div>
  );
}
