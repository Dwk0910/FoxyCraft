
import $ from "jquery";

import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import { Steps } from 'antd';

// icons
import { FiPlus } from "react-icons/fi";
import { GoRepoTemplate } from "react-icons/go";
import { IoSaveOutline, IoCheckmark } from "react-icons/io5";
import { TbWorldUpload } from "react-icons/tb";
import { BsClipboardPlus } from "react-icons/bs";

export default function AddServer() {
    const backendport = localStorage.getItem("backend");

    const [currentStep, setCurrentStep] = useState(0);

    // Steps에 쓸 style class
    const title = "text-white font-suite text-xl";
    const description = "text-gray-400 font-suite text-nowrap";

    return (
        <div>
            <ToastContainer
                position={"top-center"}
                autoClose={3000}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                theme={"dark"}
            />
            <div className={"flex flex-row items-center border-orange-400 border-b-2 mt-10 ml-5 mr-10 pb-3 pl-5"}>
                <FiPlus className={"text-3xl"}/>
                <span className={"ml-5 text-2xl mt-1.5 font-SeoulNamsanB"}>서버 추가</span>
            </div>
            <div className={"ml-10 mt-10"}>
                <Steps direction={"vertical"} items={[
                    {
                        title: <span className={title}>서버 템플릿</span>,
                        description: <span className={description}>서버 구동기를 설정합니다.</span>,
                        icon: <GoRepoTemplate className={"ml-[3px] "} />
                    },
                    {
                        title: <span className={title}>저장 위치 설정</span>,
                        description: <span className={description}>서버를 어느 곳에 저장할지 설정합니다.</span>,
                        icon: <IoSaveOutline className={"ml-[3.5px] mt-1"}/>
                    },
                    {
                        title: <span className={title}>공개 설정</span>,
                        description: <span className={description}>서버를 어떻게 공개할지 설정합니다.</span>,
                        icon: <TbWorldUpload className={"ml-[3.5px] mt-1"}/>
                    },
                    {
                        title: <span className={title}>추가 설정</span>,
                        description: <span className={description}>서버의 부가적인 내용을 설정합니다.</span>,
                        icon: <BsClipboardPlus className={"ml-[3.5px] mt-1"}/>
                    },
                    {
                        title: <span className={title}>완료</span>,
                        icon: <IoCheckmark className={"ml-[3.5px] mt-1"}/>
                    }
                ]} current={currentStep}/>
            </div>
        </div>
    );


    // $.ajax({
    //     url: `http://localhost:${backendport}/create`,
    //     method: "POST",
    //     contentType: "application/json",
    //     data: JSON.stringify({
    //         name: "Test",
    //         serverDirectory: "C:\\Users\\hyang\\Documents",
    //         args: ["-Xms1G", "-Xmx6G"],
    //         port: 25565
    //     }),
    // }).then(resp => {
    //     if (resp.ok) {
    //         toast.success(
    //             <span className={"font-suite text-[1rem]"}>
    //                             UUID <span className={"font-bold"}>{resp.uuid}</span> 에 서버가 성공적으로 생성되었습니다.
    //                         </span>
    //         );
    //     }
    // });
}