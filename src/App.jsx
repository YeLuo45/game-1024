import React, { useState, useEffect } from 'react';
import { Game } from './components/Game';
import { Menu } from './components/Menu';
import { DailyChallenge } from './components/DailyChallenge';
import { Achievements } from './components/Achievements';
import { useDaily } from './hooks/useDaily';
import { useAchievements } from './hooks/useAchievements';
import { useStats } from './hooks/useStats';
import { getSkin, getCurrentFestival, FESTIVAL_SKINS } from './utils/skins';
import { useStorage } from './hooks/useStorage';
import './App.css';

function App() {
  // 'normal' | 'daily' — determines which game grid is used
  const [gameMode, setGameMode] = useState('normal');
  // '2048' | 'infinite' — determines win condition, stored independently
  const [playMode, setPlayMode] = useStorage('game-1024-mode', '2048');
  // Grid size for custom board: '4x4' | '5x5' | '6x6'
  const [gridSize, setGridSize] = useStorage('game-1024-gridsize', '4x4');
  // Dark mode state
  const [darkMode, setDarkMode] = useStorage('game-1024-darkmode', false);
  
  const [skinName, setSkinName] = useStorage('game-1024-skin', 'classic');
  const [currentPage, setCurrentPage] = useState('game'); // 'game' | 'menu' | 'daily' | 'achievements'

  // Auto-detect festival and switch skin
  useEffect(() => {
    const festivalSkin = getCurrentFestival();
    if (festivalSkin && festivalSkin !== skinName) {
      // Only auto-switch if user hasn't manually selected a different skin
      const manualSkin = localStorage.getItem('game-1024-skin-manual');
      if (!manualSkin || manualSkin === skinName) {
        setSkinName(festivalSkin);
      }
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Get effective skin (festival skin takes priority)
  const getEffectiveSkin = () => {
    const festivalSkin = getCurrentFestival();
    const effectiveSkin = festivalSkin || skinName;
    return getSkin(effectiveSkin);
  };

  const skin = getEffectiveSkin();

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

  const handleGridSizeChange = (newSize) => {
    setGridSize(newSize);
    // Switching grid size resets normal game
    if (gameMode === 'normal') {
      setGameMode(null);
      setTimeout(() => setGameMode('normal'), 0);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode(prev => !prev);
  };

  const handleSkinChange = (newSkin) => {
    // Mark this as manually selected so festival auto-switch won't override
    localStorage.setItem('game-1024-skin-manual', 'true');
    setSkinName(newSkin);
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
          darkMode={darkMode}
          onDarkModeToggle={handleDarkModeToggle}
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
          darkMode={darkMode}
          onDarkModeToggle={handleDarkModeToggle}
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
        gridSize={gridSize}
        onPlayModeChange={handlePlayModeChange}
        onGridSizeChange={handleGridSizeChange}
        onShowMenu={handleShowMenu}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
        currentSkin={skinName}
        onSkinChange={handleSkinChange}
      />
    </div>
  );
}

export default App;
