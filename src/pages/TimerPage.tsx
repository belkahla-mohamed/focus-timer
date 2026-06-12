import { ControlBar } from '@/components/ControlBar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { TimerCircle } from '@/components/TimerCircle';
import { useTimer } from '@/hooks/useTimer';

export function TimerPage() {
  const timer = useTimer();

  return (
    <main className="drag-region flex h-screen w-screen flex-col items-center justify-between bg-[#111315] px-5 py-5">
      <header className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        <span>Focus Timer</span>
        <span>{timer.config.workDuration}/{timer.config.breakDuration}</span>
      </header>

      <TimerCircle phase={timer.phase} remainingSeconds={timer.remainingSeconds} totalSeconds={timer.totalSeconds} />

      <section className="flex w-full flex-col gap-3">
        {timer.phase === 'idle' && <SettingsPanel config={timer.config} onChange={timer.updateConfig} />}
        <ControlBar
          phase={timer.phase}
          onStart={timer.start}
          onPause={timer.pause}
          onResume={timer.resume}
          onEnd={timer.end}
        />
      </section>
    </main>
  );
}
