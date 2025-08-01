import React from 'react';
import { Server, Plus, Settings, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// 이 코드를 App.jsx 파일에 붙여넣으면 됩니다.
// Tailwind CSS가 적용되어 있어야 제대로 동작합니다.
export default function Test() {
    const navigate = useNavigate();
    return (
        // 전체 화면 컨테이너 (flex row)
        <div className="flex flex-row min-h-screen bg-gray-950 text-gray-100">

            {/*
              사이드바 컨테이너
              - flex: Flexbox 컨테이너
              - transition: 너비(width)가 0.5초 동안 부드럽게 변하도록 설정
              - w-20: 기본 너비를 20(5rem)으로 설정 (아이콘만 보이게)
              - hover:w-60: 마우스를 올리면 너비를 60(15rem)으로 늘림
            */}
            <div className="
                flex flex-col flex-shrink-0
                transition-all duration-500 ease-in-out
                w-20
                hover:w-60
                bg-gray-900 border-r border-gray-700
                overflow-hidden
                group
            ">
                <header className="flex items-center justify-center h-20" onClick={() => {navigate('/')}}>
                    <img src="/assets/images/icon.png" className="h-10" alt="logo" />
                </header>

                {/*
                  사이드바 메뉴 영역
                  - overflow-hidden: 글씨가 넘치면 숨기기
                */}
                <nav className="flex-1 overflow-y-auto">
                    <a href="#" className="flex items-center space-x-4 p-4 text-gray-300 hover:bg-gray-800 transition-colors duration-200">
                        <Server className="w-6 h-6" />
                        {/*
                          - opacity-0: 기본적으로는 투명하게
                          - group-hover:opacity-100: 부모 컨테이너에 마우스를 올리면 보이게
                        */}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out whitespace-nowrap">서버 목록</span>
                    </a>
                    <a href="#" className="flex items-center space-x-4 p-4 text-gray-300 hover:bg-gray-800 transition-colors duration-200">
                        <Plus className="w-6 h-6" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out whitespace-nowrap">서버 추가</span>
                    </a>
                    <a href="#" className="flex items-center space-x-4 p-4 text-gray-300 hover:bg-gray-800 transition-colors duration-200">
                        <Settings className="w-6 h-6" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out whitespace-nowrap">설정</span>
                    </a>
                </nav>

                {/* 하단 로그아웃 버튼 */}
                <footer className="h-20 flex items-center justify-center p-4">
                    <button className="flex items-center justify-center space-x-4 w-full p-2 text-red-400 hover:bg-gray-800 transition-colors duration-200">
                        <LogOut className="w-6 h-6" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out whitespace-nowrap">로그아웃</span>
                    </button>
                </footer>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 p-10">
                <h1 className="text-4xl font-bold">FoxyCraft</h1>
                <p className="mt-2 text-lg text-gray-400">마인크래프트 서버를 관리하세요.</p>
                {/* 여기에 다른 컴포넌트를 추가하면 됩니다. */}
            </div>
        </div>
    );
}
