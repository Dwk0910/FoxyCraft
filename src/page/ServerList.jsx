
import $ from 'jquery';

// component
import Loading from '../component/Loading';

// store & native
import { MenuContext } from '../App';
import { useState, useEffect, useContext } from 'react';

export default function ServerList() {
    const backendport = localStorage.getItem('backend');
    const [ currentServer, setCurrentServer ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const { menu } = useContext(MenuContext);

    useEffect(() => {
        // 서버 리스트 불러오기
        $.ajax({
            url: `http://localhost:${backendport}/servercrud/get`,
            contentType: 'application/json',
            type: 'POST',
            success: resp => {
                console.log(resp);
                setLoading(false);
            },
            error: err => {
                console.error(err);
            }
        });
    }, [menu])

    if (loading) return <Loading loadingState={loading} />
    else {
        return (
            <div className={"flex min-h-screen justify-center items-center text-3xl bold"}>
                ServerList
            </div>
        );
    }
};
