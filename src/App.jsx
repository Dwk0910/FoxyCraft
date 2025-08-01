export default function App() {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row bg-gray-700 border-b-2 border-gray-600 min-h-20">
                <header className={"flex items-center"}>
                    <img src="/assets/images/icon.ico" className="h-14" alt="logo"/>
                    <span className={"text-3xl text-gray-300"}>FoxyCraft</span>
                </header>
            </div>
            <div className="flex flex-row">
                <div>
                    LeftBar
                </div>
                <div>
                    Section:MAIN
                </div>
            </div>
        </div>
    );
}