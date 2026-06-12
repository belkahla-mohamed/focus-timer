import { TimerCircle } from '@/components/TimerCircle';
import { useBreakActivity } from '@/hooks/useBreakActivity';
import { useTimerSnapshot } from '@/hooks/useTimerSnapshot';

export function BreakPage() {
  const timer = useTimerSnapshot();
  const activity = useBreakActivity(timer.config.breakDuration);

  return (
    <main className="grid h-screen w-screen place-items-center bg-[#101412] px-10 text-center">
      <section className="mx-auto grid max-w-3xl place-items-center gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">Break time</p>
          <h1 className="mt-4 text-5xl font-semibold text-zinc-50">{activity.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-xl leading-8 text-zinc-300">{activity.description}</p>
        </div>
        <TimerCircle phase={timer.phase} remainingSeconds={timer.remainingSeconds} totalSeconds={timer.totalSeconds} />
      </section>
    </main>
  );
}
