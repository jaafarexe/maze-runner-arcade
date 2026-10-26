import React from 'react';
import { Heart, Pause, Play, RotateCcw, Volume2, VolumeX, Star, Zap, Shield, Sparkles } from 'lucide-react';

interface HUDProps {
  levelNumber: number;
  levelName: string;
  lives: number;
  maxLives: number;
  score: number;
  combo: number;
  comboTimer: number; // 0 to 1
  timeRemaining: number;
  coinsCollected: number;
  totalCoins: number;
  starsCollected: number;
  isPaused: boolean;
  isMuted: boolean;
  activePowerUps: {
    speed: number;
    shield: boolean;
    freeze: number;
    magnet: number;
  };
  onTogglePause: () => void;
  onToggleMute: () => void;
  onRestartLevel: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  levelNumber,
  levelName,
  lives,
  maxLives,
  score,
  combo,
  comboTimer,
  timeRemaining,
  coinsCollected,
  totalCoins,
  starsCollected,
  isPaused,
  isMuted,
  activePowerUps,
  onTogglePause,
  onToggleMute,
  onRestartLevel,
}) => {
  const isTimeLow = timeRemaining <= 15;

  return (
    <header className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm select-none z-20">
      {/* Zone 1: Brand & Level Info */}
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
          <span className="text-cyan-400">MAZE</span>RUNNER
        </span>
        <span className="text-slate-500 font-mono text-xs">/</span>
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <span className="font-semibold text-cyan-400">LVL {levelNumber}</span>
          <span className="hidden sm:inline text-slate-400 truncate max-w-[120px] md:max-w-none">
            {levelName}
          </span>
        </div>
      </div>

      {/* Zone 2: Lives, Timer, Score, and Combo */}
      <div className="flex items-center gap-4 sm:gap-6 font-mono-nums text-xs">
        {/* Lives */}
        <div className="flex items-center gap-1" title="Remaining Lives">
          {Array.from({ length: maxLives }).map((_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 transition-colors ${
                i < lives 
                  ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]' 
                  : 'text-slate-700'
              }`}
            />
          ))}
          <span className="ml-1 text-slate-400 font-bold">{lives}/{maxLives}</span>
        </div>

        {/* Timer */}
        <div 
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors ${
            isTimeLow 
              ? 'bg-rose-950/60 border-rose-600 text-rose-400 animate-pulse' 
              : 'bg-slate-800/80 border-slate-700 text-slate-200'
          }`}
          title="Time Remaining"
        >
          <span className="text-slate-400 text-[10px]">TIME</span>
          <span className="font-bold text-sm tracking-wider">
            {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
          </span>
        </div>

        {/* Score & Combo */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
            <span className="font-bold text-sm text-amber-400 tracking-wider">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Combo Multiplier Meter */}
          {combo > 1 && (
            <div className="flex flex-col items-center">
              <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-bounce">
                x{combo}
              </span>
              <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div 
                  className="h-full bg-amber-400 transition-all duration-75"
                  style={{ width: `${Math.max(0, Math.min(100, comboTimer * 100))}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stars */}
        <div className="hidden sm:flex items-center gap-0.5" title="Stars collected">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-3.5 h-3.5 ${
                starIdx <= starsCollected 
                  ? 'text-purple-400 fill-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]' 
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Zone 3: Active PowerUps & Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Active Powerups Badges */}
        <div className="flex items-center gap-1.5 mr-1">
          {activePowerUps.speed > 0 && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-600/60 text-amber-300 text-[10px] font-mono" title="Speed Dash">
              <Zap className="w-3 h-3" />
              <span>{Math.ceil(activePowerUps.speed)}s</span>
            </span>
          )}
          {activePowerUps.shield && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-600/60 text-emerald-300 text-[10px] font-mono" title="Energy Shield Active">
              <Shield className="w-3 h-3" />
              <span>ON</span>
            </span>
          )}
          {activePowerUps.freeze > 0 && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-600/60 text-cyan-300 text-[10px] font-mono" title="Enemies Frozen">
              <Sparkles className="w-3 h-3" />
              <span>{Math.ceil(activePowerUps.freeze)}s</span>
            </span>
          )}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          title={isMuted ? "Unmute (M)" : "Mute (M)"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Restart Level Button */}
        <button
          onClick={onRestartLevel}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          aria-label="Restart current level"
          title="Restart Level (R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Pause Button */}
        <button
          onClick={onTogglePause}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all border ${
            isPaused
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
          aria-label={isPaused ? "Resume Game" : "Pause Game"}
          title="Pause (P / Space)"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
        </button>
      </div>
    </header>
  );
};
