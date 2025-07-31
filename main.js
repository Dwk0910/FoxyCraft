const { app, BrowserWindow } = require("electron");
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
     mainWindow = new BrowserWindow({
        width: 1280,
        height: 1000,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.setMenu(null);
    mainWindow.setResizable(false);

    const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'build/index.html')}`;
    mainWindow.loadURL(url).then();

    if (isDev) mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") app.quit();
})

app.on('activate', () => {
    if (mainWindow === null) createWindow();
})
