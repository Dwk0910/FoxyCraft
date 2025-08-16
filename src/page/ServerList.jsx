
import $ from 'jquery';

// component
import Loading from '../component/Loading';

// store & native
import { menuContext } from '../App';
import { useState, useEffect, useContext } from 'react';
import { useAtom } from 'jotai';
import { currentServerAtom } from '../jotai/serverListAtom';

export default function ServerList() {
    const backendport = localStorage.getItem('backend');
    const [ serverMap, setServerMap ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ currentServer, setCurrentServer ] = useAtom(currentServerAtom);

    const { menu } = useContext(menuContext);

    useEffect(() => {
        setLoading(true);

        // 서버 리스트 불러오기
        $.ajax({
            url: `http://localhost:${backendport}/servercrud/get`,
            contentType: 'application/json',
            type: 'POST',
            success: resp => {
                setServerMap(resp);
                setLoading(false);
            },
            error: err => {
                console.error(err);
            }
        });
    }, [menu]);

    // 로딩중이면 원초적으로 렌더링 안되게 막아야함
    if (loading) return <Loading loadingState={loading} />

    const Content = () => {
        if (currentServer) {
            return (
                <span className={"font-suite"}>{ serverMap[currentServer].name }</span>
            );
        } else {
            let result = [];
            for (const key in serverMap) {
                const item = serverMap[key];
                result.push(<span key={key}>{item.name},</span>);
            }
            return result;
        }
    };

    return (
        <div className={"flex min-h-screen justify-center items-center text-3xl bold"}>
            <Content/>
        </div>
    );
};
