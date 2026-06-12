import { BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import type { PersistedConfig, TimerConfig, TimerSnapshot } from '../src/types';

const DEFAULT_CONFIG: TimerConfig = {
  workDuration: 45,
  breakDuration: 5
};

type WindowController = {
  ensureBreakWindow: () => void;
  closeBreakWindow: () => void;
};

const store = new Store<PersistedConfig>({
  defaults: {
    timerConfig: DEFAULT_CONFIG
  }
});

const createIdleSnapshot = (config: TimerConfig): TimerSnapshot => ({
  phase: 'idle',
  previousPhase: null,
  remainingSeconds: config.workDuration * 60,
  totalSeconds: config.workDuration * 60,
  config
});

let latestSnapshot: TimerSnapshot = createIdleSnapshot(store.get('timerConfig'));

export const registerIpcHandlers = ({ ensureBreakWindow, closeBreakWindow }: WindowController) => {
  ipcMain.handle('config:get', () => store.get('timerConfig'));

  ipcMain.handle('config:save', (_event, config: TimerConfig) => {
    const normalizedConfig = {
      workDuration: Math.max(1, Math.round(config.workDuration)),
      breakDuration: Math.max(1, Math.round(config.breakDuration))
    };

    store.set('timerConfig', normalizedConfig);
    if (latestSnapshot.phase === 'idle') {
      latestSnapshot = createIdleSnapshot(normalizedConfig);
    }

    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('config:updated', normalizedConfig);
    });

    return normalizedConfig;
  });

  ipcMain.handle('timer:get-snapshot', () => latestSnapshot);

  ipcMain.handle('timer:set-phase', (_event, snapshot: TimerSnapshot) => {
    latestSnapshot = snapshot;

    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('timer:snapshot', snapshot);
    });

    if (snapshot.phase === 'break' || (snapshot.phase === 'paused' && snapshot.previousPhase === 'break')) {
      ensureBreakWindow();
      return;
    }

    closeBreakWindow();
  });
};
