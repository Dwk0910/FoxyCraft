
import $ from 'jquery';

import clsx from 'clsx';

// component
import { toast } from "react-toastify";
import { Input, Switch, Cascader, Divider, Dropdown, Upload } from 'antd';
import Form from "../../../component/AddServer/Form";

// icons
import { FaPaperPlane } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

// store
import { useAtom } from "jotai";
import { serverAtom } from "../../../jotai/serverAtom";

export default function Template() {
    const backendport = localStorage.getItem('backend');

    const [server, setServer] = useAtom(serverAtom);
    const { Dragger } = Upload;

    // noinspection JSUnusedGlobalSymbols
    const draggerProp = {
        name: 'jre',
        accept: '.jar',
        multiple: false,
        beforeUpload: (file) => {
            if (file.type !== 'application/java-archive') {
                toast.error(<span className={"font-suite"}>올바른 구동기 형식이 아닙니다.</span>);
                return Upload.LIST_IGNORE;
            } else return false;
        }
    };

    const runnerOptions = [
        {
            value: 'papermc',
            label: 'PAPERMC',
            children: [{
                value: '1.21.8',
                label: '1.21.8'
            }, {
                value: '1.20.6',
                label: '1.20.6'
            }, {
                value: '1.18.2',
                label: '1.18.2'
            }]
        },
        {
            value: 'mohist',
            label: 'Mohist',
            children: [{
                value: '1.18.2',
                label: '1.18.2'
            }, {
                value: '1.16.5',
                label: '1.16.5'
            }, {
                value: '1.12.2',
                label: '1.12.2'
            }, {
                value: '1.7.10',
                label: '1.7.10'
            }]
        }
    ];

    const jreOptions = [{
        key: 1,
        label: 'JRE 21'
    }, {
        key: 2,
        label: 'JRE 17'
    }, {
        key: 3,
        label: 'JRE 11'
    }, {
        key: 4,
        label: 'JRE 8'
    }];

    function versionRange(start, end) {
        return {
            includes(version) {
                return compareVersion(version, start) >= 0 &&
                    compareVersion(version, end) <= 0;
            }
        };
    }

    function compareVersion(a, b) {
        const pa = a.split(".").map(Number);
        const pb = b.split(".").map(Number);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            const na = pa[i] || 0;
            const nb = pb[i] || 0;
            if (na !== nb) return na - nb;
        }
        return 0;
    }

    function getJVMVersion(runner) {
        try {
            const mcVersion = runner[runner.length - 1];
            const jvmMap = [
                {range: ["0.0.0", "1.15.2"], jvm: "JRE 8"},
                {exact: "1.16.5", jvm: "JRE 11"},
                {range: ["1.17", "1.20.6"], jvm: "JRE 17"},
                {range: ["1.21", "1.21.8"], jvm: "JRE 21"}
            ];

            for (const rule of jvmMap) {
                if (rule.exact && mcVersion === rule.exact) {
                    return rule.jvm;
                }
                if (rule.range && versionRange(...rule.range).includes(mcVersion)) {
                    return rule.jvm;
                }
            }
        } catch (ignored) {
            return null;
        }

        return null;
    }

    // noinspection JSUnusedGlobalSymbols
    const customForm = (
        <>
            <div className={"mt-[15px]"}>
                <style>{`
                .ant-upload-list-item-name {
                    max-width: 280px;
                }
                `}</style>
                <Dragger {...draggerProp} fileList={ server.custom_runner_file } onChange={(event) => {
                    let newFileList = [...event.fileList];

                    // fileList의 크기가 1보다 큰가? (업로드한 파일의 개수가 한 개를 초과하는가?)
                    if (newFileList.length > 1) newFileList = newFileList.slice(-1);

                    void setServer(prev => ({
                        ...prev,
                        custom_runner_file: newFileList
                    }));

                    if (newFileList[0]) {
                        const formData = new FormData();
                        formData.append("file", newFileList[0].originFileObj);

                        $.ajax({
                            url: `http://localhost:${backendport}/fileio/upload`,
                            type: "POST",
                            contentType: false,
                            processData: false,
                            data: formData,
                            success: res => {
                                void setServer(prev => ({
                                    ...prev,
                                    custom_runner_path: res
                                }));
                            },
                            error: err => {
                                console.error(err);
                            }
                        });
                    }
                }} onRemove={(event) => {
                    if (!event.originFileObj) return;

                    const formData = new FormData();
                    formData.append("file", event.originFileObj);

                    $.ajax({
                        url: `http://localhost:${backendport}/fileio/cancel`,
                        type: "POST",
                        contentType: false,
                        processData: false,
                        data: formData,
                        error: err => {
                            console.error(err);
                        }
                    });

                    void setServer(prev => ({
                        ...prev,
                        custom_runner_path: ""
                    }));
                }}>
                    <div className={"flex flex-col justify-center items-center"}>
                        <FiDownload size={50} className={"text-gray-500"}/>
                        <span className={"mt-5 font-suite"}>사용할 구동기를 끌어오거나, 눌러서 선택해 주세요.</span>
                        <span className={"font-suite text-gray-400"}>사용 가능한 확장자: <span className={"font-mono"}>.jar</span></span>
                    </div>
                </Dragger>
            </div>
            <Dropdown menu={{ items: jreOptions, selectable: true, onClick: e => {
                    // onClick event handle
                    void setServer(prev => ({
                        ...prev,
                        custom_jre: jreOptions[parseInt(e.key) - 1].label
                    }));

            }}} trigger={["click"]}>
                <div className={clsx("flex flex-row justify-between items-center w-full p-2 pl-3.5 mt-3 bg-[#404040] border-1 border-gray-500 rounded-[5px] cursor-pointer transition-all ease-in-out duration-200 hover:border-[#FF8904]", server.custom_runner_file[0] && "mt-10")}>
                    { server.custom_jre ? server.custom_jre : (<span className={"font-suite text-gray-400"}>구동기 JRE 버전을 선택해 주세요</span>) }
                    <IoIosArrowDown className={"text-gray-400"}/>
                </div>
            </Dropdown>
        </>
    );

    return (
        <Form title={"서버 기본 설정"}>
            <Input size="large" style={{ height: '50px', width: '750px' }} value={ server.name } onChange={(event) => {
                void setServer(prev => ({
                    ...prev,
                    name: event.target.value
                }));
            }} placeholder={"서버 이름을 입력해 주세요."}/>
            <div className={"flex flex-row justify-start w-full"}>
                <div className={"flex flex-col w-full ml-[3px] pl-3 pb-3 pr-3 mr-3.5 mt-4 h-[500px] border-gray-600 border-1 rounded-[5px]"}>
                    <span className={"font-suite text-[1.1rem] mt-3"}>구동기 설정</span>
                    <div className={"flex flex-row"}>
                        <span className={"font-SeoulNamsanM text-[0.9rem] text-gray-400"}>사용자 지정 구동기</span>
                        <Switch className={"w-[50px] scale-70"} value={ server.custom } onChange={(event) => setServer({...server, custom: event})}/>
                    </div>
                    {server.custom ? customForm : (
                        <Cascader options={ runnerOptions } value={ server["runner"] } expandTrigger={"hover"} style={{ width: '100%', marginTop: '15px', height: '40px', fontFamily: 'suite', fontSize: '1.3rem' }} onChange={(value) => setServer({ ...server, runner: value ? value : [] })} placeholder={"서버 구동기를 선택해 주세요."}/>
                    )}
                    {(!server.custom && server["runner"] && getJVMVersion(server["runner"])) && (
                        <span className={"text-[0.9rem] font-suite text-gray-300 ml-2 mt-3"}>이 구동기로 연 서버는 {getJVMVersion(server["runner"])}을 기반으로 동작할 것입니다.</span>
                    )}
                </div>
                <div className={"flex flex-col w-full mr-3.5 mt-4 pl-3 pb-3 rounded-[5px]"}>
                    <span className={"font-suite text-[1.1rem] mt-3 p-2"}>추천 구동기</span>
                    <div className={"flex flex-col p-2 h-100 overflow-y-auto"}>
                        <div className={"flex flex-col w-[100%] border-gray-600 border-1 p-2 pl-4 pr-4 rounded-[5px] cursor-pointer transition-all duration-150 ease-in-out hover:scale-102"} onClick={() => {
                            void setServer({
                                ...server,
                                custom: false,
                                runner: ['papermc', '1.20.6']
                            });
                            toast.success(<span className={"font-suite"}><span className={"font-bold"}>Paper</span> 구동기로 적용되었습니다.</span>);
                        }}>
                            <span className={"font-SeoulNamsanB text-[1rem] text-gray-200 mt-2"}>Paper 안정</span>
                            <Divider style={{ marginTop: '10px', marginBottom: '15px' }}/>
                            <div className={"flex flex-row"}>
                                <div className={"flex flex-col min-w-40"}>
                                    <span className={"font-suite text-[0.9rem]"}><span className={"text-gray-300"}>마인크래프트</span> <span className={"font-bold"}>1.20.6</span></span>
                                    <span className={"font-suite text-[0.9rem]"}><span className={"text-gray-300"}>구동기</span> <span className={"font-bold"}>Paper</span></span>
                                    <span className={"font-suite text-[0.9rem]"}><span className={"text-gray-300"}>JRE 버전</span> <span className={"font-bold"}>21</span></span>
                                </div>
                                <div className={"flex grow justify-center items-center"}>
                                    <FaPaperPlane size={50} className={"mt-[-10px]"}/>
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-col w-[100%] border-gray-600 border-1 p-2 pl-4 pr-4 rounded-[5px] cursor-pointer transition-all duration-150 ease-in-out hover:scale-102 mt-5"} onClick={() => {
                            void setServer({
                                ...server,
                                custom: false,
                                runner: ['mohist', '1.7.10']
                            });
                            toast.success(<span className={"font-suite"}><span className={"font-bold"}>Mohist</span> 구동기로 적용되었습니다.</span>);
                        }}>
                            <span className={"font-SeoulNamsanB text-[1rem] text-gray-200 mt-2"}>Mohist 추천 모드서버</span>
                            <Divider style={{ marginTop: '10px', marginBottom: '15px' }}/>
                            <div className={"flex flex-row"}>
                                <div className={"flex flex-col min-w-40"}>
                                    <span className={"font-suite text-[0.9rem]"}><span className={"text-gray-300"}>마인크래프트</span> <span className={"font-bold"}>1.7.10</span></span>
                                    <span className={"font-suite text-[0.9rem]"}><span className={"text-gray-300"}>구동기</span> <span className={"font-bold"}>Mohist (Forge)</span></span>
                                    <span className={"font-suite text-[0.9rem]"}><span className={"text-gray-300"}>JRE 버전</span> <span className={"font-bold"}>8</span></span>
                                </div>
                                <div className={"flex grow justify-center items-center"}>
                                    <img src={"https://avatars.githubusercontent.com/u/54493246?s=200&v=4"} className={"h-15"} alt={"mohist"}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    );
}
