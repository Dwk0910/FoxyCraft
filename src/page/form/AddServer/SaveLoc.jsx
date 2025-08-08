
import { toast } from 'react-toastify';

import Form from "../../../component/AddServer/Form";
import { Input } from 'antd';

// store
import { useAtom } from "jotai";
import { serverAtom } from '../../../jotai/serverAtom';

export default function SaveLoc() {
    const [server, setServer] = useAtom(serverAtom);

    return (
        <Form title={"저장 위치 설정"}>
            <div className={"flex flex-row w-full"}>
                <Input placeholder={"저장 폴더"} value={server.path} onChange={(e) => setServer(prev => ({...prev, path: e.target.value}))}/>
                <input type={"button"} className="ml-5 mr-10 border-1 border-gray-400 rounded-[5px] pl-3 pr-3 font-suite cursor-pointer transition-colors duration-150 hover:border-orange-400" onClick={async () => {
                    const { isErr, content } = await window.api.selectFoler(await window.api.getHomeFolder());
                    if (isErr) toast.error(<span className={"font-suite text-[1rem]"}>{content}</span>);
                    else if (content) {
                        // 정상 선택
                        await setServer(prev => ({...prev, path: content}));
                    }
                }} value={"폴더 선택"}/>
            </div>
            <span>비어있는 폴더만 선택 가능합니다</span>
        </Form>
    );
}
