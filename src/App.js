import Loading from './component/Loading';

import { useState, useEffect } from 'react';
import $ from 'jquery';

export default function App() {
    const [backendPort, setBackendPort] = useState(0);

    useEffect(() => {
        let currentPort = 3001;
        let backendFound = false;
        const checkPort = () => {
            if (currentPort > 3010 || backendFound) {
                if (!backendFound) setBackendPort(-1);
                return;
            }

            $.ajax({
                url: `http://localhost:${currentPort}/health`,
                timeout: 700,
                type: "POST",
            }).done((response) => {
                if (response === "OK") {
                    localStorage.setItem("backend_port", currentPort.toString());
                    backendFound = true;
                } else {
                    currentPort++;
                    checkPort();
                }
            }).fail(() => {
                currentPort++;
                checkPort();
            });
        };

        checkPort();
    }, []);

    const port = localStorage.getItem("backend_port");

    if (port === "0") return <Loading/>;
    else if (backendPort === -1) {
        return (
            <h1>서버를 찾을 수 없습니다.</h1>
        )
    }

    return (
        <h1>로딩 완료. 백엔드 포트 : {port}</h1>
    );
}