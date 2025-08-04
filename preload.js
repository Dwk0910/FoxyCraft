const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
   sendPortNumber: (port) => ipcRenderer.send('portnumber', port)
});