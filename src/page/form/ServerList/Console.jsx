import { FaArrowUp } from "react-icons/fa6";

export default function Console({ serverUUID }) {
    if (!serverUUID) throw new Error("The argument 'serverUUID' cannot be null or empty.\nA valid server UUID is required.");
    return (
        <>
            <div className={"bg-[#2A2A2A] select-text font-mono w-full h-full p-3 mb-2 rounded-[5px] border-2 border-gray-600"}>
                Console log
            </div>
            <div className={"w-full flex flex-row items-center"}>
                <input type={"text"} className={"bg-[#2A2A2A] mb-3 w-full px-3 h-10 border-2 border-gray-600 rounded-[5px] font-mono"} placeholder={"Command Prompt Here"}/>
                <div className={"mb-3 ml-3 p-2 bg-[#2A2A2A] border-gray-600 border-2 rounded-[5px] transition-colors duration-200 cursor-pointer hover:bg-gray-700"}>
                    <FaArrowUp className={"w-5 h-5"}/>
                </div>
            </div>
        </>
    );
}