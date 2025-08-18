
const { contextBridge, ipcRenderer } = require('electron');

["log", "warn", "error", "info"].forEach(fn => {
    const orig = console[fn].bind(console);
    console[fn] = (...args) => {
        ipcRenderer.send("log", { level: fn, msg: args.map(a => String(a)).join(" ")});
        orig(...args);
    };
});

contextBridge.exposeInMainWorld('api', {
    getPort: () => ipcRenderer.invoke('getport'),
    selectFoler: (defaultFolder) => ipcRenderer.invoke('selectfolder', defaultFolder),
    isEmpty: (path) => ipcRenderer.invoke('isempty', path),
    getHomeFolder: () => ipcRenderer.invoke('gethomefoler'),
    getToken: () => ipcRenderer.invoke('gettoken'),
});
