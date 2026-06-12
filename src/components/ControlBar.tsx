import type { TimerPhase } from '@/types';

interface ControlBarProps {
  phase: TimerPhase;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
}

export function ControlBar({ phase, onStart, onPause, onResume, onEnd }: ControlBarProps) {
  return (
    <div className="no-drag flex w-full items-center justify-center gap-2">
      {phase === 'idle' && (
        <button
          type="button"
          onClick={onStart}
          className="h-11 min-w-28 rounded-md bg-zinc-50 px-5 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-white"
        >
          Start
        </button>
      )}

      {(phase === 'work' || phase === 'break') && (
        <button
          type="button"
          onClick={onPause}
          className="h-11 min-w-28 rounded-md bg-zinc-50 px-5 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-white"
        >
          Pause
        </button>
      )}

      {phase === 'paused' && (
        <button
          type="button"
          onClick={onResume}
          className="h-11 min-w-28 rounded-md bg-zinc-50 px-5 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-white"
        >
          Resume
        </button>
      )}

      {phase !== 'idle' && (
        <button
          type="button"
          onClick={onEnd}
          className="h-11 min-w-24 rounded-md border border-zinc-700 bg-zinc-900 px-4 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
        >
          End
        </button>
      )}
    </div>
  );
}
