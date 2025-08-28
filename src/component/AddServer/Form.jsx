import { ConfigProvider, theme } from 'antd';

export default function Form({ title, children }) {
    const { darkAlgorithm } = theme;
    return (
        <div className={'w-full flex flex-col items-center mt-10 pl-10 pr-10'}>
            <ConfigProvider
                theme={{
                    algorithm: darkAlgorithm,
                    token: {
                        colorPrimary: '#FF8904',
                        colorBgBase: '#2a2a2a',
                    },
                }}>
                <span className={'text-left w-full font-SeoulNamsanM text-2xl ml-6 mb-7'}>{title}</span>
                {children}
            </ConfigProvider>
        </div>
    );
}
