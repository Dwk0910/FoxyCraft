const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const window = new BrowserWindow({
        width: 1280,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // window.setResizable(false);
    window.setMenu(null);

    if (app.isPackaged) {
        window.loadFile(path.join(__dirname, 'dist', 'index.html')).then();
    } else {
        // 개발 모드
        window.loadURL('http://localhost:5173').then();
        window.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
