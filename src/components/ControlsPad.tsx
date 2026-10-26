import React, { useRef } from 'react';
import { Direction } from '../types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface ControlsPadProps {
  currentDirection: Direction;
  onDirectionChange: (dir: Direction) => void;
}

export const ControlsPad: React.FC<ControlsPadProps> = ({
  currentDirection,
  onDirectionChange,
}) => {
  const activeIntervalRef = useRef<number | null>(null);

  const startDirection = (dir: Direction) => {
    sound.playClick();
    if (navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
    onDirectionChange(dir);

    // Keep active
    if (activeIntervalRef.current) clearInterval(activeIntervalRef.current);
    activeIntervalRef.current = window.setInterval(() => {
      onDirectionChange(dir);
    }, 150);
  };

  const stopDirection = () => {
    if (activeIntervalRef.current) {
      clearInterval(activeIntervalRef.current);
      activeIntervalRef.current = null;
    }
  };

  const getButtonClass = (dir: Direction) => {
    const isActive = currentDirection === dir;
    return `w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl font-bold transition-all duration-100 select-none touch-none active:scale-95 ${
      isActive 
        ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-300' 
        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90 border border-slate-700/80 shadow-md'
    }`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-1 select-none py-2">
      {/* Up Button */}
      <button
        aria-label="Move Up"
        className={getButtonClass('UP')}
        onPointerDown={(e) => {
          e.preventDefault();
          startDirection('UP');
        }}
        onPointerUp={stopDirection}
        onPointerCancel={stopDirection}
        onPointerLeave={stopDirection}
      >
        <ArrowUp className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Left, Center Blank/Guide, Right */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Move Left"
          className={getButtonClass('LEFT')}
          onPointerDown={(e) => {
            e.preventDefault();
            startDirection('LEFT');
          }}
          onPointerUp={stopDirection}
          onPointerCancel={stopDirection}
          onPointerLeave={stopDirection}
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono-nums text-slate-500">
          DPAD
        </div>

        <button
          aria-label="Move Right"
          className={getButtonClass('RIGHT')}
          onPointerDown={(e) => {
            e.preventDefault();
            startDirection('RIGHT');
          }}
          onPointerUp={stopDirection}
          onPointerCancel={stopDirection}
          onPointerLeave={stopDirection}
        >
          <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Down Button */}
      <button
        aria-label="Move Down"
        className={getButtonClass('DOWN')}
        onPointerDown={(e) => {
          e.preventDefault();
          startDirection('DOWN');
        }}
        onPointerUp={stopDirection}
        onPointerCancel={stopDirection}
        onPointerLeave={stopDirection}
      >
        <ArrowDown className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
