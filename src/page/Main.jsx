
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { LuServer } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";


export default function Main() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="flex flex-row min-h-screen">
            <div
                className="
                group/sidebar
                flex fixed flex-col transition-[width] duration-300 ease-in-out w-20 bg-gray-700 border-r-2 border-gray-600 min-h-full items-start overflow-hidden pt-2
                hover:w-60
                ">
                <header className={"flex flex-col items-center cursor-pointer border-white w-full mt-2"} onClick={() => navigate("/test")}>
                    <span className={"flex flex-row w-full items-center"}>
                        <img src="/assets/images/icon.png" className="h-14 ml-[11.5px]" alt="logo"/>
                        <span className={"text-3xl text-gray-300 ml-3 font-suite opacity-0 group-hover/sidebar:opacity-100 duration-300 ease-in-out"}>FoxyCraft</span>
                    </span>
                </header>
                <nav className={"group/nav hover:bg-gray-600 transition-colors flex flex-row mt-10 w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer " + ((location.pathname === "/") ? "bg-gray-600" : "")}>
                    <span className={"text-[1.7rem] ml-[26px]"}><MdOutlineSpaceDashboard/></span>
                    <span className={"transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100"}>대시보드</span>
                </nav>
                <span className={"w-full h-[1px] border-gray-600 border-t-2 mt-10 pt-2.5 pl-10 text-nowrap"}>
                    <span className={"font-SeoulNamsanM duration-300 text-gray-400 opacity-0 group-hover/sidebar:opacity-100"}>서버관리</span>
                </span>
                <nav className={"group/nav hover:bg-gray-600 transition-colors flex flex-row mt-8 w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer " + ((location.pathname === "/manageserver") ? "bg-gray-600" : "")}>
                    <span className={"text-[1.7rem] ml-[26px]"}><LuServer/></span>
                    <span className={"transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100"}>서버 목록</span>
                </nav>
                <nav className={"group/nav hover:bg-gray-600 transition-colors flex flex-row w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer " + ((location.pathname === "/manageserver") ? "bg-gray-600" : "")}>
                    <span className={"text-[1.7rem] ml-[26px]"}><FiPlus/></span>
                    <span className={"transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100"}>서버 추가</span>
                </nav>
                <span className={"w-full h-[1px] border-gray-600 border-t-2 mt-10 pt-2.5 pl-10 text-nowrap"}>
                    <span className={"font-SeoulNamsanM duration-300 text-gray-400 opacity-0 group-hover/sidebar:opacity-100"}>기타</span>
                </span>
                <nav className={"group/nav hover:bg-gray-600 transition-colors mt-8 flex flex-row w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer " + ((location.pathname === "/manageserver") ? "bg-gray-600" : "")}>
                    <span className={"text-[1.7rem] ml-[26px]"}><FiSettings/></span>
                    <span className={"transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-6.5 w-full opacity-0 group-hover/sidebar:opacity-100"}>설정</span>
                </nav>
            </div>
            <div className={"ml-21"}>
                Section:MAIN
            </div>
        </div>
    );
}