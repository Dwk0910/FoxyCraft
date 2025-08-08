
import Form from "../../../component/AddServer/Form";

import { Input, Popover } from 'antd';

// icons
import { HiQuestionMarkCircle } from "react-icons/hi2";

// store
import { useAtom } from 'jotai';
import { serverAtom } from '../../../jotai/serverAtom';

export default function PublishSetting() {
    const [server, setServer] = useAtom(serverAtom);
    return (
        <Form title={"공개 설정"}>
            <div className={"flex flex-row w-full"}>
                <span className={"pr-3 mb-3 font-suite text-gray-300"}>서버를 공개할 포트 번호를 입력해주세요</span>
                <Popover title={<span className={"font-SeoulNamsanB text-[1.1rem]"}>공개 유의사항</span>} content={<span className={"font-suite"}>공유기를 사용하는 사용자에 한해, 이 곳에 입력한 포트에 대해 <span className={"text-orange-300 underline"}>포트포워딩이 되어있어야 (포트가 열려있어야)</span> 외부에서 정상적인 접속이 가능합니다.<br/>각 공유기의 포트포워딩 방법은 공유기 제조사 설명서나 공식 홈페이지를 참조하세요.</span>}>
                    <HiQuestionMarkCircle className={"text-gray-300 mt-1"}/>
                </Popover>
            </div>
            <div className={"w-full pl-0.5"}>
                <Input placeholder={"공개할 포트"} value={server.port} style={{ width: 100, textAlign: 'center' }} onChange={(e) => setServer(prev => ({...prev, port: e.target.value}))}/>
            </div>
        </Form>
    );
}
