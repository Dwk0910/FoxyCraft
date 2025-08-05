
export default function Header({ icon, children }) {
    return (
        <div className={"flex flex-row items-center border-orange-400 border-b-2 mt-10 ml-5 mr-10 pb-3 pl-5"}>
            <span className={"text-3xl"}>{ icon }</span>
            <span className={"ml-5 text-2xl mt-1.5 font-SeoulNamsanB"}>{ children }</span>
        </div>
    );
}