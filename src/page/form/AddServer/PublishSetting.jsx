
import $ from 'jquery';

// components
import Form from "../../../component/AddServer/Form";
import { toast } from 'react-toastify';
import { Input, Popover, Upload } from 'antd';

// icons
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { SlPicture } from "react-icons/sl";

// store
import { useState } from "react";
import { useAtom } from 'jotai';
import { serverAtom } from '../../../jotai/serverAtom';

export default function PublishSetting() {
    const backendport = localStorage.getItem("backend");
    const [server, setServer] = useAtom(serverAtom);
    const [icon, setIcon] = useState(null);

    // Dragger settings
    const { Dragger } = Upload;
    const draggerprop = {
        name: "icon",
        multiple: false,
        accept: '.png'
    };

    // servericon이 등록되면 자동으로 이미지 가져오기
    if (server.servericon_path) {
        window.api.getImage(server.servericon_path).then(basedata => {
            setIcon(basedata);
        });
    } else if (icon) {
        // servericon_path는 등록이 안되어있는데 그 이전 사진이 프리뷰로 등록되어 있는 경우 -> 과거 프리뷰를 지워야함
        setIcon(null);
    }

    return (
        <Form title={"공개 설정"}>
            <div className={"flex flex-row w-full"}>
                <div className={"flex flex-col w-110 border-r-1 border-gray-500"}>
                    <div className={"flex flex-row w-full"}>
                        <span className={"pr-3 mb-3 font-suite text-gray-300"}>서버를 공개할 포트 번호를 입력해주세요</span>
                        <Popover title={<span className={"font-SeoulNamsanM text-[1.1rem]"}>포트 번호</span>} content={<span className={"font-suite"}>공유기를 사용하는 사용자에 한해, 이 곳에 입력한 포트에 대해 <span className={"text-orange-300 underline"}>포트포워딩이 되어있어야 (포트가 열려있어야)</span> 외부에서 정상적인 접속이 가능합니다.<br/>각 공유기의 포트포워딩 방법은 공유기 제조사 설명서나 공식 홈페이지를 참조하세요.</span>}>
                            <HiQuestionMarkCircle className={"text-gray-300 mt-1"}/>
                        </Popover>
                    </div>
                    <div className={"w-full pl-0.5"}>
                        <Input placeholder={"공개할 포트"} value={server.port} style={{ width: 100, textAlign: 'center' }} onChange={(e) => setServer(prev => ({...prev, port: e.target.value}))}/>
                    </div>
                </div>
                <div className={"flex flex-col items-center w-60 pl-4 pr-4"}>
                    <style>{`
                    .ant-upload-list-item-name {
                        max-width: 135px;
                    }
                    `}</style>
                    <Dragger {...draggerprop} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 200 }} fileList={ server.servericon } beforeUpload={file => {
                        // noinspection JSUnresolvedReference
                        if (file.type !== 'image/png') {
                            toast.error(<span className={"font-suite text-[1rem]"}>잘못된 형식의 파일입니다.<br/>(<span className={"font-mono"}>PNG</span> 이미지만 선택할 수 있습니다.)</span>);
                            return Upload.LIST_IGNORE;
                        } else return false;
                    }} onChange={ async (event) => {
                        let newList = [...event.fileList];

                        // 만약 이미 리스트에 파일이 존재하면: 이전 파일은 제거
                        if (newList.length > 1) newList = newList.slice(-1);

                        // 변경점 적용

                        // Step 1. Dragger용 fileList 업데이트
                        await setServer(prev => ({
                            ...prev,
                            servericon: newList
                        }));

                        // newList[0]이 undefined가 아닌가? (오직 추가 이벤트만 처리, 삭제 이벤트는 무시)
                        if (newList[0]) {
                            // Step 2. 백엔드에 보내서 절대경로 알아오기
                            const formData = new FormData();
                            formData.set("file", newList[0].originFileObj);
                            await $.ajax({
                                url: `http://localhost:${backendport}/fileio/upload`,
                                method: "POST",
                                data: formData,
                                contentType: false,
                                processData: false,
                                success: res => {
                                    // public atom에 적용
                                    setServer(prev => ({
                                        ...prev,
                                        servericon_path: res
                                    }));
                                }
                            });
                        }
                    }} onRemove={(event) => {
                        if (!event.originFileObj) return;

                        const formData = new FormData();
                        formData.set("file", event.originFileObj);

                        $.ajax({
                            url: `http://localhost:${backendport}/fileio/cancel`,
                            method: "POST",
                            data: formData,
                            contentType: false,
                            processData: false,
                            error: err => {
                                console.error(err);
                            }
                        });

                        void setServer(prev => ({
                            ...prev,
                            servericon_path: ""
                        }));
                    }}>
                        <div className={"flex flex-col justify-center items-center"}>
                            { icon ? (<img src={ icon } alt={"server_icon"} width={64} height={64} />) : (
                                <>
                                    <SlPicture size={50} className={"text-gray-500 mt-4"}/>
                                    <span className={"mt-2 font-suite"}>사용자 지정 서버 아이콘</span>
                                    <span className={"text-gray-400 mb-4 font-suite"}>아이콘 사이즈 : <span className={"font-mono"}>64x64</span></span>
                                </>
                            )}
                        </div>
                    </Dragger>
                </div>
            </div>
        </Form>
    );
}
