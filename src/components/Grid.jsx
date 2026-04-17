import React from 'react';
import { Cell } from './Cell';

export function Grid({ grid, skin }) {
  return (
    <div className="grid-container" style={{ backgroundColor: skin.gridBackground }}>
      <div className="grid-background">
        {Array(16).fill(null).map((_, i) => (
          <div key={i} className="cell-empty" style={{ backgroundColor: skin.cellBackground }} />
        ))}
      </div>
      <div className="grid-tiles">
        {grid.map((row, r) =>
          row.map((value, c) =>
            value ? (
              <div
                key={`${r}-${c}`}
                className="tile"
                style={{
                  top: `${r * 25}%`,
                  left: `${c * 25}%`,
                  width: '25%',
                  height: '25%'
                }}
              >
                <Cell value={value} skin={skin} />
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
}
