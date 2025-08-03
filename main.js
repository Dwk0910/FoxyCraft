const { app, dialog, BrowserWindow } = require('electron');
const { spawn, exec } = require('child_process');
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

// run new backend process
let javaProcess = undefined;
app.on('ready', () => {
    const jarPath = path.join(__dirname, 'backend', 'FoxCraft.jar');
    let javaExecutable = "";

    if (app.isPackaged) {
        if (process.platform === "win32" && process.arch === "x64") javaExecutable = path.join(process.resourcesPath, "jar_win_64", "bin", "java.exe");
        else if (process.platform === "darwin") javaExecutable = path.join(process.resourcesPath, "jar_mac", "Contents", "Home", "bin", "java");
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

        console.log(`Starting Springboot App with ${javaExecutable}`);
        javaProcess = spawn(javaExecutable, ["-jar", jarPath]);
    } else {
        // 개발 모드에서는 gradlew run 사용

        // mac에서는 gradlew
        if (process.platform === "darwin") {
            javaProcess = spawn(path.join(__dirname, "backend", "gradlew"), ["bootRun"], { cwd: path.join(__dirname, "backend")});
        }
        // win에서는 gradlew.bat (새 창에 실행하여 로그 볼 수 있도록 하기)
        else if (process.platform === "win32") {
            exec("cmd /c start cmd.exe /c \"cd backend && .\\gradlew.bat bootRun\"");
        }
    }

    // console에 springboot app log출력 (mac)
    javaProcess?.stdout.setEncoding('utf8');
    javaProcess?.stdout.on('data', (data) => console.log(`${data}`)).setEncoding('utf8');
    javaProcess?.stderr.on('data', (data) => console.log(`${data}`)).setEncoding('utf8');
    javaProcess?.on('error', (err) => console.log(`${err}`));
    javaProcess?.on('close', (code) => {
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

        console.log(`JavaProcess exited with code ${code}`);
    });

    setTimeout(() => {
        createWindow();
    }, 5000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    if (javaProcess) {
        console.log("Terminating Java Process...");
        javaProcess.kill();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
