
import $ from 'jquery';

// component
import Loading from '../component/Loading';

// store & native
import { menuContext } from '../App';
import { useState, useEffect, createContext, useContext } from 'react';

export default function ServerList() {
    const backendport = localStorage.getItem('backend');
    const [ currentServer, setCurrentServer ] = useState(null);
    const [ serverList, setServerList ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const { menu } = useContext(menuContext);

    useEffect(() => {
        setLoading(true);

        // 서버 리스트 불러오기
        $.ajax({
            url: `http://localhost:${backendport}/servercrud/get`,
            contentType: 'application/json',
            type: 'POST',
            success: resp => {
                setServerList(resp);
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
                <serverContext.Provider value={{ setCurrentServer }}>
                    <span className={"font-suite"}>{ serverList[currentServer].name }</span>
                </serverContext.Provider>
            );
        } else {
            let result = [];
            for (const item of serverList) {
                result.push(<span key={item["UUID"]}>{item.name},</span>);
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

export const serverContext = createContext(null);
