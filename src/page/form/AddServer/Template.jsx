

// component
import { Input, Switch, Cascader } from 'antd';
import Form from "../../../component/AddServer/Form";

// store
import { useAtom } from "jotai";
import { serverAtom } from "../../../jotai/serverAtom";

export default function Template() {
    const [server, setServer] = useAtom(serverAtom);

    const runnerOptions = [
        {
            value: 'papermc',
            label: 'PAPERMC',
            children: [{
                value: 'papermc_1.18.2',
                label: '1.18.2'
            }, {
                value: 'papermc_1.21.8',
                label: '1.21.8'
            }]
        },
        {
            value: 'forge',
            label: 'Forge',
            children: [{
                value: 'forge_1.18.2-40.3.10',
                label: '1.18.2-40.3.10'
            }]
        }
    ];

    const customForm = (
        <div className={"mt-[15px]"}>
            Hello, World!
        </div>
    );

    return (
        <Form title={"서버 기본 설정"}>
            <Input size="large" style={{ height: '50px', width: '750px' }} value={ server.name } onChange={(event) => {
                setServer({
                    ...server,
                    name: event.target.value
                });
            }} placeholder={"서버 이름을 입력해 주세요."}/>
            <div className={"flex flex-row justify-start w-full"}>
                <div className={"flex flex-col w-full ml-3.5 pl-3 pb-3 pr-3 mr-3.5 mt-4 h-[500px] border-gray-600 border-1 rounded-[5px]"}>
                    <span className={"font-suite text-[1.1rem] mt-3"}>구동기 설정</span>
                    <div className={"flex flex-row"}>
                        <span className={"font-SeoulNamsanM text-[0.9rem] text-gray-400"}>사용자 지정 구동기</span>
                        <Switch className={"w-[50px] scale-70"} value={ server.custom } onChange={(event) => setServer({...server, custom: event})}/>
                    </div>
                    {server.custom ? customForm : (
                        <Cascader options={runnerOptions} value={server.runner} expandTrigger={"hover"} style={{ width: '100%', marginTop: '15px', height: '40px' }} onChange={(value) => setServer({ ...server, runner: value })} placeholder={"서버 구동기를 선택해 주세요."}/>
                    )}
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
