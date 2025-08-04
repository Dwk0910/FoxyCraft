
const { app, dialog, ipcMain, BrowserWindow } = require('electron');
const { spawn, exec } = require('child_process');

const axios = require('axios');
const log = require('electron-log');
const path = require('path');
const fs = require('fs');

// clear log file
const logFilePath = log.transports.file.getFile().path;

// 렌더러에서 포트 번호 받기
let backendPort = 8080;
let isBackendReady = false;

ipcMain.on('portnumber', (event, port) => {
    backendPort = port;
    isBackendReady = true;
});

if (fs.existsSync(logFilePath)) {
    try {
        fs.unlinkSync(logFilePath);
        log.info("Log file cleared successfully.");
    } catch (err) {
        log.error("Error while clearing log file : " + err);
    }
}

function createWindow() {
    const window = new BrowserWindow({
        width: 1280,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
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

// run new backend process
let javaProcess = undefined;
app.on('ready', () => {
    const jarPath = path.join(process.resourcesPath, 'FoxyCraft.jar');
    let javaExecutable = "";
    if (app.isPackaged) {
        if (process.platform === "win32" && process.arch === "x64") javaExecutable = path.join(process.resourcesPath, "jre_win_64", "bin", "java.exe");
        else if (process.platform === "darwin") javaExecutable = path.join(process.resourcesPath, "jre_mac", "jre", "Contents", "Home", "bin", "java");
        else {
            // 지원하지 않는 OS/Architecture
            dialog.showMessageBoxSync({
                type: "error",
                title: "지원하지 않는 환경",
                message: "죄송합니다. 이 환경에서는 실행이 불가능합니다.",
                buttons: ["확인"]
            });
            app.quit();
            return;
        }

        log.info(`Starting Springboot App with ${javaExecutable}`);
        javaProcess = spawn(javaExecutable, ["-jar", jarPath]);
    } else {
        // 개발 모드에서는 gradlew run 사용

        // mac에서는 gradlew
        if (process.platform === "darwin") {
            javaProcess = spawn(path.join(__dirname, "backend", "gradlew"), ["bootRun"], { cwd: path.join(__dirname, "backend")});
        }
        // win에서는 gradlew.bat (외부실행)
        else if (process.platform === "win32") {
            exec("cmd /c start cmd.exe /c \"cd backend && .\\gradlew.bat bootRun & exit\"");
        }
    }

    // console에 springboot app log출력
    javaProcess?.stdout.setEncoding('utf8');
    javaProcess?.stdout.on('data', (data) => log.info(`${data}`)).setEncoding('utf8');
    javaProcess?.stderr.on('data', (data) => log.error(`${data}`)).setEncoding('utf8');
    javaProcess?.on('error', (err) => log.error(`${err}`));
    javaProcess?.on('close', (code) => {
        if (app.isPackaged) {
            if (code !== 0) {
                dialog.showMessageBoxSync({
                    type: "error",
                    title: "실행 중 오류 발생",
                    message: `앱 실행 중 오류가 발생했습니다. 앱 개발자에게 문의해 주십시오. Exit code : ${code}`,
                    buttons: ["확인"]
                });
                app.quit();
                return;
            }
        }

        log.info(`JavaProcess exited with code ${code}`);
    });

    setTimeout(() => {
        createWindow();
    }, 5000);
});

async function shutdown() {
    try {
        return await axios.post(`http://localhost:${backendPort}/actuator/shutdown`, {}, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(resp => {
            console.log(resp.data);
            if (process.platform !== "win32") javaProcess.kill();
        }).catch(err => console.log(err));
    } catch (err) {
        console.log(err);
    } finally {
        if (javaProcess) javaProcess.kill();
    }
}

let isQuitting = false; // 딱 한 번만 호출 가능하도록 설정
app.on('before-quit', (event) => {
    if (isQuitting) return;
    event.preventDefault();
    log.info("Terminating Java Process...");
    shutdown().then(() => {
        isQuitting = true;
        app.quit();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
