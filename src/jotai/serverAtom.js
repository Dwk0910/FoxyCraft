
import $ from 'jquery';
import { atom } from 'jotai';

const baseServerAtom = atom({
    name: "",
    path: "",
    runner: [],
    port: 25565,
    custom: false,
    custom_jre: "",
    custom_runner_file: [],
    custom_runner_path: "",
    additional: []
});

export const serverAtom = atom(get => get(baseServerAtom), async (get, set, newServer) => {
    const prev = get(baseServerAtom);

    // custom이 true에서 false로 바뀐 경우
    try {
        if (prev.custom === true && newServer.custom === false) {
            const file = prev.custom_runner_file[0].originFileObj;
            const formData = new FormData();
            formData.append("file", file);

            const backendport = localStorage.getItem("backend");

            if (file) {
                await $.ajax({
                    url: `http://localhost:${backendport}/fileio/cancel`,
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                });
            }

            newServer = {
                ...newServer,
                custom_runner_file: [],
                custom_runner_path: ""
            };
        }
    } catch (ignored) {} // undefined이면 무시

    set(baseServerAtom, newServer);
});
