
import { Input } from "antd";

// component
import Form from "../../../component/AddServer/Form";

export default function Template() {
    return (
        <Form>
            <Input size="large" style={{ height: '50px', width: '750px' }} placeholder={"서버 이름을 입력해 주세요."}/>
            Hello, World!
        </Form>
    );
}
