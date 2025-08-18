
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

// 렌더러에서 로깅하는거 받고 파일에 기록하기
ipcMain.on("log", (event, { level, msg }) => {
    log[level](msg);
});

// window 생성
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
fs.writeFileSync(tokenFile, "");

// 백엔드 포트 구하기
// 하나는 가지고 하나는 렌더러로 넘기기
// 백엔드에서 자신의 포트를 적는 시간을 벌기 위해 ipc 채널로 따로 생성
let backendPort = 0;
ipcMain.handle('getport', async () => {
    try {
        const str = fs.readFileSync(tokenFile, 'utf8').toString();
        if (!str) return "err";

        backendPort = parseInt(str.split(".")[0]);
        if (isNaN(backendPort)) return 'err';
        return backendPort;
    } catch (ignored) {
        return 'err';
    }
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
    } catch (ignored) {
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
    } catch (ignored) {
        return { isErr: false, content: null };
    }
});

// 렌더러로 사용자 홈 폴더 넘기기 (Addserver Step 2에서 사용)
ipcMain.handle('gethomefoler', () => {
    return os.homedir();
});

// 렌더러로 토큰 넘기기
ipcMain.handle('gettoken', () => {
    return fs.readFileSync(path.join(os.tmpdir(), "foxycraft", "token.tk")).toString();
});

// run new backend process
let javaProcess = undefined;
app.on('ready', () => {
    const jarPath = path.join(process.resourcesPath, 'FoxyCraft.jar');
    const dataFolderPath = path.join(app.getPath("appData"), "foxycraft", "data");
    if (!fs.existsSync(dataFolderPath)) fs.mkdirSync(dataFolderPath);
    const datapath_argument = `-DAPP_DATA_PATH=${dataFolderPath} -DAPP_RESOURCES_PATH=${process.resourcesPath}`;
    const datapath_argument_dev = `-PdataPath="${dataFolderPath}" -PresourcesPath="${process.resourcesPath}"`;

    let javaExecutable = "";

    if (app.isPackaged) {
        if (process.platform === "win32" && process.arch === "x64") javaExecutable = path.join(process.resourcesPath, "jre_win_64", "bin", "java.exe");
        else if (process.platform === "darwin") javaExecutable = path.join(process.resourcesPath, "jre_mac", "Contents", "Home", "bin", "java");
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
        javaProcess = spawn(javaExecutable, [datapath_argument, "-jar", jarPath]);
    } else {
        // 개발 모드에서는 gradlew run 사용

        // mac에서는 gradlew
        if (process.platform === "darwin") {
            javaProcess = spawn(path.join(__dirname, "backend", "gradlew"), ["bootRun", datapath_argument_dev], { cwd: path.join(__dirname, "backend")});
        } else if (process.platform === "win32") {
            // win에서는 gradlew.bat (외부실행)
            exec(`cmd /c start cmd.exe /c "cd backend && .\\gradlew.bat bootRun ${datapath_argument_dev} & exit"`);
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

    createWindow();
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

            // remove token file
            fs.rmSync(tokenFile);
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
