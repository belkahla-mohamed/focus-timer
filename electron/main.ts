import { join } from 'node:path';
import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers } from './ipc-handlers';

const isDev = !app.isPackaged;
let mainWindow: BrowserWindow | null = null;
let breakWindow: BrowserWindow | null = null;

const rendererUrl = process.env.ELECTRON_RENDERER_URL;

const loadRenderer = async (window: BrowserWindow, view?: 'break') => {
  const query = view ? `?view=${view}` : '';

  if (isDev && rendererUrl) {
    await window.loadURL(`${rendererUrl}${query}`);
    return;
  }

  await window.loadFile(join(__dirname, '../renderer/index.html'), {
    query: view ? { view } : undefined
  });
};

const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 420,
    minWidth: 320,
    maxWidth: 320,
    minHeight: 420,
    maxHeight: 420,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    title: 'Focus Timer',
    backgroundColor: '#111315',
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  await loadRenderer(mainWindow);
};

const createBreakWindow = async () => {
  if (breakWindow) {
    return;
  }

  breakWindow = new BrowserWindow({
    kiosk: true,
    frame: false,
    fullscreen: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    title: 'Focus Timer Break',
    backgroundColor: '#101412',
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  breakWindow.setAlwaysOnTop(true, 'screen-saver');
  breakWindow.on('closed', () => {
    breakWindow = null;
  });

  await loadRenderer(breakWindow, 'break');
};

const closeBreakWindow = () => {
  if (!breakWindow) {
    return;
  }

  const windowToClose = breakWindow;
  breakWindow = null;
  windowToClose.setKiosk(false);
  windowToClose.close();
};

app.whenReady().then(async () => {
  registerIpcHandlers({
    ensureBreakWindow: () => {
      void createBreakWindow();
    },
    closeBreakWindow
  });

  await createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
