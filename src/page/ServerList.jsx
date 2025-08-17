
import $ from 'jquery';
import clsx from 'clsx';

// component & pages
import { ConfigProvider, Popover, theme } from "antd";
import { motion } from 'framer-motion';
import Loading from '../component/Loading';

import AddServer from "./AddServer";

// icons
import { FaCircle } from "react-icons/fa";
import { TbFolderPlus } from "react-icons/tb";
import { FiPlus } from 'react-icons/fi';
import { IoFilterOutline } from "react-icons/io5";
import { LuServer } from 'react-icons/lu';

// store & native
import { menuContext } from '../App';
import { useState, useEffect, useContext } from 'react';
import { useAtom } from 'jotai';
import { currentServerAtom } from '../jotai/serverListAtom';

export default function ServerList() {
    // global
    const backendport = localStorage.getItem('backend');
    const [ serverMap, setServerMap ] = useState({});
    const [ serverStatusMap, setServerStatusMap ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ currentServerID, setCurrentServerID ] = useAtom(currentServerAtom);

    const { menu, changeMenu } = useContext(menuContext);

    // set component visiblity
    const [opacity, setOpacity] = useState(1);

    // 초기로딩 or 새로고침
    useEffect(() => {
        async function run() {
            setLoading(true);

            // atom 초기화
            setCurrentServerID("");

            // 서버 리스트 불러오기
            await $.ajax({
                url: `http://localhost:${backendport}/servercrud/get?type=serverlist`,
                contentType: 'application/json',
                type: 'POST',
                success: resp => {
                    setServerMap(resp);
                },
                error: err => {
                    console.error(err);
                }
            });

            // 서버 상태 불러오기
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

        void run();
    }, [menu]);

    // 로딩중이면 원초적으로 렌더링 안되게 막아야함
    if (loading) return <Loading loadingState={loading} />;

    let array = [];
    for (const key in serverMap) {
        const item = serverMap[key];

        let clr = "";
        if (serverStatusMap[key] === "online") clr = "text-green-300";
        else if (serverStatusMap[key] === "offline") clr = "text-red-400";
        else if (serverStatusMap[key] === "pending") clr = "text-orange-500";

        array.push(
            <div key={key} className={clsx("flex flex-row pl-0.5 items-center h-10 hover:bg-[#707070] cursor-pointer transition-colors duration-200", (currentServerID && currentServerID === key) && "bg-[#5E5E5E]")} onClick={() => changeServer(currentServerID ? "" : key)}>
                <FaCircle className={"mt-0.5 ml-3 text-[0.7rem] " + clr}/>
                <span className={"ml-2 text-ellipsis overflow-hidden w-55"}>{item.name}</span>
            </div>
        );
    }

    // Handle server change
    const changeServer = async (serv) => {
        setOpacity(0);
        setTimeout(() => {
            setCurrentServerID(() => (serv));
            setOpacity(1);
        }, 80);
    };

    // Content component
    const Content = () => {
        if (currentServerID) {
            const currentServer = serverMap[currentServerID];
            return (
                <span>{ currentServer.name }</span>
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
                <div className={"flex flex-col bg-[#474747] border-[#636363] border-r-1 w-70 h-screen"}>
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
                        { array.length === 0 ? (<span className={"text-center mt-30 text-gray-400 font-suite"}>서버가 없습니다</span>) : array }
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
