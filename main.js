const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, globalShortcut } = require('electron');
const path = require('path');

let win;
let tray;

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 200,
    frame: false,
    transparent: false,
    resizable: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icon.ico'),
    title: '下班倒數',
    backgroundColor: '#ffffff',
  });

  win.loadFile('index.html');

  win.on('closed', () => { win = null; });
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('F12', () => {
    if (win) win.webContents.openDevTools({ mode: 'detach' });
  });

  // System tray
  const img = nativeImage.createFromPath(path.join(__dirname, 'icon.ico'));
  tray = new Tray(img.isEmpty() ? nativeImage.createEmpty() : img);
  const menu = Menu.buildFromTemplate([
    { label: '顯示', click: () => { if (win) { win.show(); win.focus(); } else createWindow(); } },
    { label: '置頂', type: 'checkbox', checked: false, click: (item) => { if (win) win.setAlwaysOnTop(item.checked); } },
    { type: 'separator' },
    { label: '開啟 DevTools', click: () => { if (win) win.webContents.openDevTools({ mode: 'detach' }); } },
    { type: 'separator' },
    { label: '關閉', click: () => app.quit() },
  ]);
  tray.setToolTip('下班倒數');
  tray.setContextMenu(menu);
  tray.on('double-click', () => { if (win) { win.show(); win.focus(); } else createWindow(); });
});

ipcMain.on('minimize', () => { if (win) win.minimize(); });
ipcMain.on('close',    () => { if (win) win.close(); });
ipcMain.on('pin',      (_, pinned) => { if (win) win.setAlwaysOnTop(pinned); });

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('window-all-closed', () => {
  // Keep alive in tray on Windows
  if (process.platform !== 'darwin') return;
  app.quit();
});

app.on('activate', () => { if (!win) createWindow(); });
