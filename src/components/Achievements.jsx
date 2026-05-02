import React from 'react';
import { ACHIEVEMENTS } from '../utils/achievements';

export function Achievements({ achievementsState, onBack }) {
  const { unlocked = [], unlockDates = {} } = achievementsState;

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <button className="back-btn" onClick={onBack}>← 返回</button>
        <h2>🏆 成就列表</h2>
      </div>
      <div className="achievements-list">
        {ACHIEVEMENTS.map(achievement => {
          const isUnlocked = unlocked.includes(achievement.id);
          return (
            <div 
              key={achievement.id} 
              className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {isUnlocked ? '🏆' : '🔒'}
              </div>
              <div className="achievement-info">
                <div className="achievement-name">{achievement.name}</div>
                <div className="achievement-desc">{achievement.desc}</div>
                {isUnlocked && unlockDates[achievement.id] && (
                  <div className="achievement-date">{unlockDates[achievement.id]}</div>
                )}
              </div>
              <div className="achievement-reward">+{achievement.reward}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
