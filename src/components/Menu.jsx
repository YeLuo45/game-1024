import React from 'react';

export function Menu({ onDailyChallenge, onAchievements, onBack, skin }) {
  return (
    <div className="menu-page">
      <div className="menu-header">
        <button className="back-btn" onClick={onBack}>← 返回</button>
        <h2>☰ 菜单</h2>
      </div>
      <div className="menu-list">
        <button 
          className="menu-item" 
          onClick={onDailyChallenge}
          style={{ backgroundColor: skin.buttonBg }}
        >
          📅 每日挑战
        </button>
        <button 
          className="menu-item" 
          onClick={onAchievements}
          style={{ backgroundColor: skin.buttonBg }}
        >
          🏆 成就
        </button>
      </div>
    </div>
  );
}
