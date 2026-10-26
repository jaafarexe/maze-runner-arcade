import React from 'react';
import { RotateCcw, Home, Skull, Trophy } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  reason: 'LIVES' | 'TIME';
  levelNumber: number;
  finalScore: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  levelNumber,
  finalScore,
  highScore,
  isNewHighScore,
  onRestart,
  onGoHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-center">
        {/* Glow behind */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-rose-500/15 blur-2xl pointer-events-none" />

        {/* Skull Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center mx-auto mb-4 text-rose-500 shadow-lg shadow-rose-950/50">
          <Skull className="w-7 h-7" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
          GAME OVER
        </h2>
        <p className="text-xs text-rose-400 font-mono mb-6">
          {reason === 'LIVES' ? 'Critical Systems Failure · All Lives Depleted' : 'Chronometer Expired · Run Timed Out'}
        </p>

        {/* New High Score Alert */}
        {isNewHighScore && (
          <div className="mb-4 py-2 px-3 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>NEW ALL-TIME RECORD!</span>
          </div>
        )}

        {/* Run Stats */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 text-xs font-mono-nums space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Sector Reached:</span>
            <span className="font-bold text-slate-200">Sector {levelNumber}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Run Score:</span>
            <span className="font-bold text-amber-400 text-sm">{finalScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-400">All-Time Best:</span>
            <span className="font-bold text-slate-300">{Math.max(finalScore, highScore).toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
