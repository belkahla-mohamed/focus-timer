import { contextBridge, ipcRenderer } from 'electron';
import type { FocusTimerApi, TimerConfig, TimerSnapshot } from '../src/types';

const api: FocusTimerApi = {
  getConfig: () => ipcRenderer.invoke('config:get'),
  saveConfig: (config: TimerConfig) => ipcRenderer.invoke('config:save', config),
  getSnapshot: () => ipcRenderer.invoke('timer:get-snapshot'),
  setPhase: (snapshot: TimerSnapshot) => ipcRenderer.invoke('timer:set-phase', snapshot),
  onConfigUpdated: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, config: TimerConfig) => callback(config);

    ipcRenderer.on('config:updated', listener);
    return () => ipcRenderer.removeListener('config:updated', listener);
  },
  onTimerSnapshot: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, snapshot: TimerSnapshot) => callback(snapshot);

    ipcRenderer.on('timer:snapshot', listener);
    return () => ipcRenderer.removeListener('timer:snapshot', listener);
  }
};

contextBridge.exposeInMainWorld('focusTimer', api);
