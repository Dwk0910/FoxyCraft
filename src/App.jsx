
import { Routes, Route } from 'react-router-dom';

import Test from "./page/Test";
import Main from './page/Main';

export default function App() {
    return (
        <Routes>
            <Route path={"/"} element={<Main />} index/>
            <Route path={"/test"} element={<Test/>}/>
        </Routes>
    );
}