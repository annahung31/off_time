const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('minimize'),
  close:    () => ipcRenderer.send('close'),
  pin:      (pinned) => ipcRenderer.send('pin', pinned),
});
