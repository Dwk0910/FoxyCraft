// main.js
// Electron 앱의 메인 프로세스 파일
// Node.js 환경에서 실행되므로 'require' 문법을 사용해야 해.

const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev'); // 개발 모드 확인 모듈 (npm install electron-is-dev 했는지 확인!)

let mainWindow; // 메인 창 객체를 저장할 변수

// 메인 창을 생성하는 함수
function createWindow() {
    try {
        // 새 브라우저 창 생성 설정
        mainWindow = new BrowserWindow({
            width: 1280, // 창의 너비
            height: 960, // 창의 높이
            webPreferences: {
                nodeIntegration: true, // 렌더러 프로세스에서 Node.js API 사용 허용 (보안에 주의!)
                contextIsolation: false, // 컨텍스트 분리 비활성화 (개발 편의상, 배포 시 true 권장)
                // preload: path.join(__dirname, 'preload.js') // 필요하다면 preload 스크립트 추가
            },
        });

        mainWindow.setMenu(null);
        mainWindow.resizable = false;

        // React 앱을 로드할 URL 결정
        const urlToLoad = isDev
            ? 'http://localhost:3000' // 개발 모드일 때는 React 개발 서버 주소
            : `file://${path.join(__dirname, 'build/index.html')}`; // 배포 모드일 때는 빌드된 React 앱 파일 경로

        // 결정된 URL을 Electron 창에 로드
        mainWindow.loadURL(urlToLoad)
            .then(() => {})
            .catch(err => {
                // URL 로드 중 에러 발생 시 처리
                console.error('ERROR: 7-1. URL 로드 실패:', err); // URL 로드 실패 에러 로그
            });

        // // 개발 모드일 때만 개발자 도구 열기
        // if (isDev) {
        //     mainWindow.webContents.openDevTools();
        // }

        // 창이 닫혔을 때 이벤트 처리
        mainWindow.on('closed', () => {
            mainWindow = null; // 창 참조 제거 (메모리 누수 방지)
        });

    } catch (error) {
        // createWindow 함수 내부에서 예외 발생 시 처리
        console.error('CRITICAL ERROR: 4-1. createWindow 함수 실행 중 에러 발생:', error);
        app.quit(); // 심각한 에러이므로 앱 종료
    }
}

// Electron 앱이 준비되면 (초기화 완료) createWindow 함수 호출
// 이 이벤트가 Electron 앱의 시작점이야!
app.on('ready', () => {
    createWindow(); // 메인 창 생성 함수 호출
});

// 모든 창이 닫혔을 때 앱 종료 (macOS는 예외)
// macOS는 앱의 모든 창을 닫아도 앱이 백그라운드에서 계속 실행되는 것이 일반적이야.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // 현재 OS가 macOS가 아니면
        app.quit(); // 앱 종료
    }
});

// 앱이 활성화될 때 (예: 독 아이콘 클릭) 창이 없으면 새로 생성
app.on('activate', () => {
    if (mainWindow === null) { // 메인 창이 없으면
        createWindow(); // 새로 생성
    }
});

// 앱이 종료되기 직전 이벤트
app.on('before-quit', () => {
});

// 앱이 완전히 종료될 때 이벤트
app.on('quit', () => {
});
