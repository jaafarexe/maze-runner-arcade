import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Direction, LevelDefinition, CoinItem, StarItem, PowerUpItem } from './types';
import { LEVELS, generateProceduralLevel } from './levels/levelData';
import { MazeCanvas } from './components/MazeCanvas';
import { HUD } from './components/HUD';
import { ControlsPad } from './components/ControlsPad';
import { HomeMenu } from './components/HomeMenu';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';
import { sound } from './utils/audio';

export default function App() {
  // Game State
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Campaign & Progression State
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('maze_unlocked_level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('maze_level_stars');
    return saved ? JSON.parse(saved) : {};
  });

  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('maze_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Current Active Run State
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [isEndlessMode, setIsEndlessMode] = useState<boolean>(false);
  const [endlessLevelNum, setEndlessLevelNum] = useState<number>(1);
  const [currentLevelDef, setCurrentLevelDef] = useState<LevelDefinition>(LEVELS[0]);

  // Player Run Stats
  const [score, setScore] = useState<number>(0);
  const [levelScore, setLevelScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeRemaining, setTimeRemaining] = useState<number>(50);
  const [coinsCollected, setCoinsCollected] = useState<number>(0);
  const [starsCollected, setStarsCollected] = useState<number>(0);
  const [maxComboInLevel, setMaxComboInLevel] = useState<number>(1);
  const [combo, setCombo] = useState<number>(1);
  const [comboTimeLeft, setComboTimeLeft] = useState<number>(0); // 0 to 2.5s
  const [gameOverReason, setGameOverReason] = useState<'LIVES' | 'TIME'>('LIVES');

  // Controls & Powerups
  const [currentDirection, setCurrentDirection] = useState<Direction>('NONE');
  const [activePowerUps, setActivePowerUps] = useState({
    speed: 0,
    shield: false,
    freeze: 0,
    magnet: 0,
  });
  const [invulnerableTime, setInvulnerableTime] = useState<number>(0);

  // Sound mute toggle
  const toggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  // Reset all saved progression
  const resetProgress = useCallback(() => {
    localStorage.removeItem('maze_unlocked_level');
    localStorage.removeItem('maze_level_stars');
    localStorage.removeItem('maze_high_score');
    setUnlockedLevel(1);
    setLevelStars({});
    setHighScore(0);
  }, []);

  // Check and update high score
  const updateHighScore = useCallback((newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('maze_high_score', String(newScore));
      return true;
    }
    return false;
  }, [highScore]);

  // Start a specific level
  const startLevel = useCallback((levelIndex: number, retainScore = 0, retainLives = 3) => {
    const targetLevel = LEVELS[levelIndex] || LEVELS[0];
    setIsEndlessMode(false);
    setCurrentLevelIndex(levelIndex);
    setCurrentLevelDef(targetLevel);
    setScore(retainScore);
    setLevelScore(0);
    setLives(retainLives);
    setTimeRemaining(targetLevel.timeLimit);
    setCoinsCollected(0);
    setStarsCollected(0);
    setCombo(1);
    setComboTimeLeft(0);
    setMaxComboInLevel(1);
    setCurrentDirection('NONE');
    setActivePowerUps({ speed: 0, shield: false, freeze: 0, magnet: 0 });
    setInvulnerableTime(0);
    setGameState('PLAYING');
  }, []);

  // Start Endless Mode
  const startEndless = useCallback((lvlNum = 1, retainScore = 0) => {
    const proceduralDef = generateProceduralLevel(lvlNum);
    setIsEndlessMode(true);
    setEndlessLevelNum(lvlNum);
    setCurrentLevelDef(proceduralDef);
    setScore(retainScore);
    setLevelScore(0);
    setLives(3);
    setTimeRemaining(proceduralDef.timeLimit);
    setCoinsCollected(0);
    setStarsCollected(0);
    setCombo(1);
    setComboTimeLeft(0);
    setMaxComboInLevel(1);
    setCurrentDirection('NONE');
    setActivePowerUps({ speed: 0, shield: false, freeze: 0, magnet: 0 });
    setInvulnerableTime(0);
    setGameState('PLAYING');
  }, []);

  // Restart Current Level
  const restartCurrentLevel = useCallback(() => {
    if (isEndlessMode) {
      startEndless(endlessLevelNum, score - levelScore);
    } else {
      startLevel(currentLevelIndex, score - levelScore, 3);
    }
  }, [isEndlessMode, endlessLevelNum, currentLevelIndex, score, levelScore, startEndless, startLevel]);

  // Handle Coin Pickup
  const handleCoinCollected = useCallback((_coin: CoinItem, comboMultiplier: number) => {
    const basePts = 100;
    const gained = basePts * comboMultiplier;

    setScore(prev => prev + gained);
    setLevelScore(prev => prev + gained);
    setCoinsCollected(prev => prev + 1);
    setCombo(comboMultiplier);
    setComboTimeLeft(2.5); // Reset 2.5s combo window
    setMaxComboInLevel(prev => Math.max(prev, comboMultiplier));
  }, []);

  // Handle Star Pickup
  const handleStarCollected = useCallback((_star: StarItem) => {
    const starPts = 500;
    setScore(prev => prev + starPts);
    setLevelScore(prev => prev + starPts);
    setStarsCollected(prev => Math.min(3, prev + 1));
  }, []);

  // Handle PowerUp Pickup
  const handlePowerUpCollected = useCallback((powerUp: PowerUpItem) => {
    setActivePowerUps(prev => {
      const next = { ...prev };
      if (powerUp.type === 'SPEED') next.speed = 8;
      else if (powerUp.type === 'SHIELD') next.shield = true;
      else if (powerUp.type === 'FREEZE') next.freeze = 5;
      else if (powerUp.type === 'MAGNET') next.magnet = 7;
      return next;
    });
  }, []);

  // Handle Trap Hit
  const handleTrapHit = useCallback(() => {
    if (invulnerableTime > 0) return;

    if (activePowerUps.shield) {
      sound.playHit();
      setActivePowerUps(prev => ({ ...prev, shield: false }));
      setInvulnerableTime(1.0);
      return;
    }

    sound.playHit();
    setLives(prev => {
      const remaining = prev - 1;
      if (remaining <= 0) {
        sound.playGameOver();
        setGameOverReason('LIVES');
        updateHighScore(score);
        setGameState('GAME_OVER');
      }
      return Math.max(0, remaining);
    });
    setInvulnerableTime(1.5);
    setCombo(1);
    setComboTimeLeft(0);
  }, [invulnerableTime, activePowerUps.shield, score, updateHighScore]);

  // Handle Enemy Hit
  const handleEnemyHit = useCallback(() => {
    if (invulnerableTime > 0) return;

    if (activePowerUps.shield) {
      sound.playHit();
      setActivePowerUps(prev => ({ ...prev, shield: false }));
      setInvulnerableTime(1.0);
      return;
    }

    sound.playHit();
    setLives(prev => {
      const remaining = prev - 1;
      if (remaining <= 0) {
        sound.playGameOver();
        setGameOverReason('LIVES');
        updateHighScore(score);
        setGameState('GAME_OVER');
      }
      return Math.max(0, remaining);
    });
    setInvulnerableTime(1.5);
    setCombo(1);
    setComboTimeLeft(0);
  }, [invulnerableTime, activePowerUps.shield, score, updateHighScore]);

  // Handle Reaching Exit Portal
  const handleReachExit = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    sound.playLevelComplete();

    // Bonus points calculation
    const timeBonus = timeRemaining * 50;
    const noDamageBonus = lives === 3 ? 1000 : 0;
    const totalLevelBonus = timeBonus + noDamageBonus;

    const finalScore = score + totalLevelBonus;
    setScore(finalScore);
    setLevelScore(prev => prev + totalLevelBonus);
    updateHighScore(finalScore);

    // Update Campaign Stars & Unlock
    if (!isEndlessMode) {
      const currentLevelId = currentLevelDef.id;
      const prevStars = levelStars[currentLevelId] || 0;
      const newStars = Math.max(prevStars, starsCollected);

      const updatedStars = { ...levelStars, [currentLevelId]: newStars };
      setLevelStars(updatedStars);
      localStorage.setItem('maze_level_stars', JSON.stringify(updatedStars));

      if (currentLevelId >= unlockedLevel && currentLevelId < LEVELS.length) {
        const nextUnlock = currentLevelId + 1;
        setUnlockedLevel(nextUnlock);
        localStorage.setItem('maze_unlocked_level', String(nextUnlock));
      }
    }

    setGameState('LEVEL_COMPLETE');
  }, [gameState, timeRemaining, lives, score, updateHighScore, isEndlessMode, currentLevelDef.id, levelStars, starsCollected, unlockedLevel]);

  // Go to Next Level after Level Complete
  const handleNextLevel = useCallback(() => {
    if (isEndlessMode) {
      startEndless(endlessLevelNum + 1, score);
    } else {
      if (currentLevelIndex < LEVELS.length - 1) {
        startLevel(currentLevelIndex + 1, score, Math.min(3, lives + 1));
      } else {
        // Finished Level 5 -> Victory!
        sound.playLevelComplete();
        setGameState('VICTORY');
      }
    }
  }, [isEndlessMode, endlessLevelNum, score, currentLevelIndex, lives, startEndless, startLevel]);

  // Main Timer & PowerUp countdown interval (runs when PLAYING)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = window.setInterval(() => {
      // 1. Level Countdown Timer
      setTimeRemaining(prev => {
        if (prev <= 1) {
          sound.playGameOver();
          setGameOverReason('TIME');
          updateHighScore(score);
          setGameState('GAME_OVER');
          return 0;
        }
        return prev - 1;
      });

      // 2. Active PowerUp Durations
      setActivePowerUps(prev => ({
        ...prev,
        speed: Math.max(0, prev.speed - 1),
        freeze: Math.max(0, prev.freeze - 1),
        magnet: Math.max(0, prev.magnet - 1),
      }));

      // 3. Invulnerability flash timer
      setInvulnerableTime(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, score, updateHighScore]);

  // High-frequency combo window decay (60fps interval for smooth combo meter bar)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let lastT = performance.now();
    let frameId: number;

    const step = (t: number) => {
      const dt = (t - lastT) / 1000;
      lastT = t;

      setComboTimeLeft(prev => {
        if (prev > 0) {
          const next = prev - dt;
          if (next <= 0) {
            setCombo(1);
            return 0;
          }
          return next;
        }
        return 0;
      });

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  // Keyboard Event Handlers (WASD + Arrow keys + Space/P to Pause + R to restart)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Pause toggle
      if (key === 'p' || key === ' ') {
        e.preventDefault();
        if (gameState === 'PLAYING') {
          sound.playClick();
          setGameState('PAUSED');
        } else if (gameState === 'PAUSED') {
          sound.playClick();
          setGameState('PLAYING');
        }
        return;
      }

      // Restart shortcut
      if (key === 'r') {
        if (gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAME_OVER') {
          e.preventDefault();
          sound.playClick();
          restartCurrentLevel();
          return;
        }
      }

      // Mute toggle
      if (key === 'm') {
        e.preventDefault();
        toggleMute();
        return;
      }

      // Direction keys
      if (gameState === 'PLAYING') {
        if (key === 'arrowup' || key === 'w') {
          e.preventDefault();
          setCurrentDirection('UP');
        } else if (key === 'arrowdown' || key === 's') {
          e.preventDefault();
          setCurrentDirection('DOWN');
        } else if (key === 'arrowleft' || key === 'a') {
          e.preventDefault();
          setCurrentDirection('LEFT');
        } else if (key === 'arrowright' || key === 'd') {
          e.preventDefault();
          setCurrentDirection('RIGHT');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, restartCurrentLevel, toggleMute]);

  const totalCampaignStars = Object.values(levelStars).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#080c14] text-slate-100 overflow-hidden font-sans">
      {/* 1. TITLE SCREEN */}
      {gameState === 'TITLE_MENU' && (
        <div className="w-full h-full overflow-y-auto">
          <HomeMenu
            unlockedLevel={unlockedLevel}
            levelStars={levelStars}
            highScore={highScore}
            onStartGame={(idx) => startLevel(idx, 0, 3)}
            onStartEndless={() => startEndless(1, 0)}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onResetProgress={resetProgress}
          />
        </div>
      )}

      {/* 2. PLAYING / PAUSED / IN-GAME SCREEN */}
      {gameState !== 'TITLE_MENU' && (
        <div className="w-full h-full flex flex-col">
          {/* Top HUD */}
          <HUD
            levelNumber={isEndlessMode ? endlessLevelNum : currentLevelDef.id}
            levelName={isEndlessMode ? 'Endless Sector' : currentLevelDef.name}
            lives={lives}
            maxLives={3}
            score={score}
            combo={combo}
            comboTimer={comboTimeLeft / 2.5}
            timeRemaining={timeRemaining}
            coinsCollected={coinsCollected}
            totalCoins={currentLevelDef.coins.length}
            starsCollected={starsCollected}
            isPaused={gameState === 'PAUSED'}
            isMuted={isMuted}
            activePowerUps={activePowerUps}
            onTogglePause={() => {
              sound.playClick();
              setGameState(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
            }}
            onToggleMute={toggleMute}
            onRestartLevel={restartCurrentLevel}
          />

          {/* Interactive Maze Canvas Area */}
          <main className="flex-1 relative w-full h-full flex items-center justify-center p-2">
            <MazeCanvas
              level={currentLevelDef}
              isPaused={gameState !== 'PLAYING'}
              onCoinCollected={handleCoinCollected}
              onStarCollected={handleStarCollected}
              onPowerUpCollected={handlePowerUpCollected}
              onTrapHit={handleTrapHit}
              onEnemyHit={handleEnemyHit}
              onReachExit={handleReachExit}
              lives={lives}
              combo={combo}
              currentDirection={currentDirection}
              setCurrentDirection={setCurrentDirection}
              activePowerUps={activePowerUps}
              invulnerableTime={invulnerableTime}
            />

            {/* Quick Keyboard Indicator Badge (Desktop) */}
            <div className="hidden lg:flex absolute bottom-3 left-3 items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 select-none backdrop-blur-sm pointer-events-none">
              <span>Move: <strong className="text-cyan-400">WASD / Arrows</strong></span>
              <span>·</span>
              <span>Pause: <strong className="text-slate-200">Space</strong></span>
              <span>·</span>
              <span>Restart: <strong className="text-slate-200">R</strong></span>
            </div>
          </main>

          {/* Mobile & Touch Virtual D-Pad (Visible on small & tablet screens) */}
          <div className="lg:hidden w-full bg-slate-950/90 border-t border-slate-800/80 shrink-0 flex items-center justify-center py-1">
            <ControlsPad
              currentDirection={currentDirection}
              onDirectionChange={setCurrentDirection}
            />
          </div>
        </div>
      )}

      {/* 3. MODALS & OVERLAYS */}
      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={() => setGameState('PLAYING')}
          onRestart={restartCurrentLevel}
          onGoHome={() => setGameState('TITLE_MENU')}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}

      {gameState === 'LEVEL_COMPLETE' && (
        <LevelCompleteModal
          levelNumber={isEndlessMode ? endlessLevelNum : currentLevelDef.id}
          levelName={currentLevelDef.name}
          coinsCollected={coinsCollected}
          totalCoins={currentLevelDef.coins.length}
          starsCollected={starsCollected}
          maxCombo={maxComboInLevel}
          timeRemaining={timeRemaining}
          levelScore={levelScore}
          livesRemaining={lives}
          hasNextLevel={isEndlessMode || currentLevelIndex < LEVELS.length - 1}
          onNextLevel={handleNextLevel}
          onRestartLevel={restartCurrentLevel}
          onGoHome={() => setGameState('TITLE_MENU')}
        />
      )}

      {gameState === 'GAME_OVER' && (
        <GameOverModal
          reason={gameOverReason}
          levelNumber={isEndlessMode ? endlessLevelNum : currentLevelDef.id}
          finalScore={score}
          highScore={highScore}
          isNewHighScore={score > highScore}
          onRestart={restartCurrentLevel}
          onGoHome={() => setGameState('TITLE_MENU')}
        />
      )}

      {gameState === 'VICTORY' && (
        <VictoryModal
          totalScore={score}
          totalStars={totalCampaignStars}
          highScore={highScore}
          onPlayAgain={() => startLevel(0, 0, 3)}
          onStartEndless={() => startEndless(1, 0)}
          onGoHome={() => setGameState('TITLE_MENU')}
        />
      )}
    </div>
  );
}
