import React, { useState } from 'react';
import { ACHIEVEMENTS } from '../utils/achievements';
import { StatsTab } from './StatsTab';

export function Achievements({ achievementsState, onBack, stats }) {
  const { unlocked = [], unlockDates = {} } = achievementsState;
  const [activeTab, setActiveTab] = useState('achievements');

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <button className="back-btn" onClick={onBack}>← 返回</button>
        <h2>🏆 {activeTab === 'achievements' ? '成就列表' : '数据统计'}</h2>
      </div>
      
      <div className="tab-bar">
        <button 
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          成就
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          统计
        </button>
      </div>

      {activeTab === 'achievements' ? (
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
      ) : (
        <StatsTab stats={stats || {}} />
      )}
    </div>
  );
}
