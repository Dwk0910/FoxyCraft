
import $ from 'jquery';
import clsx from 'clsx';

// component & pages
import { ConfigProvider, Popover, theme, Input } from "antd";
import Loading from '../component/Loading';

import AddServer from "./AddServer";

// icons
import { FaCircle } from "react-icons/fa";
import { TbFolderPlus } from "react-icons/tb";
import { FiPlus } from 'react-icons/fi';
import { IoFilterOutline } from "react-icons/io5";

// store & native
import { menuContext } from '../App';
import { useState, useEffect, useContext } from 'react';
import { useAtom } from 'jotai';
import { currentServerAtom } from '../jotai/serverListAtom';

export default function ServerList() {
    // global
    const backendport = localStorage.getItem('backend');
    const [ serverMap, setServerMap ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ currentServer, setCurrentServer ] = useAtom(currentServerAtom);

    const { menu, changeMenu } = useContext(menuContext);

    // 초기로딩 or 새로고침
    useEffect(() => {
        setLoading(true);

        // atom 초기화
        setCurrentServer("");

        // 서버 리스트 불러오기
        $.ajax({
            url: `http://localhost:${backendport}/servercrud/get`,
            contentType: 'application/json',
            type: 'POST',
            success: resp => {
                setServerMap(resp);
                setLoading(false);
            },
            error: err => {
                console.error(err);
            }
        });
    }, [menu]);

    // 로딩중이면 원초적으로 렌더링 안되게 막아야함
    if (loading) return <Loading loadingState={loading} />

    // const Content = () => {
    //     if (currentServer) {
    //         return (
    //             <span className={"font-suite"}>{ serverMap[currentServer].name }</span>
    //         );
    //     } else {
    //     }
    // };


    let array = [];
    for (const key in serverMap) {
        const item = serverMap[key];
        array.push(
            <div key={key} className={clsx("flex flex-row items-center h-10 hover:bg-[#707070] cursor-pointer transition-colors duration-200", (currentServer && currentServer === key) && "bg-[#5E5E5E]")} onClick={() => setCurrentServer(() => key)}>
                <FaCircle className={"mt-0.5 ml-3 text-[0.7rem]"}/>
                <span className={"ml-2 text-ellipsis overflow-hidden w-55"}>{item.name}</span>
            </div>
        );
    }

    return (
        <ConfigProvider theme={{
            algorithm: theme.darkAlgorithm
        }}>
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
                    { array }
                </div>
            </div>
        </ConfigProvider>
    );
};
