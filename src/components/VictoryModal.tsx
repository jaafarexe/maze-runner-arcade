import React from 'react';
import { Trophy, Star, RotateCcw, Home, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

interface VictoryModalProps {
  totalScore: number;
  totalStars: number;
  highScore: number;
  onPlayAgain: () => void;
  onStartEndless: () => void;
  onGoHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  totalScore,
  totalStars,
  highScore,
  onPlayAgain,
  onStartEndless,
  onGoHome,
}) => {
  const getRank = () => {
    if (totalStars >= 14) return { grade: 'S+', title: 'Master Labyrinth Champion', color: 'text-amber-400' };
    if (totalStars >= 11) return { grade: 'A', title: 'Elite Maze Runner', color: 'text-cyan-400' };
    return { grade: 'B', title: 'Survivor Runner', color: 'text-emerald-400' };
  };

  const rank = getRank();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-center">
        {/* Glow behind */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-28 bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Trophy Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-600/80 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-xl shadow-amber-950/50">
          <Trophy className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 mb-1 block">
          Campaign Conquered
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          VICTORY!
        </h2>
        <p className="text-xs text-slate-300 mb-6">
          You survived all five high-security maze sectors and defeated the master gauntlet!
        </p>

        {/* Rank & Stars */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Runner Rank</span>
            <span className={`text-3xl font-black ${rank.color}`}>{rank.grade}</span>
            <span className="text-[11px] text-slate-300 font-medium">{rank.title}</span>
          </div>

          <div className="h-10 w-[1px] bg-slate-800" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Stars Earned</span>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
              <span className="text-2xl font-black text-white">{totalStars}/15</span>
            </div>
          </div>
        </div>

        {/* Total Score */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 text-xs font-mono-nums flex items-center justify-between">
          <span className="text-slate-300 font-bold">Total Campaign Score:</span>
          <span className="font-black text-amber-400 text-lg">{totalScore.toLocaleString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onStartEndless();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>PLAY ENDLESS RANDOM MAZE</span>
          </button>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => {
                sound.playClick();
                onPlayAgain();
              }}
              className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Campaign</span>
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
