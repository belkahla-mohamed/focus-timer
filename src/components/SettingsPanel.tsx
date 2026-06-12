import type { TimerConfig } from '@/types';

interface SettingsPanelProps {
  config: TimerConfig;
  onChange: (config: TimerConfig) => void;
}

const clampDuration = (value: string) => {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return 1;
  }

  return Math.min(180, Math.max(1, Math.round(parsed)));
};

export function SettingsPanel({ config, onChange }: SettingsPanelProps) {
  return (
    <div className="no-drag grid w-full grid-cols-2 gap-3 rounded-md border border-zinc-800 bg-zinc-950/70 p-3">
      <label className="grid gap-1 text-xs font-medium text-zinc-400">
        Work
        <input
          type="number"
          min={1}
          max={180}
          value={config.workDuration}
          onChange={(event) => onChange({ ...config, workDuration: clampDuration(event.target.value) })}
          className="h-10 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm font-semibold text-zinc-50 outline-none transition focus:border-cyan-300"
        />
      </label>
      <label className="grid gap-1 text-xs font-medium text-zinc-400">
        Break
        <input
          type="number"
          min={1}
          max={180}
          value={config.breakDuration}
          onChange={(event) => onChange({ ...config, breakDuration: clampDuration(event.target.value) })}
          className="h-10 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm font-semibold text-zinc-50 outline-none transition focus:border-emerald-300"
        />
      </label>
    </div>
  );
}
