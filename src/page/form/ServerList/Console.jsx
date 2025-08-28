import { FaArrowUp } from 'react-icons/fa6';

// store & native
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { logAtom } from '../../../jotai/serverListAtom';

export default function Console({ socket, serverUUID }) {
    const [log, setLog] = useAtom(logAtom);

    if (!serverUUID || !socket)
        throw new Error(
            "The argument 'serverUUID' or 'socket' cannot be null or empty.\nA valid server UUID and Socket are required.",
        );

    useEffect(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: 'ping', timestamp: Date.now() }));
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.page && data.page === 'Console') {
                setLog({ ...log, [serverUUID]: [...log[serverUUID], data.content] });
            }
        };
    });

    return (
        <>
            <div
                className={
                    'bg-[#2A2A2A] select-text font-mono w-full h-130 p-3 mb-2 rounded-[5px] border-2 border-gray-600 overflow-y-auto wrap-break-word'
                }>
                {log[serverUUID]}
            </div>
            <div className={'w-full flex flex-row items-center'}>
                <input
                    type={'text'}
                    className={
                        'bg-[#2A2A2A] mb-3 w-full px-3 h-10 border-2 border-gray-600 rounded-[5px] font-mono outline-none'
                    }
                    placeholder={'Command Prompt Here'}
                />
                <div
                    className={
                        'mb-3 ml-3 p-2 bg-[#2A2A2A] border-gray-600 border-2 rounded-[5px] transition-colors duration-200 cursor-pointer hover:bg-gray-700'
                    }>
                    <FaArrowUp className={'w-5 h-5'} />
                </div>
            </div>
        </>
    );
}

