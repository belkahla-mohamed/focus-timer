import type { TimerPhase } from '@/types';

interface TimerCircleProps {
  phase: TimerPhase;
  remainingSeconds: number;
  totalSeconds: number;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

const phaseLabels: Record<TimerPhase, string> = {
  idle: 'Ready',
  work: 'Focus',
  countdown: 'Break in',
  break: 'Break',
  paused: 'Paused'
};

export function TimerCircle({ phase, remainingSeconds, totalSeconds }: TimerCircleProps) {
  const radius = 108;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative grid place-items-center">
      <svg className="-rotate-90" width="260" height="260" viewBox="0 0 260 260" aria-hidden="true">
        <circle cx="130" cy="130" r={radius} stroke="#2b2f31" strokeWidth="16" fill="transparent" />
        <circle
          cx="130"
          cy="130"
          r={radius}
          stroke={phase === 'break' ? '#64d2a3' : phase === 'countdown' ? '#f7c948' : '#8bd3dd'}
          strokeWidth="16"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{phaseLabels[phase]}</p>
          <p className="mt-2 text-5xl font-semibold tabular-nums text-zinc-50">
            {phase === 'countdown' ? remainingSeconds : formatTime(remainingSeconds)}
          </p>
        </div>
      </div>
    </div>
  );
}
