import $ from 'jquery';

// native
import { useState, useContext } from 'react';

// func
import { clsx } from 'clsx';
import getRunnerLicense from '../func/getRunnerLicense';

// icons
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { IoSaveOutline, IoCheckmark } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { GoRepoTemplate } from 'react-icons/go';
import { TbWorldUpload } from 'react-icons/tb';
import { BsClipboardPlus } from 'react-icons/bs';
import { MdError } from 'react-icons/md';

// page
import ServerList from './ServerList';

// pages (forms)
import Template from './form/AddServer/Template';
import SaveLoc from './form/AddServer/SaveLoc';
import PublishSetting from './form/AddServer/PublishSetting';
import AdditionalSettings from './form/AddServer/AdditionalSettings';

// components
import { toast, ToastContainer } from 'react-toastify';
import { Steps, ConfigProvider, Modal, theme, Checkbox } from 'antd';
const { darkAlgorithm } = theme;
import Form from '../component/AddServer/Form';
import Header from '../component/Header';
import Loading from '../component/Loading';

// store
import { useAtom } from 'jotai';
import { currentServerAtom } from '../jotai/serverListAtom';
import { serverAtom } from '../jotai/serverAtom';
import { menuContext } from '../App';

export default function AddServer() {
    const { changeMenu } = useContext(menuContext);
    const [currentServer, setCurrentServer] = useAtom(currentServerAtom);
    const [server, setServer] = useAtom(serverAtom);

    const getRunnerFullName = (runner) => {
        let result = '';
        for (const item of runner) {
            result += result.length !== 0 ? '-' + item : item;
        }
        return result;
    };

    const NA = () => {
        return <span className={'font-SeoulNamsanM text-gray-300'}>해당 없음</span>;
    };

    const summaryPage = (
        <div>
            <Form title={'서버 추가 준비가 완료되었습니다'}>
                <span className={'font-suite text-gray-300 mt-[-20px]'}>
                    설정하신 내용을 다시 한 번 확인하시고, 서버 생성 버튼을 눌러주세요.
                </span>
                <div className={'w-full flex flex-row mt-10 ml-12'}>
                    <div className={'flex flex-col w-full'}>
                        <div className={'flex flex-row items-center'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>서버 이름</span>
                            <span className={'text-white ml-3 w-130 text-nowrap overflow-hidden overflow-ellipsis'}>
                                {server.name}
                            </span>
                        </div>
                        <div className={'flex flex-row items-center'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>구동기 이름</span>
                            <span className={'text-white ml-3'}>
                                {server.custom ? <NA /> : getRunnerFullName(server['runner'])}
                            </span>
                        </div>
                        <div className={'flex flex-row items-center'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>커스텀 구동기 사용</span>
                            <span className={'text-white ml-3'}>{server.custom ? 'Y' : 'N'}</span>
                        </div>
                        {server.custom && (
                            <>
                                <div className={'flex flex-row items-center'}>
                                    <span className={'text-gray-400 font-suite w-30 text-right'}>구동기 이름</span>
                                    <span
                                        className={
                                            'text-white ml-3 overflow-ellipsis overflow-hidden text-nowrap w-60'
                                        }>
                                        {server.custom_runner_path.includes('\\')
                                            ? server.custom_runner_path.split('\\')[
                                                  server.custom_runner_path.split('\\').length - 1
                                              ]
                                            : server.custom_runner_path.split('/')[
                                                  server.custom_runner_path.split('/').length - 1
                                              ]}
                                    </span>
                                </div>
                                <div className={'flex flex-row items-center'}>
                                    <span className={'text-gray-400 font-suite w-30 text-right'}>사용 JRE</span>
                                    <span className={'text-white ml-3'}>{server.custom_jre}</span>
                                </div>
                            </>
                        )}
                        <div className={'flex flex-row items-center mt-3'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>서버 저장 위치</span>
                            <span className={'text-white ml-3 w-130'}>{server.path}</span>
                        </div>

                        <div className={'flex flex-row items-center mt-3'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>공개 포트</span>
                            <span className={'text-white ml-3 w-20'}>{server.port}</span>
                        </div>
                        <div className={'flex flex-row items-center'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>커스텀 서버 아이콘</span>
                            <span className={'text-white ml-3 w-20'}>{server.servericon.length !== 0 ? 'Y' : 'N'}</span>
                        </div>
                        <div className={'flex flex-row items-center'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>최대 플레이어</span>
                            <span className={'text-white font-suite ml-3 w-20'}>{server.max_player + '명'}</span>
                        </div>
                        <div className={'flex flex-row items-center'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>online mode</span>
                            <span className={'text-white font-suite ml-3 w-20'}>{server.online_mode ? 'Y' : 'N'}</span>
                        </div>

                        <div className={'flex flex-row items-center mt-3'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>자동 백업</span>
                            <span className={'text-white ml-3 w-130'}>{server.auto_backup ? 'Y' : 'N'}</span>
                        </div>
                        {server.auto_backup && (
                            <>
                                <div className={'flex flex-row items-center'}>
                                    <span className={'text-gray-400 font-suite w-30 text-right'}>백업 주기</span>
                                    <span className={'text-white ml-3 w-130 font-suite'}>
                                        {server.auto_backup_period + '분'}
                                    </span>
                                </div>
                                <div className={'flex flex-row items-center'}>
                                    <span className={'text-gray-400 font-suite w-30 text-right'}>최대 백업 개수</span>
                                    <span className={'text-white ml-3 w-130 font-suite'}>
                                        {server.auto_backup_max_count + '개'}
                                    </span>
                                </div>
                            </>
                        )}
                        <div className={'flex flex-row items-center'}>
                            <span className={'text-gray-400 font-suite w-30 text-right'}>월드 이름</span>
                            <span className={'text-white ml-3 w-130'}>{server.world_name}</span>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );

    const formList = [<Template />, <SaveLoc />, <PublishSetting />, <AdditionalSettings />, summaryPage];

    const getFormCheckList = async () => {
        return {
            Template: [
                [server.name, server.runner, !server.custom],
                [server.name, server.custom_jre, server.custom_runner_path],
            ],
            SaveLoc: [[server.path, await window.api.isEmpty(server.path)]],
            PublishSetting: [[server.port, server.max_player]],
            AdditionalSettings: [
                // custom name, auto_backup 활성화 시
                [
                    server.custom_world_name,
                    server.auto_backup,
                    !server.custom_world_name_err,
                    server.auto_backup_period,
                    server.auto_backup_max_count,
                ],
                // custom name만 활성화 시
                [server.custom_world_name, !server.auto_backup, !server.custom_world_name_err],
                // auto_backup만 활성화 시
                [
                    server.auto_backup,
                    !server.custom_world_name,
                    server.auto_backup_period,
                    server.auto_backup_max_count,
                ],
                // 무엇도 활성화 하지 않을 경우
                [!server.custom_world_name, !server.auto_backup],
            ],
        };
    };

    const sendCreateRequest = async () => {
        // (마지막) 서버 추가 동작 (ajax요청 이후 toast띄우고 ServerList 페이지로 넘기기)
        // 유의 : MOTD의 경우 비어있을 때 공백문자를 넣어야 함. 안그럴 경우 오류 발생 가능성 있음

        // dialog닫고 로딩창 띄우기
        setDialogOpen(false);
        setLoading(true);

        // ajax요청
        const backendport = localStorage.getItem('backend');
        try {
            await $.ajax({
                url: `http://localhost:${backendport}/servercrud/create`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: server.name,
                    path: server.path,
                    isCustom: server.custom,
                    runner: getRunnerFullName(server.runner),
                    custom_jre: server.custom_jre,
                    custom_runner_path: server.custom_runner_path,
                    port: server.port,
                    servericon_path: server.servericon_path,
                    motd: server.motd ? toUnicode(server.motd) : ' ',
                    max_player: server.max_player,
                    online_mode: server.online_mode,
                    auto_backup: server.auto_backup,
                    auto_backup_period: server.auto_backup_period,
                    auto_backup_max_count: server.auto_backup_max_count,
                    world_name: server.world_name,
                }),
                success: (resp) => {
                    setLoading(false);
                    setCurrentServer({ ...currentServer, id: resp });
                    changeMenu(<ServerList />);
                },
            });
        } catch (err) {
            setLoading(false);
            setErrormsg(err);
            setErrorDialogOpen(true);
        }
    };

    // 페이지 state
    const [opacity, setOpacity] = useState(1);

    // Steps에 쓸 style class
    const title = 'text-white font-suite text-xl';
    const description = 'text-gray-400 font-suite text-nowrap text-[1rem]';

    // Modal/dialog 출력에서 사용
    const [checked, setChecked] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errormsg, setErrormsg] = useState('');
    const [loading, setLoading] = useState(false);

    // 전송 시 사용 (motd를 readable unicode escape로 변경)
    const toUnicode = (inputString) => {
        // 결과 문자열을 저장할 변수
        let result = '';

        // 입력된 문자열의 각 글자를 순회
        for (let i = 0; i < inputString.length; i++) {
            // charCodeAt()으로 글자의 유니코드 값을 가져옴
            const charCode = inputString.charCodeAt(i);

            // 16진수로 변환하고, 4자리로 맞추기 위해 '0'을 채움
            // 예시: '안' -> 50504 -> C548
            const hex = charCode.toString(16).toUpperCase().padStart(4, '0');

            // 최종 결과에 \u와 함께 추가
            result += `\\u${hex}`;
        }

        return result;
    };

    return (
        <div className={'flex flex-col min-h-screen'}>
            <ToastContainer
                position={'top-center'}
                autoClose={3000}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                theme={'dark'}
            />
            <Header icon={<FiPlus />}>서버 추가</Header>
            <div className={'flex flex-row justify-end flex-2/6'}>
                <ConfigProvider
                    theme={{
                        algorithm: darkAlgorithm,
                        token: {
                            colorPrimary: '#FF8904',
                        },
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
                    <div className={'ml-10 mt-20'}>
                        <Steps
                            direction={'vertical'}
                            items={[
                                {
                                    title: <span className={title}>서버 템플릿</span>,
                                    description: <span className={description}>서버 구동기를 설정합니다.</span>,
                                    icon: <GoRepoTemplate className={'ml-[3px] '} />,
                                },
                                {
                                    title: <span className={title}>저장 위치 설정</span>,
                                    description: (
                                        <span className={description}>서버를 어느 곳에 저장할지 설정합니다.</span>
                                    ),
                                    icon: <IoSaveOutline className={'ml-[3.5px] mt-1'} />,
                                },
                                {
                                    title: <span className={title}>공개 설정</span>,
                                    description: (
                                        <span className={description}>서버를 어떻게 공개할지 설정합니다.</span>
                                    ),
                                    icon: <TbWorldUpload className={'ml-[3.5px] mt-1'} />,
                                },
                                {
                                    title: <span className={title}>추가 설정</span>,
                                    description: (
                                        <span className={description}>서버의 부가적인 내용을 설정합니다.</span>
                                    ),
                                    icon: <BsClipboardPlus className={'ml-[3.5px] mt-1'} />,
                                },
                                {
                                    title: <span className={title}>완료</span>,
                                    icon: <IoCheckmark className={'ml-[3.5px] mt-1'} />,
                                },
                            ]}
                            current={server.step}
                        />
                    </div>
                    {/*모달 정의*/}
                    <Loading loadingState={loading} />
                    <Modal
                        width={800}
                        title={<span className={'font-SeoulNamsanM text-[1.2rem]'}>라이선스 경고</span>}
                        open={dialogOpen}
                        closable={false}
                        okButtonProps={{ disabled: !checked }}
                        okText={<span className={'font-suite'}>동의</span>}
                        cancelText={<span className={'font-suite'}>취소</span>}
                        onCancel={() => setDialogOpen(false)}
                        onOk={sendCreateRequest}
                        centered>
                        <div className={'font-suite text-[1rem] mt-5'}>{dialogTitle}</div>
                        <div
                            className={
                                'w-full mt-5 p-2 bg-gray-900 text-white font-mono border-gray-600 border-1 rounded-[5px] h-130 mb-5 overflow-y-auto flex flex-col text-left'
                            }>
                            {dialogMessage}
                        </div>
                        <div className={'flex flex-row absolute mt-1.5 pl-0.5'}>
                            <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                            <span
                                className={'font-suite text-[0.9rem] ml-3 cursor-pointer'}
                                onClick={() => setChecked((prev) => !prev)}>
                                위 내용을 읽고 확인하였으며, 이에 동의합니다.
                            </span>
                        </div>
                    </Modal>
                    <Modal
                        width={600}
                        title={
                            <div className={'flex flex-col'}>
                                <div className={'flex flex-row items-center'}>
                                    <MdError size={20} className={'mb-0.5 text-red-400'} />
                                    <span className={'ml-2 font-SeoulNamsanM text-[1.2rem]'}>오류</span>
                                </div>
                                <span className={'font-suite font-light text-gray-300 text-[0.9rem]'}>
                                    생성 동작 중 오류가 발생하였습니다. 계속될 시 개발자에게 문의해 주십시오.
                                </span>
                            </div>
                        }
                        open={errorDialogOpen}
                        closable={false}
                        footer={[
                            <span
                                className={
                                    'font-suite text-[1rem] bg-orange-400 pl-3 pr-3 pt-2 pb-2 rounded-[5px] transition-colors duration-250 cursor-pointer hover:bg-orange-500'
                                }
                                onClick={() => setErrorDialogOpen(false)}>
                                확인
                            </span>,
                        ]}
                        centered>
                        <div className={'bg-[#030C4A] border-gray-600 p-2 font-mono border-2 rounded-[5px]'}>
                            {errormsg}
                        </div>
                    </Modal>
                </ConfigProvider>
                <div className={'flex flex-col min-h-full flex-4/6'}>
                    {/*Form*/}
                    <div className={'flex-1 transition-opacity duration-150 '} style={{ opacity }}>
                        {formList[server.step]}
                    </div>
                    {/*버튼*/}
                    {/*크기가 유동적으로 변하므로 div로 따로 관리*/}
                    <div className={'flex flex-row w-[100%] justify-start pr-20 mt-10 mb-10'}>
                        <div className={'w-[70%] ml-40'}>
                            <span
                                className={clsx(
                                    'flex flex-row transition-colors duration-150 items-center justify-center p-3 w-20 font-suite rounded-[7px]',
                                    server.pageStatus === 'full-left'
                                        ? 'bg-[#292929]'
                                        : 'bg-orange-400 hover:bg-orange-500 cursor-pointer',
                                )}
                                onClick={() => {
                                    if (server.step >= 1) {
                                        setOpacity(0);
                                        setTimeout(() => {
                                            void setServer((prev) => ({
                                                ...prev,
                                                pageStatus: prev.step === 1 ? 'full-left' : 'center',
                                                step: prev.step - 1,
                                            }));
                                            setOpacity(1);
                                        }, 150);
                                    }
                                }}>
                                <IoIosArrowBack className={'text-[1.2rem] mt-0.2'} />
                                이전
                            </span>
                        </div>

                        {/*다음/서버생성 버튼*/}
                        <div className={'flex justify-end w-[20%]'}>
                            <span
                                className={clsx(
                                    'flex flex-row transition-all duration-150 items-center justify-center p-3 w-20 font-suite rounded-[7px] text-nowrap',
                                    server.pageStatus === 'full-right'
                                        ? 'w-30 form_last_button'
                                        : 'bg-orange-400 hover:bg-orange-500',
                                    'cursor-pointer',
                                )}
                                onClick={async () => {
                                    /*
                                [버튼을 누를 때]
                                currentStep이 3 이하인가?
                                    -> 페이지를 넘길 때 필요한 조건이 있는가?
                                         -> 조건 확인, 통과하였는가?
                                              -> <페이지 넘기기>
                                         -> 통과하지 않았는가?
                                              -> 실패 toast 띄우기
                                    -> 조건이 없는가?
                                         -> <페이지 넘기기>
                                currentPage이 4(마지막 페이지)인가?
                                    -> <서버 생성>
                                 */
                                    if (server.step <= 3) {
                                        // 페이지 넘기기 조건 확인
                                        let isPassed = true;
                                        const formCheckList = await getFormCheckList();
                                        if (formCheckList[formList[server.step].type.name]) {
                                            // 만약 넘기는 데에 조건이 있다면
                                            const conditions = formCheckList[formList[server.step].type.name]; // 2차원 배열
                                            for (const condition of conditions) {
                                                isPassed = true;
                                                // 검사
                                                condition.forEach((item) => {
                                                    if (
                                                        item === undefined ||
                                                        item === null ||
                                                        item === '' ||
                                                        item === false ||
                                                        parseInt(item) === 0
                                                    )
                                                        isPassed = false;
                                                });

                                                // 어차피 OR게이트이므로 isPassed == true이면 더 이상 검사 할 필요가 없음
                                                if (isPassed) break;
                                            }
                                        }

                                        if (isPassed) {
                                            setOpacity(0);
                                            setTimeout(() => {
                                                void setServer((prev) => ({
                                                    ...prev,
                                                    pageStatus: prev.step === 3 ? 'full-right' : 'center',
                                                    step: prev.step + 1,
                                                }));
                                                setOpacity(1);
                                            }, 150);
                                        } else {
                                            // 일부 입력란을 채우지 않음
                                            toast.error(
                                                <span className={'font-suite text-[0.9rem]'}>
                                                    일부 입력란이 비워져 있거나 잘못되었습니다.
                                                </span>,
                                            );
                                        }
                                    } else if (server.step === 4) {
                                        // 라이선스 출력
                                        if (!server.custom) {
                                            const licenseName = (
                                                <span className={'font-bold'}>
                                                    {getRunnerLicense(server.runner[0]).name}
                                                </span>
                                            );
                                            const license = getRunnerLicense(server.runner[0]).content.split('\n');
                                            const licenseToPrint = [];

                                            license.map((item, i) => {
                                                licenseToPrint.push(item);
                                                licenseToPrint.push(<span key={i} className={'w-full'}></span>);
                                            });

                                            // 체크박스 초기화
                                            setChecked(false);

                                            setDialogTitle(
                                                <>
                                                    선택하신 <span className={'font-bold'}>{server.runner[0]}</span>{' '}
                                                    구동기는 {licenseName} 라이선스를 사용합니다. 이 구동기를 다운로드
                                                    받고 서버를 구동하려면 아래 라이선스 내용에 동의하여야 합니다.
                                                </>,
                                            );
                                            setDialogMessage(licenseToPrint);
                                            setDialogOpen(true);
                                        }
                                    }
                                }}>
                                {server.pageStatus === 'full-right' ? '서버 생성' : '다음'}
                                <IoIosArrowForward className={'text-[1.2rem] mt-0.2'} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
