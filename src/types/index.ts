export type TimerPhase = 'idle' | 'work' | 'countdown' | 'break' | 'paused';

export type ActiveTimerPhase = Exclude<TimerPhase, 'idle' | 'paused'>;

export interface TimerConfig {
  workDuration: number;
  breakDuration: number;
}

export interface BreakActivity {
  id: string;
  title: string;
  description: string;
  minBreakDuration: number;
}

export interface PersistedConfig {
  timerConfig: TimerConfig;
}

export interface TimerSnapshot {
  phase: TimerPhase;
  previousPhase: ActiveTimerPhase | null;
  remainingSeconds: number;
  totalSeconds: number;
  config: TimerConfig;
}

export type SoundName = 'countdown' | 'work-start' | 'break-start' | 'break-end';

export interface FocusTimerApi {
  getConfig: () => Promise<TimerConfig>;
  saveConfig: (config: TimerConfig) => Promise<TimerConfig>;
  getSnapshot: () => Promise<TimerSnapshot>;
  setPhase: (snapshot: TimerSnapshot) => Promise<void>;
  onConfigUpdated: (callback: (config: TimerConfig) => void) => () => void;
  onTimerSnapshot: (callback: (snapshot: TimerSnapshot) => void) => () => void;
}

declare global {
  interface Window {
    focusTimer: FocusTimerApi;
  }
}
