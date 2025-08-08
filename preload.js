
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    sendPortNumber: (port) => ipcRenderer.send('portnumber', port),
    selectFoler: (defaultFolder) => ipcRenderer.invoke('selectfolder', defaultFolder),
    isEmpty: (path) => ipcRenderer.invoke('isempty', path),
    getHomeFolder: () => ipcRenderer.invoke('gethomefoler')
});
