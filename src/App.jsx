import { Server, Plus, Settings, Sparkle, LogOut } from 'lucide-react';

export default function App() {
    return (
        <div className="flex w-full h-screen font-sans bg-gray-950 text-gray-100">
            {/* 왼쪽 사이드바 (네비게이션) */}
            <aside className="w-64 p-6 bg-gray-900 border-r border-gray-700 flex flex-col justify-between">
                <div>
                    {/* 로고와 앱 이름 */}
                    <div className="flex items-center space-x-3 mb-10">
                        <Sparkle className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-2xl font-bold tracking-tight">FoxyCraft</h1>
                    </div>

                    {/* 네비게이션 링크들 */}
                    <nav className="space-y-2">
                        <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                            <Server className="w-5 h-5" />
                            <span>서버 목록</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                            <Plus className="w-5 h-5" />
                            <span>서버 추가</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                            <Settings className="w-5 h-5" />
                            <span>설정</span>
                        </a>
                    </nav>
                </div>

                {/* 로그아웃 버튼 (하단) */}
                <button className="flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>로그아웃</span>
                </button>
            </aside>

            {/* 메인 콘텐츠 영역 */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold">서버 목록</h2>
                    <p className="mt-2 text-gray-400">마인크래프트 서버를 관리하고 제어하세요.</p>
                </header>

                <section className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">현재 서버</h3>
                    <p className="text-gray-400">
                        아직 서버가 없네요. "서버 추가" 버튼을 눌러 새 서버를 만들어보세요!
                    </p>
                </section>
            </main>
        </div>
    );
}