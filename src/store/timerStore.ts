import { create } from 'zustand';
import type { ActiveTimerPhase, TimerConfig, TimerPhase, TimerSnapshot } from '@/types';

const DEFAULT_CONFIG: TimerConfig = {
  workDuration: 45,
  breakDuration: 5
};

interface TimerState {
  phase: TimerPhase;
  previousPhase: ActiveTimerPhase | null;
  remainingSeconds: number;
  totalSeconds: number;
  config: TimerConfig;
  hydrateConfig: (config: TimerConfig) => void;
  applySnapshot: (snapshot: TimerSnapshot) => void;
  updateConfig: (config: Partial<TimerConfig>) => void;
  startWork: () => void;
  startCountdown: () => void;
  startBreak: () => void;
  pause: () => void;
  resume: () => void;
  end: () => void;
  tick: () => void;
  snapshot: () => TimerSnapshot;
}

const minutesToSeconds = (minutes: number) => Math.max(1, Math.round(minutes * 60));

export const useTimerStore = create<TimerState>((set, get) => ({
  phase: 'idle',
  previousPhase: null,
  remainingSeconds: minutesToSeconds(DEFAULT_CONFIG.workDuration),
  totalSeconds: minutesToSeconds(DEFAULT_CONFIG.workDuration),
  config: DEFAULT_CONFIG,
  hydrateConfig: (config) => {
    const normalized = {
      workDuration: Math.max(1, config.workDuration),
      breakDuration: Math.max(1, config.breakDuration)
    };

    set((state) => ({
      config: normalized,
      remainingSeconds: state.phase === 'idle' ? minutesToSeconds(normalized.workDuration) : state.remainingSeconds,
      totalSeconds: state.phase === 'idle' ? minutesToSeconds(normalized.workDuration) : state.totalSeconds
    }));
  },
  applySnapshot: (snapshot) => {
    set({
      phase: snapshot.phase,
      previousPhase: snapshot.previousPhase,
      remainingSeconds: snapshot.remainingSeconds,
      totalSeconds: snapshot.totalSeconds,
      config: snapshot.config
    });
  },
  updateConfig: (partialConfig) => {
    const { phase, config } = get();

    if (phase !== 'idle') {
      return;
    }

    const nextConfig = {
      ...config,
      ...partialConfig
    };

    const normalized = {
      workDuration: Math.max(1, nextConfig.workDuration),
      breakDuration: Math.max(1, nextConfig.breakDuration)
    };

    set({
      config: normalized,
      remainingSeconds: minutesToSeconds(normalized.workDuration),
      totalSeconds: minutesToSeconds(normalized.workDuration)
    });
  },
  startWork: () => {
    const seconds = minutesToSeconds(get().config.workDuration);

    set({
      phase: 'work',
      previousPhase: null,
      remainingSeconds: seconds,
      totalSeconds: seconds
    });
  },
  startCountdown: () => {
    set({
      phase: 'countdown',
      previousPhase: null,
      remainingSeconds: 3,
      totalSeconds: 3
    });
  },
  startBreak: () => {
    const seconds = minutesToSeconds(get().config.breakDuration);

    set({
      phase: 'break',
      previousPhase: null,
      remainingSeconds: seconds,
      totalSeconds: seconds
    });
  },
  pause: () => {
    const { phase } = get();

    if (phase !== 'work' && phase !== 'break') {
      return;
    }

    set({
      phase: 'paused',
      previousPhase: phase
    });
  },
  resume: () => {
    const { previousPhase } = get();

    if (!previousPhase) {
      return;
    }

    set({
      phase: previousPhase,
      previousPhase: null
    });
  },
  end: () => {
    const seconds = minutesToSeconds(get().config.workDuration);

    set({
      phase: 'idle',
      previousPhase: null,
      remainingSeconds: seconds,
      totalSeconds: seconds
    });
  },
  tick: () => {
    const { phase, remainingSeconds } = get();

    if (phase !== 'work' && phase !== 'countdown' && phase !== 'break') {
      return;
    }

    set({
      remainingSeconds: Math.max(0, remainingSeconds - 1)
    });
  },
  snapshot: () => {
    const { phase, previousPhase, remainingSeconds, totalSeconds, config } = get();

    return {
      phase,
      previousPhase,
      remainingSeconds,
      totalSeconds,
      config
    };
  }
}));
