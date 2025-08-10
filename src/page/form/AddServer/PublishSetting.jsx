
import $ from 'jquery';

// assets
import previewBg from '../../../assets/images/dirt_background.png';
import defaultPackIcon from '../../../assets/images/pack.svg';

// components
import Form from "../../../component/AddServer/Form";
import { toast } from 'react-toastify';
import { Input, Popover, Upload, Switch } from 'antd';

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

    return (
        <Form title={"공개 설정"}>
            <div className={"flex flex-col"}>
                {/*preview*/}
                <span className={"mb-2 font-SeoulNamsanM text-[1.04rem]"}>미리보기</span>
                <div className={"flex flex-row justify-start items-center w-full h-25 border-gray-600 border-2 rounded-[5px]"} style={{ backgroundImage: `url(${previewBg})` }}>
                    <img src={defaultPackIcon} className={"h-20 ml-2.5"} alt={"defaultlogo"}/>
                    <div className={"flex flex-col items-start h-[90%] w-120 ml-3"}>
                        <span className={"text-[1.4rem] font-[MinecraftRegular] mt-1"}>Minecraft Server</span>
                        <span className={"text-[1.2rem] mt-[-5px] text-[#AAAAAA]"} style={{ fontFamily: "MinecraftRegular" }}>A Minecraft Server</span>
                    </div>
                    aa
                </div>

                {/*main*/}
                <span className={"mb-2 mt-4 font-SeoulNamsanM text-[1.04rem]"}>서버 설정</span>
                <div className={"flex flex-row w-full border-t-1 border-gray-500"}>
                    <div className={"flex flex-col w-110 border-r-1 h-90 border-gray-500"}>
                        <div className={"flex flex-row w-full mt-4"}>
                            <span className={"pr-3 mb-3 font-suite text-gray-300"}>서버를 공개할 포트 번호를 입력해주세요</span>
                            <Popover title={<span className={"font-SeoulNamsanM text-[1.1rem]"}>포트 번호</span>} content={<span className={"font-suite"}>공유기를 사용하는 사용자에 한해, 이 곳에 입력한 포트에 대해 <span className={"text-orange-300 underline"}>포트포워딩이 되어있어야 (포트가 열려있어야)</span> 외부에서 정상적인 접속이 가능합니다.<br/>각 공유기의 포트포워딩 방법은 공유기 제조사 설명서나 공식 홈페이지를 참조하세요.</span>}>
                                <HiQuestionMarkCircle className={"text-gray-300 mt-1"}/>
                            </Popover>
                        </div>
                        <div className={"w-full pl-0.5"}>
                            <Input placeholder={"공개할 포트"} value={server.port} style={{ width: 100, textAlign: 'center' }} onChange={(e) => setServer(prev => ({...prev, port: e.target.value}))}/>
                        </div>
                        <div className={"flex flex-row mt-5"}>
                            <span className={"pr-3 mb-3 font-suite text-gray-300"}>서버 접속 최대인원 (권장: 24명)</span>
                        </div>
                        <div className={"w-full pl-0.5"}>
                            <Input placeholder={"최대인원"} value={ server.max_player } style={{ width: 100, textAlign: 'center' }} onChange={(e) => {
                                if (e.target.value < 150) void setServer(prev => ({...prev, max_player: e.target.value }));
                                else if (e.target.value >= 150) void setServer(prev => ({...prev, max_player: 150}));
                                else void setServer(prev => ({...prev, max_player: 1}));
                            }}/>
                            <span className={"font-suite ml-3"}>명</span>
                        </div>
                        <div className={"flex flex-row mt-5"}>
                            <span className={"pr-3 mb-1 font-suite text-gray-300"}>online mode</span>
                            <Popover title={<span className={"font-SeoulNamsanM text-[1.1rem]"}>online mode</span>} content={<span className={"font-suite"}>마인크래프트 복돌 유저를 차단하는 기능입니다.<br/>online mode를 비활성화하면 각 플레이어의 아바타가 정상적으로 보이지 않을 수 있습니다.</span>}>
                                <HiQuestionMarkCircle className={"text-gray-300 mt-1"}/>
                            </Popover>
                        </div>
                        <div className={"w-full pl-0.5"}>
                            <Switch value={ server.online_mode } onClick={e => setServer(prev => ({ ...prev, online_mode: e }))}/>
                        </div>
                    </div>
                    <div className={"flex flex-col grow items-center w-60 pl-4 pr-4 pt-4 mt-4"}>
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
                                // Step 2. 64x64로 변경 후 아이콘으로 등록
                                await resizeImageToBase64(newList[0].originFileObj, 64, 64, "PNG", 100, async uri => {
                                    setIcon(uri);

                                    // Step 3. 변환된 이미지를 백엔드에 보내서 절대경로 알아오기
                                    const formData = new FormData();
                                    formData.append("file", await base64ToBlob(uri, 'image/png'), 'icon.png');

                                    await $.ajax({
                                        url: `http://localhost:${backendport}/fileio/upload`,
                                        method: 'POST',
                                        data: formData,
                                        contentType: false,
                                        processData: false,
                                        success: res => {
                                            setServer(prev => ({
                                                ...prev,
                                                servericon_path: res
                                            }));
                                        }
                                    });
                                });
                            }
                        }} onRemove={(event) => {
                            if (!event.originFileObj) return;

                            const formData = new FormData();
                            formData.append("file", event.originFileObj, 'icon.png');

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

                            setIcon(null);
                        }}>
                            <div className={"flex flex-col justify-center items-center"}>
                                { icon ? (<img src={ icon } alt={"server_icon"} width={640} height={640} />) : (
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
            </div>
        </Form>
    );
};

// Base64 데이터를 Blob 객체로 변환하는 유틸리티 함수
const base64ToBlob = (base64Data, contentType) => {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
};

const resizeImageToBase64 = (FileObj, targetWidth, targetHeight, compressFormat, quality, responseUriFunc) => {
    return new Promise((resolve, reject) => {
        // 1. 파일을 읽기 위한 FileReader 객체 생성
        const reader = new FileReader();
        reader.readAsDataURL(FileObj);

        reader.onload = () => {
            const base64 = reader.result;
            const img = new Image();
            img.src = base64;

            img.onload = () => {
                const originalWidth = img.width;
                const originalHeight = img.height;

                // 2. 원본 비율을 유지하며 리사이징할 크기 계산
                const ratio = Math.min(targetWidth / originalWidth, targetHeight / originalHeight);
                const newWidth = originalWidth * ratio;
                const newHeight = originalHeight * ratio;

                // 3. 캔버스 생성 및 최종 크기(64x64)로 설정
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                // 4. 캔버스 중앙에 리사이즈된 이미지 그리기
                const x = (targetWidth - newWidth) / 2;
                const y = (targetHeight - newHeight) / 2;
                ctx.drawImage(img, x, y, newWidth, newHeight);

                // 5. 출력 형식에 맞춰 데이터 반환
                const mimeType = `image/${compressFormat.toLowerCase()}`;
                const finalQuality = quality / 100;
                const result = canvas.toDataURL(mimeType, finalQuality);

                responseUriFunc(result);
                resolve(result);
            };

            img.onerror = (error) => {
                reject(new Error('이미지 로드 실패: ' + error.message));
            };
        };

        reader.onerror = (error) => {
            reject(new Error('파일 읽기 실패: ' + error.message));
        };
    });
};
