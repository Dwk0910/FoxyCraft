
import Form from '../../../component/AddServer/Form'

// icon
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { MdError } from "react-icons/md";

// component
import { Switch, Input, Popover } from 'antd';

// store
import { serverAtom } from '../../../jotai/serverAtom';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';

export default function AdditionalSettings() {
    const [opacity, setOpacity] = useState(0);
    const [server, setServer] = useAtom(serverAtom);

    const isNotAllowed = (str) => {
        if (!str) return true;
        return !(/^[a-zA-Z0-9_-]+$/.test(str));
    };

    useEffect(() => {
        if (isNotAllowed(server.world_name)) {
            void setServer(prev => ({...prev, custom_world_name_err: true}))
            setOpacity(1);
        } else {
            void setServer(prev => ({...prev, custom_world_name_err: false}));
            setOpacity(0);
        }
    }, [server.world_name]);

    return (
        <Form title={"추가 설정"}>
            <div className={"flex flex-col w-full"}>
                <div>
                    <span className={"font-suite text-gray-300 mr-6"}>사용자 지정 월드 이름</span>
                    <Switch value={ server.custom_world_name } onChange={e => setServer(prev => ({...prev, custom_world_name: e}))}/>
                </div>
                <div className={"flex flex-row items-center mt-3 ml-2"}>
                    <span className={"font-suite text-gray-300 mr-6"}>월드 이름</span>
                    <Input style={{width: "200px", fontSize: '1rem'}} value={ server.world_name } onChange={e => {
                        void setServer(prev => ({...prev, world_name: e.target.value}));
                    }} disabled={ !server.custom_world_name }/>
                    <span className={"flex flex-row items-center font-suite text-[#FF3030] ml-3 transition-opacity duration-300"} style={{ opacity }}>
                        <span className={"text-[1.4rem]"}><MdError/></span>
                        <span className={"ml-2"}>월드 이름이 잘못되었습니다.</span>
                        <Popover className={"cursor-pointer"} title={<span className={"font-SeoulNamsanM"}>월드 이름 조건</span>} content={
                            <div>
                                <span className={"font-suite text-[1rem] text-white"}>월드 이름은 다음의 조건을 충족하여야 합니다:</span>
                                <div className={"flex flex-col ml-3"}>
                                    <span className={"font-suite"}><span className={"font-bold"}>·</span>&nbsp;&nbsp;&nbsp;비어있지 않을 것</span>
                                    <span className={"font-suite"}><span className={"font-bold"}>·</span>&nbsp;&nbsp;&nbsp;영어, 숫자, 특수문자로만 이루어질 것</span>
                                    <span className={"font-suite"}><span className={"font-bold"}>·</span>&nbsp;&nbsp;&nbsp;특수문자는 <span className={"text-orange-400"}>- (하이픈)</span>이나 <span className={"text-orange-400"}>_ (언더바)</span>만 사용할 것</span>
                                </div>
                            </div>
                        }>
                            <span className={"text-blue-300 ml-4 underline underline-offset-4"}>조건 확인하기</span>
                        </Popover>
                    </span>
                </div>
                <div className={"mt-5"}>
                    <span className={"font-suite text-gray-300 mr-6"}>자동 월드 백업</span>
                    <Switch value={ server.auto_backup } onChange={e => {
                        void setServer(prev => {
                            if (prev.auto_backup) {
                                // true -> false
                                return {
                                    ...prev,
                                    auto_backup: e,
                                    auto_backup_period: 0,
                                    auto_backup_max_count: 0
                                };
                            } else return {...prev, auto_backup: e};
                        });
                    }}/>
                </div>
                {/*백업 상세설정*/}
                <div className={"flex flex-col mt-2 ml-2"}>
                    <div className={"flex flex-row items-center"}>
                        <span className={"font-suite text-gray-300 mr-6"}>백업 주기</span>
                        <Input style={{ width: "70px" }} value={ server.auto_backup_period } onChange={e => {
                            if (!isNaN(e.target.value) && e.target.value.length > 0) void setServer(prev => ({...prev, auto_backup_period: parseInt(e.target.value)}));
                            else void setServer(prev => ({...prev, auto_backup_period: 0}));
                        }} disabled={ !server.auto_backup }/>
                        <span className={"font-suite text-gray-300 ml-2"}>분</span>
                    </div>
                    <div className={"flex flex-row items-center mt-2"}>
                        <span className={"font-suite text-gray-300 mr-6"}>백업 개수</span>
                        <Input style={{ width: "70px" }} value={ server.auto_backup_max_count } onChange={e => {
                            if (!isNaN(e.target.value) && e.target.value.length > 0) void setServer(prev => ({...prev, auto_backup_max_count: parseInt(e.target.value)}));
                            else void setServer(prev => ({...prev, auto_backup_max_count: 0}));
                        }} disabled={ !server.auto_backup }/>
                        <span className={"font-suite text-gray-300 ml-2"}>개</span>
                        <Popover title={<span className={"font-SeoulNamsanM"}>월드 백업 개수</span>} content={<span className={"font-suite"}>최대로 몇 개의 월드 백업을 보존할지 설정합니다.<br/>이곳에서 설정한 개수의 백업개수 이상으로 백업되면 가장 오래된 백업 순으로 자동으로 지워집니다.</span>}>
                            <HiQuestionMarkCircle className={"ml-2"}/>
                        </Popover>
                    </div>
                </div>
            </div>
        </Form>
    );
}