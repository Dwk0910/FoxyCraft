import Header from '../component/Header.jsx';

import { useState } from 'react';

export default function Settings() {
    const backend = localStorage.getItem('backend');
    const [open, setOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [msg, setMsg] = useState('');

    const handleClick = () => {
        if (open) {
            setSocket(null);
            setOpen(false);
            setMsg('');
            socket.close();
        } else {
            const _socket = new WebSocket(`ws://localhost:${backend}/testsocket`);
            _socket.onopen = () => {
                setSocket(_socket);
                setOpen(true);
                console.log('Connection opened');
            };
            _socket.onmessage = (event) => {
                setMsg(event.data);
            };
        }
    };

    return (
        <div>
            <Header>Test Page</Header>
            <input
                type="button"
                value={!open ? 'Start Connection' : 'Close Connection'}
                className={'p-3 border-1 border-white rounded-[5px]'}
                onClick={handleClick}
            />
            <div className={'whitespace-pre-wrap'}>{msg}</div>
        </div>
    );
}
