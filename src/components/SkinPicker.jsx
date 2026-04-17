import React from 'react';
import { SKINS } from '../utils/skins';

export function SkinPicker({ currentSkin, onSkinChange, skin }) {
  return (
    <div className="skin-picker">
      <div className="skin-label" style={{ color: skin.textColor }}>Skin:</div>
      <div className="skin-options">
        {Object.entries(SKINS).map(([key, s]) => (
          <button
            key={key}
            className={`skin-btn ${currentSkin === key ? 'active' : ''}`}
            onClick={() => onSkinChange(key)}
            style={{
              backgroundColor: currentSkin === key ? skin.buttonBg : s.background,
              borderColor: skin.buttonBg
            }}
            title={s.name}
          >
            <span style={{ color: s.textColor }}>{s.name[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
