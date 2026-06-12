import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';

export const useTimerSnapshot = () => {
  const phase = useTimerStore((state) => state.phase);
  const previousPhase = useTimerStore((state) => state.previousPhase);
  const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
  const totalSeconds = useTimerStore((state) => state.totalSeconds);
  const config = useTimerStore((state) => state.config);
  const hydrateConfig = useTimerStore((state) => state.hydrateConfig);
  const applySnapshot = useTimerStore((state) => state.applySnapshot);

  useEffect(() => {
    window.focusTimer.getConfig().then(hydrateConfig).catch(() => undefined);
    window.focusTimer.getSnapshot().then(applySnapshot).catch(() => undefined);
    return window.focusTimer.onTimerSnapshot(applySnapshot);
  }, [applySnapshot, hydrateConfig]);

  return {
    phase,
    previousPhase,
    remainingSeconds,
    totalSeconds,
    config
  };
};
