
import $ from "jquery";

import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import { Steps, ConfigProvider } from 'antd';

import clsx from "clsx";


// icons
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoSaveOutline, IoCheckmark } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { GoRepoTemplate } from "react-icons/go";
import { TbWorldUpload } from "react-icons/tb";
import { BsClipboardPlus } from "react-icons/bs";

// pages (forms)
import Template from "./form/AddServer/Template";
import SaveLoc from "./form/AddServer/SaveLoc";
import PublishSetting from "./form/AddServer/PublishSetting";
import AdditionalSettings from "./form/AddServer/AdditionalSettings";

// components
import Header from "../component/Header";

// atom
import { useAtom } from 'jotai';
import { serverAtom } from "../jotai/serverAtom";

export default function AddServer() {
    const backendport = localStorage.getItem("backend");

    const [ server, setServer ] = useAtom(serverAtom);

    const summaryPage = (
        <div>
            <h1>Hello, World!</h1>
        </div>
    );

    const formList = [
        <Template/>,
        <SaveLoc/>,
        <PublishSetting/>,
        <AdditionalSettings/>,
        summaryPage
    ];

    const formCheckList = {
        Template: [
            [ server.name, server.runner ],
            [ server.custom_jre, server.custom_runner_path ]
        ],
        SaveLoc: [
            [ server.path ]
        ],
        PublishSetting: [
        ],
        AdditionalSettings: [
        ]
    };

    const [currentStep, setCurrentStep] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [opacity, setOpacity] = useState(1);

    // 페이지 state
    const [pageStatus, setPageStatus] = useState("full-left");

    // Steps에 쓸 style class
    const title = "text-white font-suite text-xl";
    const description = "text-gray-400 font-suite text-nowrap text-[1rem]";

    // const [name, setName] = useState("");
    // const [dir, setDir] = useState("");
    // const [port, setPort] = useState(25565);
    // const [additional, setAdditional] = useState({});

    return (
        <div className={"flex flex-col min-h-screen"}>
            <ToastContainer
                position={"top-center"}
                autoClose={3000}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                theme={"dark"}
            />
            <Header icon={<FiPlus/>}>서버 추가</Header>
            <div className={"flex flex-row justify-end flex-2/6"}>
                <ConfigProvider theme={{
                    token: {
                        colorPrimary: '#FF8904'
                    }
                }}>
                    <style>{`
                        .ant-steps-item {
                            margin-bottom: 70px;
                        }
                        
                        .ant-steps-item-process .ant-steps-item-tail::after,
                        .ant-steps-item-wait .ant-steps-item-tail::after {
                            background-color: #4A4A4A !important;
                        }
                        
                        .ant-steps-item-tail::after {
                            height: 90px !important;
                        }
                   `}</style>
                    <div className={"ml-10 mt-20"}>
                        <Steps direction={"vertical"} items={[
                            {
                                title: <span className={title}>서버 템플릿</span>,
                                description: <span className={description}>서버 구동기를 설정합니다.</span>,
                                icon: <GoRepoTemplate className={"ml-[3px] "}/>
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
                </ConfigProvider>
                <div className={"flex flex-col min-h-full flex-4/6"}>
                    <div className={"flex-1 transition-opacity duration-150 "} style={{ opacity }}>
                        { formList[currentPage] }
                    </div>
                    {/*크기가 유동적으로 변하므로 div로 따로 관리*/}
                    <div className={"flex flex-row w-[100%] justify-start pr-20 mt-10 mb-10"}>
                        <div className={"w-[70%] ml-40"}>
                            <span className={clsx("flex flex-row transition-colors duration-150 items-center justify-center p-3 w-20 font-suite rounded-[7px]", pageStatus === "full-left" ? "bg-[#292929]" : "bg-orange-400 hover:bg-orange-500 cursor-pointer")} onClick={() => {
                                if (currentStep >= 1) {
                                    setOpacity(0);
                                    setTimeout(() => {
                                        if (currentStep === 1) setPageStatus("full-left");
                                        else setPageStatus("center");
                                        setCurrentStep(currentStep - 1);
                                        setCurrentPage(currentPage - 1);
                                        setOpacity(1);
                                    }, 150);
                                }
                            }}>
                                <IoIosArrowBack className={"text-[1.2rem] mt-0.2"}/>
                                이전
                            </span>
                        </div>

                        {/*다음/서버생성 버튼*/}
                        <div className={"flex justify-end w-[20%]"}>
                            <span className={clsx("flex flex-row transition-all duration-150 items-center justify-center p-3 w-20 font-suite rounded-[7px] text-nowrap", pageStatus === "full-right" ? "w-30 form_last_button" : "bg-orange-400 hover:bg-orange-500", "cursor-pointer")} onClick={() => {
                                if (currentStep <= 3) {
                                    // 페이지 넘기기 조건 확인
                                    let isPassed = true;
                                    if (formCheckList[formList[currentPage].type.name]) {
                                        // 만약 넘기는 데에 조건이 있다면
                                        const conditions = formCheckList[formList[currentPage].type.name]; // 2차원 배열
                                        for (const condition of conditions) {
                                            // 검사
                                            condition.forEach(item => {
                                                if (
                                                    item === undefined ||
                                                    item === null ||
                                                    item === "" ||
                                                    item === 0
                                                ) isPassed = false;
                                            });
                                            // 어차피 OR게이트이므로 isPassed == true이면 더 이상 검사 할 필요가 없음
                                            if (isPassed) break;
                                        }
                                    }

                                    if (isPassed) {
                                        setOpacity(0);
                                        setTimeout(() => {
                                            setCurrentPage(currentPage + 1);
                                            setCurrentStep(currentStep + 1);
                                            if (currentStep === 3) setPageStatus("full-right");
                                            else setPageStatus("center");
                                            setOpacity(1);
                                        }, 150);
                                    } else {
                                        // 일부 입력란을 채우지 않음
                                        toast.error(
                                            <span className={"text-suite text-[1rem]"}>입력란을 모두 채워주세요</span>
                                        );
                                    }
                                } else if (currentStep === 4) {
                                    // 서버 추가 동작 (ajax요청 이후 toast띄우고 ServerList 페이지로 넘기기)

                                }
                            }}>
                                { pageStatus === "full-right" ? "서버 생성" : "다음" }
                                <IoIosArrowForward className={"text-[1.2rem] mt-0.2"}/>
                            </span>
                        </div>
                    </div>
                </div>
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
