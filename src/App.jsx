import React, { useState } from 'react';
import { Game } from './components/Game';
import { Menu } from './components/Menu';
import { DailyChallenge } from './components/DailyChallenge';
import { Achievements } from './components/Achievements';
import { useDaily } from './hooks/useDaily';
import { useAchievements } from './hooks/useAchievements';
import { getSkin } from './utils/skins';
import { useStorage } from './hooks/useStorage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('game'); // 'game' | 'menu' | 'daily' | 'achievements'
  const [gameMode, setGameMode] = useState('normal'); // 'normal' | 'daily'
  const [skinName] = useStorage('game-1024-skin', 'classic');
  const skin = getSkin(skinName);
  
  const { daily, updateBestScore, dailyGrid } = useDaily();
  const { achievementsState, pendingPopup, dismissPopup, isUnlocked, checkDaily3, getPlayedDaysCount } = useAchievements();

  const handleShowMenu = () => setCurrentPage('menu');
  const handleBackToGame = () => setCurrentPage('game');
  
  const handleShowDailyChallenge = () => setCurrentPage('daily');
  const handleStartDailyChallenge = () => {
    setGameMode('daily');
    setCurrentPage('game');
  };

  const handleShowAchievements = () => setCurrentPage('achievements');

  // Normal mode when returning from daily
  const handleBackFromDaily = () => {
    setGameMode('normal');
    setCurrentPage('game');
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
        />
      </div>
    );
  }

  return (
    <div className="app" style={{ backgroundColor: skin.background }}>
      <Game 
        gameMode={gameMode}
        onShowMenu={handleShowMenu}
      />
    </div>
  );
}

export default App;
