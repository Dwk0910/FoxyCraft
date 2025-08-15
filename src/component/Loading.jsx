import { Modal } from "antd";

export default function Loading({ loadingState }) {
    return (
        <Modal
            width={300}
            closable={false}
            maskClosable={false}
            keyboard={false}
            footer={null}
            open={loadingState}
            centered
        >
            <div className={"w-full flex justify-center"}>
                <span className={"font-SeoulNamsanM text-[1rem]"}>로딩 중입니다...</span>
            </div>
        </Modal>
    );
}