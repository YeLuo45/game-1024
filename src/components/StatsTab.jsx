import React from 'react';

function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString();
}

function WinRateBar({ wins, played }) {
  const rate = played > 0 ? (wins / played) * 100 : 0;
  return (
    <div className="win-rate-bar">
      <div className="win-rate-track">
        <div className="win-rate-fill" style={{ width: `${rate}%` }} />
      </div>
      <span className="win-rate-text">{rate.toFixed(1)}%</span>
    </div>
  );
}

function StatsCard({ title, modeKey, stats }) {
  const modeStats = stats[modeKey] || {};
  const { gamesPlayed = 0, gamesWon = 0, bestScore = 0, totalScore = 0, maxTile = 0 } = modeStats;
  const avgScore = gamesPlayed > 0 ? Math.round(totalScore / gamesPlayed) : 0;
  const showWinRate = modeKey !== 'infinite';

  return (
    <div className="stats-card">
      <h3 className="stats-card-title">{title}</h3>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{formatNumber(gamesPlayed)}</div>
          <div className="stat-label">场次</div>
        </div>
        
        {showWinRate && (
          <div className="stat-item win-rate-item">
            <WinRateBar wins={gamesWon} played={gamesPlayed} />
            <div className="stat-label">胜率</div>
          </div>
        )}
        
        <div className="stat-item">
          <div className="stat-value best">{formatNumber(bestScore)}</div>
          <div className="stat-label">最高分</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{formatNumber(avgScore)}</div>
          <div className="stat-label">平均分</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value max-tile">{maxTile > 0 ? maxTile : '-'}</div>
          <div className="stat-label">最高方块</div>
        </div>
      </div>
    </div>
  );
}

export function StatsTab({ stats }) {
  return (
    <div className="stats-container">
      <StatsCard title="🎮 2048模式" modeKey="2048" stats={stats} />
      <StatsCard title="♾️ 无限模式" modeKey="infinite" stats={stats} />
      <StatsCard title="📅 每日挑战" modeKey="daily" stats={stats} />
    </div>
  );
}
