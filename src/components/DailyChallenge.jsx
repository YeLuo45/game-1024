import React, { useState, useEffect, useCallback } from 'react';
import { getDailyDateStr, getTimeUntilMidnight } from '../utils/daily';

export function DailyChallenge({ daily, onBack, onStartChallenge, skin, darkMode, onDarkModeToggle }) {
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (ms) => {
    if (ms <= 0) return '00:00:00';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="daily-challenge-page">
      <div className="daily-header">
        <button className="back-btn" onClick={onBack}>← 返回</button>
        <h2>📅 每日挑战</h2>
        <button
          className="dark-mode-btn"
          onClick={onDarkModeToggle}
          style={{ backgroundColor: skin.buttonBg }}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div className="daily-info">
        <div className="daily-date">
          <span className="label">今日日期</span>
          <span className="value">{daily.dailyDate}</span>
        </div>
        <div className="daily-countdown">
          <span className="label">重置倒计时</span>
          <span className="value countdown-value">{formatCountdown(countdown)}</span>
        </div>
        <div className="daily-best">
          <span className="label">今日最高分</span>
          <span className="value">{daily.bestScore}</span>
        </div>
        <div className="daily-played">
          <span className="label">今日状态</span>
          <span className="value">{daily.playedToday ? '✅ 已完成' : '⏳ 未开始'}</span>
        </div>
      </div>

      <button 
        className="start-daily-btn"
        onClick={onStartChallenge}
        style={{ backgroundColor: skin.buttonBg }}
      >
        开始挑战
      </button>

      {Object.keys(daily.dailyHistory).length > 0 && (
        <div className="daily-history">
          <h3>历史记录</h3>
          {Object.entries(daily.dailyHistory).map(([date, score]) => (
            <div key={date} className="history-item">
              <span>{date}</span>
              <span>{score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
