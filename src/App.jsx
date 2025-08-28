import axios from 'axios';

import { useState, useEffect, createContext, Suspense } from 'react';

import Loading from './component/Loading';

// icons
import icon from './assets/images/icon.png';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { LuServer } from 'react-icons/lu';
import { FiPlus, FiSettings } from 'react-icons/fi';

// pages
import Main from './page/Main';
import ServerList from './page/ServerList';
import AddServer from './page/AddServer';
import Settings from './page/Settings';

// store
import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { serverAtom } from './jotai/serverAtom';

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState(null);
    const [currentMenu, setCurrentMenu] = useState(<Main />);
    const [isAnimating, setIsAnimating] = useState(false);
    const [opacity, setOpacity] = useState(1);

    const [server, setServer] = useAtom(serverAtom);

    const serverAtom_reset = useResetAtom(serverAtom);

    const changeMenu = (element) => {
        setOpacity(0);

        // atom reset
        void setServer({
            ...server,
            custom: false,
        });

        void serverAtom_reset();

        setTimeout(() => {
            setCurrentMenu(element);
            setIsAnimating(false);
            setOpacity(1);
        }, 150);
    };

    useEffect(() => {
        const run = async () => {
            localStorage.removeItem('backend');

            const token = await window.api.getToken();
            let port = await window.api.getPort();

            let i = 0;
            while (port === 'err') {
                if (i >= 20) {
                    break;
                }

                port = await window.api.getPort();
                await new Promise((resolve) => setTimeout(resolve, 1000));
                i++;
            }

            i = 0;
            while (port === 'err') {
                port = await window.api.getPort();

                if (i >= 10) break;
                try {
                    // 이중검사
                    const response = await axios.post(`http://localhost:${port}/health`, {}, { timeout: 1200 });
                    if (response.status !== 200 || response.data !== token) {
                        port = 'err';
                    }
                } catch (ignored) {
                    port = 'err';
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));
                i++;
            }

            // 서버찾기 실패
            if (port === 'err')
                setLoadingStatus(
                    <>
                        서버를 찾을 수 없습니다. 다시 실행해 주세요.
                        <br />
                        (문제가 반복되면 제보해 주세요.)
                    </>,
                );
            else {
                localStorage.setItem('backend', port);
                setIsLoading(false);
            }
        };

        void run();
    }, []);

    if (!isLoading) {
        return (
            <menuContext.Provider value={{ menu: currentMenu, changeMenu }}>
                <div className="flex flex-row min-h-screen">
                    <div
                        className={
                            'group/sidebar flex fixed flex-col transition-[width, shadow] ease-in-out bg-gray-700 border-r-2 border-gray-600 min-h-full items-start overflow-hidden pt-2 z-1 shadow-amber-50 sidebar ' +
                            (isAnimating ? 'w-60' : 'duration-300 w-20 hover:w-60')
                        }>
                        <header
                            className={'flex flex-col items-center cursor-pointer border-white w-full mt-2'}
                            onClick={() => changeMenu(<Main />)}>
                            <span className={'flex flex-row w-full items-center'}>
                                <img src={icon} className="h-12 ml-[15px]" alt="logo" />
                                <span
                                    className={
                                        'text-3xl text-gray-300 ml-3 font-suite opacity-0 group-hover/sidebar:opacity-100 duration-300 ease-in-out'
                                    }>
                                    FoxyCraft
                                </span>
                            </span>
                        </header>
                        <nav
                            className={
                                'group/nav hover:bg-gray-600 transition-colors flex flex-row mt-10 w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer ' +
                                (currentMenu.type.name === 'Main' ? 'bg-gray-600' : '')
                            }
                            onClick={() => changeMenu(<Main />)}>
                            <span className={'text-[1.7rem] ml-[26px]'}>
                                <MdOutlineSpaceDashboard />
                            </span>
                            <span
                                className={
                                    'transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100'
                                }>
                                대시보드
                            </span>
                        </nav>
                        <span className={'w-full h-[1px] border-gray-600 border-t-2 mt-10 pt-2.5 pl-10 text-nowrap'}>
                            <span
                                className={
                                    'font-SeoulNamsanM duration-300 text-gray-400 opacity-0 group-hover/sidebar:opacity-100'
                                }>
                                서버관리
                            </span>
                        </span>
                        <nav
                            className={
                                'group/nav hover:bg-gray-600 transition-colors flex flex-row mt-8 w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer ' +
                                (currentMenu.type.name === 'ServerList' ? 'bg-gray-600' : '')
                            }
                            onClick={() => changeMenu(<ServerList />)}>
                            <span className={'text-[1.7rem] ml-[26px]'}>
                                <LuServer />
                            </span>
                            <span
                                className={
                                    'transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100'
                                }>
                                서버 목록
                            </span>
                        </nav>
                        <nav
                            className={
                                'group/nav hover:bg-gray-600 transition-colors flex flex-row w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer ' +
                                (currentMenu.type.name === 'AddServer' ? 'bg-gray-600' : '')
                            }
                            onClick={() => changeMenu(<AddServer />)}>
                            <span className={'text-[1.7rem] ml-[26px]'}>
                                <FiPlus />
                            </span>
                            <span
                                className={
                                    'transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100'
                                }>
                                서버 추가
                            </span>
                        </nav>
                        <span className={'w-full h-[1px] border-gray-600 border-t-2 mt-10 pt-2.5 pl-10 text-nowrap'}>
                            <span
                                className={
                                    'font-SeoulNamsanM duration-300 text-gray-400 opacity-0 group-hover/sidebar:opacity-100'
                                }>
                                기타
                            </span>
                        </span>
                        <nav
                            className={
                                'group/nav hover:bg-gray-600 transition-colors mt-8 flex flex-row w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer ' +
                                (currentMenu.type.name === 'Settings' ? 'bg-gray-600' : '')
                            }
                            onClick={() => changeMenu(<Settings />)}>
                            <span className={'text-[1.7rem] ml-[26px]'}>
                                <FiSettings />
                            </span>
                            <span
                                className={
                                    'transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100'
                                }>
                                설정
                            </span>
                        </nav>
                    </div>
                    <div
                        className={
                            'pl-20 w-full min-h-screen transition-opacity duration-150 z-0 ' +
                            (isAnimating ? 'opacity-0' : 'opacity-100')
                        }
                        style={{ opacity }}>
                        <Suspense fallback={<Loading />}>{currentMenu}</Suspense>
                    </div>
                </div>
            </menuContext.Provider>
        );
    } else {
        // 로딩 창 출력
        return (
            <div className={'flex flex-col h-screen justify-center items-center'}>
                <style>{`
                    @keyframes scaleAnimation {
                        0% { 
                            transform: scale(1);
                        }
                        
                        50% {
                            transform: scale(1.1);
                        }
                        
                        100% {
                            transform: scale(1);
                        }
                    }
                `}</style>
                <img
                    src={icon}
                    className={'transition-all h-30'}
                    style={{
                        animation: 'scaleAnimation infinite 3s ease-in-out',
                    }}
                    alt={'logo'}
                />
                <span className={'text-gray-400 font-suite text-[1.2rem] text-center'}>
                    {loadingStatus ? loadingStatus : ''}
                </span>
            </div>
        );
    }
}

export const menuContext = createContext(null);
