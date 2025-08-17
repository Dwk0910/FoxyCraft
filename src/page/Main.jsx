
import icon from '../assets/images/icon.png';

import { useContext } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { menuContext } from "../App";

import AddServer from "./AddServer";

export default function Main() {
    const { changeMenu } = useContext(menuContext);
    return (
        <div className={"flex min-h-screen flex-col p-5"}>
            <div className={"flex flex-col justify-center items-center flex-grow"}>
                <img src={icon} alt={"bigicon"} className={"h-50"}/>
                <span className={"h-5 text-2xl font-bold font-SeoulNamsanB"}>안녕하세요!</span>
                <span className={"text-[1rem] mt-3 font-suite text-gray-300"}>
                    나만의 마인크래프트 서버를 손쉽게 열고, 강력히 관리해보세요.
                </span>
                <div className={"flex flex-row mt-5"}>
                    <span className={"flex flex-row items-center transition-colors duration-150 ease-in-out bg-white hover:bg-gray-200 border-1 border-gray-400 text-gray-700 font-SeoulNamsanM text-[0.9rem] p-2 rounded-[5px] cursor-pointer"}><IoDocumentTextOutline className={"mb-1 mr-1"}/>튜토리얼 보기</span>
                    <span className={"flex flex-row items-center transition-colors duration-150 ease-in-out bg-orange-400 hover:bg-orange-500 text-white font-SeoulNamsanM text-[0.9rem] p-2 rounded-[5px] ml-3 cursor-pointer"} onClick={() => changeMenu(<AddServer/>)}><FiPlus className={"mb-1 mr-1"}/>서버 생성하기</span>
                </div>
            </div>
        </div>
    );
}