import { useCallback, useEffect, useRef } from 'react';
import { playSound } from '@/lib/sounds';
import { useTimerStore } from '@/store/timerStore';
import type { TimerConfig } from '@/types';

export const useTimer = () => {
  const phase = useTimerStore((state) => state.phase);
  const previousPhase = useTimerStore((state) => state.previousPhase);
  const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
  const totalSeconds = useTimerStore((state) => state.totalSeconds);
  const config = useTimerStore((state) => state.config);
  const hydrateConfig = useTimerStore((state) => state.hydrateConfig);
  const updateConfig = useTimerStore((state) => state.updateConfig);
  const startWork = useTimerStore((state) => state.startWork);
  const startCountdown = useTimerStore((state) => state.startCountdown);
  const startBreak = useTimerStore((state) => state.startBreak);
  const pause = useTimerStore((state) => state.pause);
  const resume = useTimerStore((state) => state.resume);
  const end = useTimerStore((state) => state.end);
  const tick = useTimerStore((state) => state.tick);
  const snapshot = useTimerStore((state) => state.snapshot);
  const lastPhase = useRef(phase);

  useEffect(() => {
    window.focusTimer.getConfig().then(hydrateConfig).catch(() => undefined);
    return window.focusTimer.onConfigUpdated(hydrateConfig);
  }, [hydrateConfig]);

  useEffect(() => {
    window.focusTimer.setPhase(snapshot()).catch(() => undefined);
  }, [phase, previousPhase, remainingSeconds, totalSeconds, config, snapshot]);

  useEffect(() => {
    if (phase === 'work' || phase === 'countdown' || phase === 'break') {
      const interval = window.setInterval(tick, 1000);

      return () => window.clearInterval(interval);
    }

    return undefined;
  }, [phase, tick]);

  useEffect(() => {
    if (lastPhase.current !== phase) {
      if (phase === 'work') {
        playSound('work-start');
      }

      if (phase === 'break') {
        playSound('break-start');
      }

      if (lastPhase.current === 'break' && phase === 'work') {
        playSound('break-end');
      }
    }

    lastPhase.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase === 'countdown' && remainingSeconds > 0 && remainingSeconds <= 3) {
      playSound('countdown');
    }
  }, [phase, remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds > 0) {
      return;
    }

    if (phase === 'work') {
      startCountdown();
    }

    if (phase === 'countdown') {
      startBreak();
    }

    if (phase === 'break') {
      startWork();
    }
  }, [phase, remainingSeconds, startBreak, startCountdown, startWork]);

  const saveConfig = useCallback(
    async (nextConfig: TimerConfig) => {
      updateConfig(nextConfig);
      await window.focusTimer.saveConfig(nextConfig);
    },
    [updateConfig]
  );

  return {
    phase,
    previousPhase,
    remainingSeconds,
    totalSeconds,
    config,
    start: startWork,
    pause,
    resume,
    end,
    updateConfig: saveConfig
  };
};
