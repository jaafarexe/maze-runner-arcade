import React from 'react';
import { Play, Star, Shield, Zap, Sparkles, Trophy, ArrowRight, Lock, RotateCcw, Compass, Volume2, VolumeX } from 'lucide-react';
import { LEVELS } from '../levels/levelData';
import { sound } from '../utils/audio';

interface HomeMenuProps {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  highScore: number;
  onStartGame: (levelIndex: number) => void;
  onStartEndless: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetProgress: () => void;
}

export const HomeMenu: React.FC<HomeMenuProps> = ({
  unlockedLevel,
  levelStars,
  highScore,
  onStartGame,
  onStartEndless,
  isMuted,
  onToggleMute,
  onResetProgress,
}) => {
  const totalStarsEarned = Object.values(levelStars).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center select-none">
      {/* Top Banner Bar */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black text-lg">
            M
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>MAZE RUNNER</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono tracking-wider">
                ARCADE
              </span>
            </h1>
            <p className="text-xs text-slate-400">Precision navigation & combo scoring labyrinth</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Toggle Sound Effects"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          {/* High Score & Stars Badges */}
          <div className="flex items-center gap-3 text-xs font-mono-nums">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">BEST:</span>
              <span className="text-amber-400 font-bold">{highScore.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <Star className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
              <span className="text-purple-300 font-bold">{totalStarsEarned}/15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Action Card */}
      <div className="w-full bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-xs uppercase font-semibold tracking-widest text-cyan-400 mb-2">
            Arcade Campaign
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Outrun Hazards. Build Combos. Conquer the Labyrinth.
          </h2>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Navigate intricate cyber mazes with fluid controls. Snatch gold coins to chain combos, collect hidden stars, evade patrol drones and spike traps, and reach the exit portal before time expires!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onStartGame(Math.min(unlockedLevel - 1, LEVELS.length - 1));
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY LEVEL {unlockedLevel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onStartEndless();
              }}
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm tracking-wide flex items-center gap-2 transition-all active:scale-95"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>ENDLESS MAZE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rules & Controls Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Controls Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Controls
          </h3>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-center justify-between">
              <span className="text-slate-400">Desktop Movement:</span>
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-cyan-300">
                WASD / Arrows
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-400">Mobile & Touch:</span>
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-cyan-300">
                Virtual D-Pad / Swipe
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-400">Pause / Restart:</span>
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                Space or P / R
              </span>
            </li>
          </ul>
        </div>

        {/* Scoring & Combos */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Scoring & Combos
          </h3>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">Gold Coins:</span>
              <span>+100 pts. Collect consecutively within 2.5s for up to <strong className="text-amber-300">5x Multiplier</strong>!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">Bonus Stars:</span>
              <span>3 hidden per level (+500 pts each) for perfect rating.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">Time Bonus:</span>
              <span>Remaining seconds converted directly to points!</span>
            </li>
          </ul>
        </div>

        {/* Threats & Gadgets */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Hazards & Power-Ups
          </h3>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">3 Lives:</span>
              <span>Avoid patrol drones and active floor spikes. 1.5s invulnerability after hits.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">Power-Ups:</span>
              <span>Speed Boost (⚡), Energy Shield (🛡), Freeze Clocks (❄), Coin Magnet (🧲).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Level Select Grid */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white tracking-tight">Campaign Sectors</h3>
          <span className="text-xs text-slate-400 font-mono-nums">
            Unlocked: {Math.min(unlockedLevel, LEVELS.length)} / {LEVELS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {LEVELS.map((lvl) => {
            const isUnlocked = lvl.id <= unlockedLevel;
            const stars = levelStars[lvl.id] || 0;

            return (
              <div
                key={lvl.id}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playClick();
                    onStartGame(lvl.id - 1);
                  }
                }}
                className={`relative rounded-xl p-4 border transition-all text-left ${
                  isUnlocked
                    ? 'bg-slate-900/80 border-slate-700/80 hover:border-cyan-500/80 hover:bg-slate-850 cursor-pointer group shadow-lg hover:shadow-cyan-500/10'
                    : 'bg-slate-950/40 border-slate-800/40 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isUnlocked ? 'text-cyan-400' : 'text-slate-500'}`}>
                    LVL 0{lvl.id}
                  </span>
                  {isUnlocked ? (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars 
                              ? 'text-purple-400 fill-purple-400 drop-shadow-[0_0_4px_rgba(192,132,252,0.8)]' 
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors truncate">
                  {lvl.name}
                </h4>

                <p className="text-[11px] text-slate-400 mb-3 line-clamp-2 h-8">
                  {lvl.subtitle}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] font-mono-nums text-slate-400">
                  <span>{lvl.width}x{lvl.height}</span>
                  <span>{lvl.timeLimit}s</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="w-full flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-500">
          <span>Retro-Modern Arcade Engine · Pure Web Audio</span>
          <button
            onClick={() => {
              if (window.confirm("Reset all saved high scores and unlocked levels?")) {
                onResetProgress();
              }
            }}
            className="hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
