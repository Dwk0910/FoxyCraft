
import $ from 'jquery';

import { useState, useEffect, createContext } from 'react';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { LuServer } from "react-icons/lu";
import { FiPlus, FiSettings } from "react-icons/fi";

import Main from './page/Main';
import ServerList from './page/ServerList';
import AddServer from "./page/AddServer";
import Settings from './page/Settings';

export default function App() {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ loadingStatus, setLoadingStatus ] = useState(null);
    const [ currentMenu, setCurrentMenu ] = useState(<Main/>);
    const [ isAnimating, setIsAnimating ] = useState(false);
    const [ opacity, setOpacity ] = useState(1);

    const changeMenu = (element) => {
        setOpacity(0);
        setTimeout(() => {
            setCurrentMenu(element);
            setIsAnimating(false);
            setOpacity(1);
        }, 150);
    }

    // 백엔드 서버 찾기
    useEffect(() => {
        const findPort = () => {
            localStorage.removeItem("backend");
            for (let port = 3001; port <= 3010; port++) {
                const url = `http://localhost:${port}/health`;
                console.log(`포트 확인 중...${port}`);
                $.ajax({
                    url: url,
                    type: "POST",
                    timeout: 1200,
                }).done(res => {
                    if (res === "OK") {
                        console.log(`포트를 찾았습니다 : ${port}`)
                        localStorage.setItem("backend", port.toString());
                        setIsLoading(false);
                    }
                }).fail(() => {
                });
            }
        }
        // 모든 포트 실패: 3초 후 두 번 재시도
        findPort();
        new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
            if (localStorage.getItem("backend") !== null) return;
            setLoadingStatus("서버 찾기에 실패하였습니다. 3초 후 재시도합니다...");
            new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
                setLoadingStatus(null);
                findPort();
                new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
                    setLoadingStatus("서버 찾기에 실패하였습니다. 3초 후 재시도합니다...");
                    new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
                        setLoadingStatus(null)
                        findPort();
                        new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
                            setLoadingStatus("서버 찾기에 실패하였습니다.");
                        });
                    });
                }); // 서버 응답 대기
            });
        }); // 서버 응답 대기
    }, []);

    if (!isLoading) {
        return (
            <MenuContext.Provider value={{ changeMenu }}>
                <div className="flex flex-row min-h-screen">
                    <div className={"group/sidebar flex fixed flex-col transition-[width] ease-in-out bg-gray-700 border-r-2 border-gray-600 min-h-full items-start overflow-hidden pt-2 z-1 " + ((isAnimating) ? "w-60" : "duration-300 w-20 hover:w-60")}>
                        <header className={"flex flex-col items-center cursor-pointer border-white w-full mt-2"}
                                onClick={() => changeMenu(<Main/>)}>
                    <span className={"flex flex-row w-full items-center"}>
                        <img src="/assets/images/icon.png" className="h-12 ml-[15px]" alt="logo"/>
                        <span className={"text-3xl text-gray-300 ml-3 font-suite opacity-0 group-hover/sidebar:opacity-100 duration-300 ease-in-out"}>FoxyCraft</span>
                    </span>
                        </header>
                        <nav className={"group/nav hover:bg-gray-600 transition-colors flex flex-row mt-10 w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer " + ((currentMenu.type.name === "Main") ? "bg-gray-600" : "")}
                             onClick={() => changeMenu(<Main/>)}>
                            <span className={"text-[1.7rem] ml-[26px]"}><MdOutlineSpaceDashboard/></span>
                            <span className={"transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100"}>대시보드</span>
                        </nav>
                        <span className={"w-full h-[1px] border-gray-600 border-t-2 mt-10 pt-2.5 pl-10 text-nowrap"}>
                    <span className={"font-SeoulNamsanM duration-300 text-gray-400 opacity-0 group-hover/sidebar:opacity-100"}>서버관리</span>
                </span>
                        <nav className={"group/nav hover:bg-gray-600 transition-colors flex flex-row mt-8 w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer " + ((currentMenu.type.name === "ServerList") ? "bg-gray-600" : "")}
                             onClick={() => changeMenu(<ServerList/>)}>
                            <span className={"text-[1.7rem] ml-[26px]"}><LuServer/></span>
                            <span className={"transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100"}>서버 목록</span>
                        </nav>
                        <nav className={"group/nav hover:bg-gray-600 transition-colors flex flex-row w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer " + ((currentMenu.type.name === "AddServer") ? "bg-gray-600" : "")}
                             onClick={() => changeMenu(<AddServer/>)}>
                            <span className={"text-[1.7rem] ml-[26px]"}><FiPlus/></span>
                            <span className={"transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100"}>서버 추가</span>
                        </nav>
                        <span className={"w-full h-[1px] border-gray-600 border-t-2 mt-10 pt-2.5 pl-10 text-nowrap"}>
                    <span className={"font-SeoulNamsanM duration-300 text-gray-400 opacity-0 group-hover/sidebar:opacity-100"}>기타</span>
                </span>
                        <nav className={"group/nav hover:bg-gray-600 transition-colors mt-8 flex flex-row w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer " + ((currentMenu.type.name === "Settings") ? "bg-gray-600" : "")}
                             onClick={() => changeMenu(<Settings/>)}>
                            <span className={"text-[1.7rem] ml-[26px]"}><FiSettings/></span>
                            <span className={"transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100"}>설정</span>
                        </nav>
                    </div>
                    <div className={"pl-21 min-w-screen min-h-screen transition-opacity duration-150 z-0 " + ((isAnimating) ? "opacity-0" : "opacity-100")} style={{ opacity }}>
                        {currentMenu}
                    </div>
                </div>
            </MenuContext.Provider>
        );
    } else {
        // 로딩 창 출력

        const scaleAnimation = `
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
        `;

        return (
            <div className={"flex flex-col h-screen justify-center items-center"}>
                <style>{scaleAnimation}</style>
                <img src={"/assets/images/icon.png"} className={"transition-all h-30"} style={{ animation: 'scaleAnimation infinite 3s ease-in-out' }} alt={"logo"}/>
                <span className={"text-gray-400 font-suite text-[1.2rem]"}>{(loadingStatus) ? loadingStatus : ""}</span>
            </div>
        );
    }
}

export const MenuContext = createContext(null);
