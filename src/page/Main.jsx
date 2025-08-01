
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";

export default function Main() {
    const navigate = useNavigate();
    const location = useLocation();

    console.log(location.pathname);

    return (
        <div className="flex flex-row min-h-screen">
            <div
                className="
                group/sidebar
                flex fixed flex-col transition-[width] duration-300 ease-in-out w-20 bg-gray-700 border-r-2 border-gray-600 min-h-full items-start overflow-hidden pt-2
                hover:w-60
                ">
                <header className={"flex flex-col items-center cursor-pointer border-white w-full"} onClick={() => navigate("/test")}>
                    <span className={"flex flex-row w-full items-center"}>
                        <img src="/assets/images/icon.png" className="h-14 ml-[11.5px]" alt="logo"/>
                        <span className={"text-3xl text-gray-300 ml-3 font-suite opacity-0 group-hover/sidebar:opacity-100 duration-300 ease-in-out"}>FoxyCraft</span>
                    </span>
                </header>
                <nav className={"group/nav hover:bg-gray-600 transition-colors flex flex-row mt-10 w-full min-h-14 items-center overflow-hidden text-nowrap cursor-pointer " + ((location.pathname === "/") ? "bg-gray-600" : "")}>
                    <span className={"text-[1.7rem] ml-[26px]"}><MdOutlineSpaceDashboard/></span>
                    <span className={"transition-opacity font-SeoulNamsanB size-[1.5rem] mt-[3px] ml-4 w-full opacity-0 group-hover/sidebar:opacity-100"}>대시보드</span>
                </nav>
            </div>
            <div className={"ml-21"}>
                Section:MAIN
            </div>
        </div>
    );
}