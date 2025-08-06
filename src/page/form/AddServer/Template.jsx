

// component
import { Input, Switch } from 'antd';
import Form from "../../../component/AddServer/Form";

// store
import { useState } from 'react';
import { useAtom } from "jotai";
import { serverAtom } from "../../../jotai/serverAtom";

export default function Template() {
    const [isCustom, setIsCustom] = useState(false);
    const [server, setServer] = useAtom(serverAtom);

    return (
        <Form>
            <span className={"text-left w-full font-SeoulNamsanM text-2xl ml-6 mb-7"}>기본 서버 설정</span>
            <Input size="large" style={{ height: '50px', width: '750px' }} value={ server.name } onChange={(event) => {
                setServer({
                    ...server,
                    name: event.target.value
                });
            }} placeholder={"서버 이름을 입력해 주세요."}/>
            <div className={"flex flex-row justify-start w-full"}>
                <div className={"flex flex-col w-full ml-3.5 pl-3 pb-3 mr-3.5 mt-4 h-[500px] border-gray-600 border-1 rounded-[5px]"}>
                    <span className={"font-suite text-[1.1rem] mt-3"}>구동기 설정</span>
                    <div className={"flex flex-row"}>
                        <span className={"font-SeoulNamsanM text-[0.9rem] text-gray-400"}>사용자 지정 구동기</span>
                        <Switch className={"w-[50px] scale-70"} value={ isCustom } onChange={(event) => setIsCustom(event)}/>
                    </div>

                </div>
                <div className={"flex flex-col w-full mr-3.5 mt-4 pl-3 pb-3 rounded-[5px]"}>
                    <span className={"font-suite text-[1.1rem] mt-3"}>추천 템플릿</span>
                    <div className={"flex flex-row"}>
                    </div>
                </div>
            </div>
        </Form>
    );
}
