import React from 'react';
import { Star, ArrowRight, RotateCcw, Home, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface LevelCompleteModalProps {
  levelNumber: number;
  levelName: string;
  coinsCollected: number;
  totalCoins: number;
  starsCollected: number;
  maxCombo: number;
  timeRemaining: number;
  levelScore: number;
  livesRemaining: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRestartLevel: () => void;
  onGoHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  levelName,
  coinsCollected,
  totalCoins,
  starsCollected,
  maxCombo,
  timeRemaining,
  levelScore,
  livesRemaining,
  hasNextLevel,
  onNextLevel,
  onRestartLevel,
  onGoHome,
}) => {
  const isPerfectRun = livesRemaining === 3;
  const timeBonus = timeRemaining * 50;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-center">
        {/* Glow behind */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/15 blur-2xl pointer-events-none" />

        {/* Level Banner */}
        <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400 mb-1 block">
          Sector {levelNumber} Cleared
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
          {levelName}
        </h2>

        {/* Star Rating Display */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => {
            const hasStar = s <= starsCollected;
            return (
              <div
                key={s}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  hasStar
                    ? 'bg-purple-950/80 border-purple-500/80 text-purple-300 shadow-lg shadow-purple-500/20 scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-700'
                }`}
              >
                <Star
                  className={`w-6 h-6 ${hasStar ? 'fill-purple-400 text-purple-300' : ''}`}
                />
              </div>
            );
          })}
        </div>

        {/* Breakdown Stats */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 text-xs font-mono-nums space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Coins Collected:</span>
            <span className="font-bold text-amber-400">
              {coinsCollected} / {totalCoins}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Stars Found:</span>
            <span className="font-bold text-purple-300">
              {starsCollected} / 3 (+{starsCollected * 500} pts)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Max Combo Chain:</span>
            <span className="font-bold text-cyan-400">
              x{maxCombo}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Time Remaining Bonus:</span>
            <span className="font-bold text-emerald-400">
              +{timeBonus} pts ({timeRemaining}s)
            </span>
          </div>

          {isPerfectRun && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-emerald-400">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Flawless Run (No Damage):
              </span>
              <span className="font-bold">+1,000 pts</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/80 text-sm">
            <span className="text-slate-200 font-bold">Total Level Score:</span>
            <span className="font-black text-amber-400 text-base">
              {levelScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {hasNextLevel ? (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>NEXT SECTOR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>VIEW CAMPAIGN VICTORY</span>
              <Award className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => {
                sound.playClick();
                onRestartLevel();
              }}
              className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onGoHome();
              }}
              className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
