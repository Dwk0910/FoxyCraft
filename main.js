
// default import
const path = require('path');
const os = require('os');
const fs = require('fs');

// electron import
const log = require('electron-log');
const { app, dialog, ipcMain, BrowserWindow } = require('electron');

// other
const { spawn, exec } = require('child_process');
const axios = require('axios');
const crypto = require('crypto');

// clear log file
const logFilePath = log.transports.file.getFile().path;

if (fs.existsSync(logFilePath)) {
    try {
        fs.unlinkSync(logFilePath);
        log.info("Log file cleared successfully.");
    } catch (err) {
        log.error("Error while clearing log file : " + err);
    }
}

let window;
function createWindow() {
    window = new BrowserWindow({
        width: 1260,
        height: 960,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    window.setResizable(false);
    window.setMenu(null);

    if (app.isPackaged) {
        window.loadFile(path.join(__dirname, 'dist', 'index.html')).then();
    } else {
        // 개발 모드
        window.loadURL('http://localhost:5173').then();
        window.webContents.openDevTools();
    }
}

// 올바른 백엔드 서버인지 확인하기 위해 temp폴더에 랜덤값을 적어놓은 파일 저장
const tempFolder = path.join(os.tmpdir(), 'foxycraft');
const tokenFile = path.join(tempFolder, 'token.tk');
// temp 폴더 없으면 새로 생성
if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);
// 토큰 파일 생성 (이미 있으면 Override)
let token = crypto.randomBytes(32).toString('base64url');
fs.writeFileSync(tokenFile, token);

// 렌더러에서 포트 번호 받기
let backendPort = 8080;
let isBackendReady = false;

ipcMain.on('portnumber', (event, port) => {
    backendPort = port;
    isBackendReady = true;
});

// 폴더가 비어있는지 확인 (렌더러용)
ipcMain.handle('isempty', async (event, path) => {
    try {
        if (path) {
            const files = fs.readdirSync(path);
            return files.length === 0;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
});

// 폴더 선택 시스템
ipcMain.handle('selectfolder', async (event, defaultFolder) => {
    const result = await dialog.showOpenDialog(window, {
        properties: ['openDirectory'],
        defaultPath: defaultFolder
    });

    try {
        const files = fs.readdirSync(result.filePaths[0]);
        if (result.canceled) return { isErr: false, content: null };
        else if (files.length !== 0) return { isErr: true, content: "비어있는 폴더를 선택해주세요" };
        else return { isErr: false, content: result.filePaths[0] };
    } catch (err) {
        return { isErr: false, content: null }
    }
});

// 렌더러로 사용자 홈 폴더 넘기기 (Addserver Step 2에서 사용)
ipcMain.handle('gethomefoler', () => {
    return os.homedir();
});

// 렌더러에서 읽을 수 있는 이미지로 변환해서 넘기기
ipcMain.handle('getimage', (event, path) => {
    try {
        const imageData = fs.readFileSync(path);
        const base64_encoded = imageData.toString('base64');
        return `data:image/png;base64,${base64_encoded}`;
    } catch (ignored) {
        return null;
    }
});

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
