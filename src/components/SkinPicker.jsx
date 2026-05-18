import React from 'react';
import { SKIN_CONFIGS, getAllSkinKeys } from '../utils/skinConfigs';
import { SKINS, FESTIVAL_SKINS } from '../utils/skins';

export function SkinPicker({ currentSkin, onSkinChange, skin, isUnlocked }) {
  const allSkinKeys = getAllSkinKeys();

  const handleSkinClick = (key) => {
    // Festival skins are always available
    if (FESTIVAL_SKINS.includes(key)) {
      onSkinChange(key);
      return;
    }
    
    // Check if unlocked (for achievement skins)
    if (isUnlocked && isUnlocked(key)) {
      onSkinChange(key);
    } else {
      // Show unlock condition toast
      const config = SKIN_CONFIGS[key];
      if (config && config.conditionText) {
        alert(`解锁条件: ${config.conditionText}`);
      }
    }
  };

  return (
    <div className="skin-picker">
      <div className="skin-label" style={{ color: skin.textColor }}>Skin:</div>
      <div className="skin-options">
        {allSkinKeys.map((key) => {
          const skinConfig = SKINS[key] || SKINS.classic;
          const locked = !FESTIVAL_SKINS.includes(key) && (!isUnlocked || !isUnlocked(key));
          
          return (
            <button
              key={key}
              className={`skin-btn ${currentSkin === key ? 'active' : ''} ${locked ? 'locked' : ''}`}
              onClick={() => handleSkinClick(key)}
              style={{
                backgroundColor: currentSkin === key ? skin.buttonBg : skinConfig.background,
                borderColor: skin.buttonBg
              }}
              title={locked ? `🔒 ${skinConfig.name} (${SKIN_CONFIGS[key]?.conditionText || '未解锁'})` : skinConfig.name}
            >
              {locked ? (
                <span style={{ color: skinConfig.textColor, opacity: 0.5 }}>🔒</span>
              ) : (
                <span style={{ color: skinConfig.textColor }}>{skinConfig.name[0]}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
