export default function App() {
    let currentPort = 3001;

    function tryNextPort() {
        fetch(`http://localhost:${currentPort}/helth`, { method: 'POST' })
            .then(res => {
                if (res.ok) {
                    // 성공했으면 여기서 처리하고 종료
                    console.log('Found backend at port:', currentPort);
                } else {
                    throw new Error('Not OK');
                }
            })
            .catch(() => {
                currentPort++;
                if (currentPort <= 3100) {
                    tryNextPort(); // 다음 포트 시도
                } else {
                    console.error('No backend port found');
                }
            });
    }

    tryNextPort();
}