
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getPort: () => ipcRenderer.invoke('getport'),
    selectFoler: (defaultFolder) => ipcRenderer.invoke('selectfolder', defaultFolder),
    isEmpty: (path) => ipcRenderer.invoke('isempty', path),
    getHomeFolder: () => ipcRenderer.invoke('gethomefoler'),
    getToken: () => ipcRenderer.invoke('gettoken'),
});
