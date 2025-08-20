
import $ from 'jquery';
import clsx from 'clsx';

// component & pages
import { ConfigProvider, Popover, theme } from "antd";
import { motion } from 'framer-motion';

import AddServer from "./AddServer";

// menu components
import Console from "./form/ServerList/Console";
import Player from './form/ServerList/Player';
import Plugin from './form/ServerList/Plugin';
import Mods from './form/ServerList/Mods';
import Backup from './form/ServerList/Backup';
import Settings from './form/ServerList/Settings';

// icons
import { TbFolderPlus, TbTriangleFilled, TbSquareFilled } from "react-icons/tb";
import { IoFilterOutline, IoSettings, IoPeople } from "react-icons/io5";
import { FiPlus, FiCpu } from 'react-icons/fi';
import { FaFloppyDisk } from "react-icons/fa6";
import { RiRamLine } from "react-icons/ri";
import { LuServer } from 'react-icons/lu';
import { FaCircle } from "react-icons/fa";

// store & native
import { menuContext } from '../App';
import { useState, useEffect, useContext } from 'react';
import { useAtom } from 'jotai';
import { currentServerAtom, serverMapAtom, serverStatusMapAtom } from '../jotai/serverListAtom';

export default function ServerList() {
    // global
    const backendport = localStorage.getItem('backend');
    const [ loading, setLoading ] = useState(true);

    const { menu, changeMenu } = useContext(menuContext);

    // set component visiblity
    const [opacity, setOpacity] = useState(1);
    const [component, setComponent] = useState(null);
    const [componentOpacity, setComponentOpacity] = useState(1);

    // atom for each servers
    const [ currentServer, setCurrentServer ] = useAtom(currentServerAtom);
    const [ serverMap, setServerMap ] = useAtom(serverMapAtom);
    const [ serverStatusMap, setServerStatusMap ] = useAtom(serverStatusMapAtom);

    // loading methods
    // serverList
    async function loadServerList() {
        // 서버 리스트 불러오기
        await $.ajax({
            url: `http://localhost:${backendport}/servercrud/get?type=serverlist`,
            contentType: 'application/json',
            type: 'POST',
            success: async resp => {
                await setServerMap(resp);
            },
            error: err => {
                console.error(err);
            }
        });
    }

    // server status
    async function loadServerStatus() {
        await $.ajax({
            url: `http://localhost:${backendport}/servercrud/get?type=status`,
            contentType: 'application/json',
            type: 'POST',
            success: resp => {
                setServerStatusMap(resp);
                setLoading(false);
            },
            error: err => {
                console.error(err);
            }
        });
    }

    // 초기로딩 or 새로고침
    useEffect(() => {
        async function run() {
            setLoading(true);

            // atom/state 초기화

            // TODO: Dev
            // setCurrentServer({ id: "" });
            // setServerMap({});
            // setServerStatusMap({});

            // 서버 리스트 불러오기
            await loadServerList();

            // 서버 상태 불러오기
            await loadServerStatus();
        }

        void run();
    }, [menu]);

    // Server Explorer에서 서버 변경시 호출
    useEffect(() => {
        // 기본 menu는 Console
        if (currentServer.id) setComponent(<Console serverUUID={currentServer.id}/>);
    }, [currentServer.id]);

    let array = [];
    for (const key in serverMap) {
        const item = serverMap[key];

        let clr = "";
        if (serverStatusMap[key] === "online") clr = "text-green-300";
        else if (serverStatusMap[key] === "offline") clr = "text-red-400";
        else if (serverStatusMap[key] === "pending") clr = "text-yellow-500";

        array.push(
            <div key={key} className={clsx("flex flex-row pl-0.5 items-center h-10 hover:bg-[#707070] cursor-pointer transition-colors duration-200", (currentServer.id && currentServer.id === key) && "bg-[#5E5E5E]")} onClick={() => changeServer(currentServer.id === key ? "" : key)}>
                <FaCircle className={"mt-0.5 ml-3 text-[0.7rem] " + clr}/>
                <span className={"ml-2 text-ellipsis overflow-hidden w-55"}>{item.name}</span>
            </div>
        );
    }

    // OnClick handlers

    // Handle server change
    const changeServer = async (serv) => {
        setOpacity(0);
        await new Promise(resolve => setTimeout(resolve, 80));
        setCurrentServer({ ...currentServer, id: serv });
        setOpacity(1);
    };

    // Handle server open request
    const openServer = async (serverID) => {
        if (serverStatusMap[serverID] === "offline") {
            await $.ajax({
                url: `http://localhost:${backendport}/server/start?targetID=${serverID}`,
                contentType: 'application/json',
                type: 'POST',
                success: async () => {
                    await loadServerStatus();
                }
            });
        }
    };

    // Content component
    const Content = () => {
        if (currentServer.id) {
            // title
            const status = serverStatusMap[currentServer.id];
            let statusTag;
            if (status === "online") {
                statusTag = (
                    <>
                        <FaCircle className={"text-[1rem] text-green-300"}/>
                        <span className={"font-suite ml-2"}>온라인</span>
                    </>
                );
            } else if (status === "pending") {
                statusTag = (
                    <>
                        <FaCircle className={"text-[1rem] text-yellow-500"}/>
                        <span className={"font-suite ml-2"}>시작 중</span>
                    </>
                );
            } else if (status === "offline") {
                statusTag = (
                    <>
                        <FaCircle className={"text-[1rem] text-red-400"}/>
                        <span className={"font-suite ml-2"}>오프라인</span>
                    </>
                );
            }

            /*
            currentServer : 렌더러 내에서 컴포넌트 렌더링을 위해 필요한 정보를 담고 있음. (현재 서버의 UUID와 선택된 메뉴의 이름)
            _currentServer : 백엔드로부터 가져온 서버 정보를 그대로 담고 있음
             */
            const changeComponent = async (target, targetComponent) => {
                await setComponentOpacity(0);
                setComponent(targetComponent);
                await new Promise(resolve => setTimeout(resolve, 80));
                setCurrentServer({...currentServer, menu: target});
                setComponentOpacity(1);
            };

            const _currentServer = serverMap[currentServer.id];
            return (
                <div className={"flex flex-col h-full p-6"}>
                    <div className={"flex flex-row items-center mb-[-5px]"}>{ statusTag }</div>
                    <div className={"flex flex-row"}>
                        <span className={"text-[1.4rem]"}>{ _currentServer.name }</span>
                    </div>

                    <div className={"flex flex-row mt-7 mb-5"}>
                        <div className={clsx(serverStatusMap[currentServer.id] === "offline" && "bg-green-600 cursor-pointer hover:bg-green-700 text-white ", "bg-[#474747] text-gray-400 flex justify-start items-center p-2 w-30 font-suite rounded-[5px] transition-all duration-200")} onClick={() => openServer(currentServer.id)}><TbTriangleFilled style={{ transform: "rotate(90deg)", marginLeft: "10px" }}/><span className={"ml-3"}>서버 시작</span></div>
                        <div className={clsx(serverStatusMap[currentServer.id] !== "offline" && "bg-red-400 cursor-pointer hover:bg-red-500", "text-white bg-[#474747] flex justify-center items-center p-2 w-10 font-suite rounded-[5px] ml-3 transition-all duration-200")}><TbSquareFilled/></div>
                        <div className={"bg-purple-400 text-white flex justify-center items-center p-2 w-10 font-suite rounded-[5px] ml-3 cursor-pointer transition-colors duration-200 hover:bg-purple-500"}><FaFloppyDisk/></div>
                        <div className={"bg-gray-500 text-white flex justify-center items-center p-2 w-10 font-suite rounded-[5px] ml-3 cursor-pointer transition-colors duration-200 hover:bg-gray-600"}><IoSettings/></div>
                        <div className={"flex justify-center items-center text-gray-400 ml-3"}>
                            <IoPeople className={"text-[1.2rem] mt-0.5 ml-3"}/>
                        </div>
                        <div className={"flex items-end pb-[7px]"}>
                            <span className={"ml-2 text-white font-suite"}>310</span>
                            <span className={"text-gray-300 ml-1 text-[0.8rem] font-suite"}>/50</span>
                        </div>
                        <div className={"flex justify-center items-center text-gray-400 ml-3"}>
                            <FiCpu className={"text-[1.2rem] mt-0.5 ml-3"}/>
                        </div>
                        <div className={"flex items-end pb-[7px]"}>
                            <span className={"ml-2 text-white font-suite"}>{"50"}%</span>
                        </div>
                        <div className={"flex justify-center items-center text-gray-400 ml-3"}>
                            <RiRamLine className={"text-[1.2rem] mt-0.5 ml-3"}/>
                        </div>
                        <div className={"flex items-end pb-[7px]"}>
                            <span className={"ml-2 text-white font-suite"}>{"770"}MB</span>
                        </div>
                    </div>

                    <div className={"flex flex-row ml-0.5 mt-3"}>
                        <span className={clsx(currentServer.menu === "console" ? "border-t-1 pt-[7px]" : "pt-[8px]", "border-cyan-500 hover:border-cyan-200 hover:border-t-1 hover:pt-[7px] transition-colors duration-300 flex justify-center w-12 mx-0.5 font-SeoulNamsanM cursor-pointer")} onClick={() => changeComponent('console', <Console serverUUID={currentServer.id}/>)}>로그</span>
                        <span className={clsx(currentServer.menu === "player" ? "border-t-1 pt-[7px]" : "pt-[8px]", "border-cyan-500 hover:border-cyan-200 hover:border-t-1 hover:pt-[7px] transition-colors duration-300 flex justify-center w-19 mx-0.5 font-SeoulNamsanM cursor-pointer")} onClick={() => changeComponent('player', <Player/>)}>플레이어</span>
                        <span className={clsx(currentServer.menu === "plugin" ? "border-t-1 pt-[7px]" : "pt-[8px]", "border-cyan-500 hover:border-cyan-200 hover:border-t-1 hover:pt-[7px] transition-colors duration-300 flex justify-center w-19 mx-0.5 font-SeoulNamsanM cursor-pointer")} onClick={() => changeComponent('plugin', <Plugin/>)}>플러그인</span>
                        <span className={clsx(currentServer.menu === "mods" ? "border-t-1 pt-[7px]" : "pt-[8px]", "border-cyan-500 hover:border-cyan-200 hover:border-t-1 hover:pt-[7px] transition-colors duration-300 flex justify-center w-12 mx-0.5 font-SeoulNamsanM cursor-pointer")} onClick={() => changeComponent('mods', <Mods/>)}>모드</span>
                        <span className={clsx(currentServer.menu === "backup" ? "border-t-1 pt-[7px]" : "pt-[8px]", "border-cyan-500 hover:border-cyan-200 hover:border-t-1 hover:pt-[7px] transition-colors duration-300 flex justify-center w-12 mx-0.5 font-SeoulNamsanM cursor-pointer")} onClick={() => changeComponent('backup', <Backup/>)}>백업</span>
                        <span className={clsx(currentServer.menu === "settings" ? "border-t-1 pt-[7px]" : "pt-[8px]", "border-cyan-500 hover:border-cyan-200 hover:border-t-1 hover:pt-[7px] transition-colors duration-300 flex justify-center w-12 mx-0.5 font-SeoulNamsanM cursor-pointer")} onClick={() => changeComponent('settings', <Settings/>)}>설정</span>
                    </div>

                    <motion.div className={"w-full h-full flex flex-col items-center mt-5"} initial={{ opacity: 0 }} animate={{ opacity: componentOpacity }} transition={{ duration: 0.08, ease: "easeInOut" }}>
                        { component }
                    </motion.div>
                </div>
            );
        } else {
            return (
                <div className={"w-full h-full flex flex-col justify-center items-center"}>
                    <LuServer className={"text-5xl text-gray-300"}/>
                    <span className={"font-suite text-gray-300 mt-5"}>왼쪽 메뉴에서 서버를 선택하여 관리해 보세요</span>
                </div>
            );
        }
    };

    return (
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <div className={"flex flex-row"}>
                {/*Server Explorer*/}
                <div className={"flex flex-col bg-[#474747] border-[#636363] border-r-1 w-85 h-screen"}>
                    <div className={"flex flex-row items-center w-full mb-3 mt-4"}>
                        <span className={"font-suite ml-7 grow"}>Server Explorer</span>
                    </div>
                    <div className={"flex flex-col w-full"}>
                        <div className={"w-full flex flex-row justify-center"}>
                            <input type={"text"} className={"bg-[#404040] grow ml-3 border-[#404040] text-[0.85rem] border-1 transition-all outline-none duration-200 rounded-[5px] p-2 hover:border-orange-400 focus:border-orange-500"} placeholder="서버 검색"/>
                            <span className={"flex justify-center items-center w-10 ml-2 mr-3 cursor-pointer transition-colors duration-200 rounded-[5px] hover:bg-gray-600"}><IoFilterOutline/></span>
                        </div>
                        <div className={"flex flex-row mt-3 mb-2 items-center w-full justify-start"}>
                            <span className={"grow font-suite text-gray-300 ml-3"}>Instances</span>
                            <Popover content={<span className={"font-suite"}>새로운 서버 추가</span>}>
                                <FiPlus className={"mt-1 mr-3 cursor-pointer hover:text-gray-300 transition-colors duration-200"} onClick={() => changeMenu(<AddServer/>)}/>
                            </Popover>
                            <Popover content={<span className={"font-suite"}>폴더 생성</span>}>
                                <TbFolderPlus className={"mt-1 mr-6 cursor-pointer hover:text-gray-300 transition-colors duration-200"}/>
                            </Popover>
                        </div>
                        { (!array || array?.length <= 0) && !loading ? (<div className={"text-center mt-30 text-gray-400 font-suite w-63.5"}>서버가 없습니다</div>) : array }
                        { loading ? (<div className="text-center mt-30 text-gray-400 font-suite w-63.5">로딩 중입니다...</div>) : ""}
                    </div>
                </div>

                {/*Main Content*/}
                <motion.div className={"w-full"} initial={{ opacity: 1 }} animate={{ opacity: opacity }} transition={{ duration: 0.08, ease: "easeInOut" }}>
                    <Content />
                </motion.div>
            </div>
        </ConfigProvider>
    );
};

