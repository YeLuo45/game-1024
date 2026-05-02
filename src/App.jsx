import React, { useState } from 'react';
import { Game } from './components/Game';
import { Menu } from './components/Menu';
import { DailyChallenge } from './components/DailyChallenge';
import { Achievements } from './components/Achievements';
import { useDaily } from './hooks/useDaily';
import { useAchievements } from './hooks/useAchievements';
import { useStats } from './hooks/useStats';
import { getSkin } from './utils/skins';
import { useStorage } from './hooks/useStorage';
import './App.css';

function App() {
  // 'normal' | 'daily' — determines which game grid is used
  const [gameMode, setGameMode] = useState('normal');
  // '2048' | 'infinite' — determines win condition, stored independently
  const [playMode, setPlayMode] = useStorage('game-1024-mode', '2048');
  const [skinName] = useStorage('game-1024-skin', 'classic');
  const skin = getSkin(skinName);

  const [currentPage, setCurrentPage] = useState('game'); // 'game' | 'menu' | 'daily' | 'achievements'

  const { daily, updateBestScore, dailyGrid } = useDaily();
  const { achievementsState, pendingPopup, dismissPopup, isUnlocked, checkDaily3, getPlayedDaysCount } = useAchievements();
  const { stats, updateStats } = useStats();

  const handleShowMenu = () => setCurrentPage('menu');
  const handleBackToGame = () => setCurrentPage('game');

  const handleShowDailyChallenge = () => setCurrentPage('daily');
  const handleStartDailyChallenge = () => {
    setGameMode('daily');
    setCurrentPage('game');
  };

  const handleShowAchievements = () => setCurrentPage('achievements');

  const handleBackFromDaily = () => {
    setGameMode('normal');
    setCurrentPage('game');
  };

  const handlePlayModeChange = (newMode) => {
    setPlayMode(newMode);
    // Switching play mode resets normal game
    if (gameMode === 'normal') {
      // Force re-init by briefly toggling gameMode
      setGameMode(null);
      setTimeout(() => setGameMode('normal'), 0);
    }
  };

  // Render based on current page
  if (currentPage === 'menu') {
    return (
      <div className="app" style={{ backgroundColor: skin.background }}>
        <Menu
          onDailyChallenge={handleShowDailyChallenge}
          onAchievements={handleShowAchievements}
          onBack={handleBackToGame}
          skin={skin}
        />
      </div>
    );
  }

  if (currentPage === 'daily') {
    return (
      <div className="app" style={{ backgroundColor: skin.background }}>
        <DailyChallenge
          daily={daily}
          onBack={handleBackFromDaily}
          onStartChallenge={handleStartDailyChallenge}
          skin={skin}
        />
      </div>
    );
  }

  if (currentPage === 'achievements') {
    return (
      <div className="app" style={{ backgroundColor: skin.background }}>
        <Achievements
          achievementsState={achievementsState}
          onBack={handleBackToGame}
          stats={stats}
        />
      </div>
    );
  }

  return (
    <div className="app" style={{ backgroundColor: skin.background }}>
      <Game
        gameMode={gameMode}
        playMode={playMode}
        onPlayModeChange={handlePlayModeChange}
        onShowMenu={handleShowMenu}
      />
    </div>
  );
}

export default App;
