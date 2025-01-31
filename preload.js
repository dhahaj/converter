const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    closeWindow: () => ipcRenderer.send('close-window'),
    setAlwaysOnTop: (value) => ipcRenderer.send('set-always-on-top', value),
    getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),
});
