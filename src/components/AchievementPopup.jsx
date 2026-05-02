import React from 'react';

export function AchievementPopup({ achievement, onDismiss }) {
  if (!achievement) return null;

  return (
    <div className="achievement-popup-overlay" onClick={onDismiss}>
      <div className="achievement-popup">
        <div className="achievement-popup-icon">🏆</div>
        <div className="achievement-popup-title">成就解锁</div>
        <div className="achievement-popup-name">{achievement.name}</div>
        <div className="achievement-popup-desc">{achievement.desc}</div>
        <div className="achievement-popup-reward">+{achievement.reward} coins</div>
      </div>
    </div>
  );
}
