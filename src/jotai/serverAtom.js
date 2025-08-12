
import $ from 'jquery';
import { atom } from 'jotai';

const defaultObject = {
    // global
    step: 0,
    pageStatus: "full-left",

    // template
    name: "",
    custom: false,
    runner: [],
    custom_jre: "",
    custom_runner_file: [],
    custom_runner_path: "",

    // saveloc
    path: "",

    // publish
    port: 25565,
    servericon: [],
    servericon_path: "",
    motd: "A Minecraft Server",
    max_player: 20,
    online_mode: true,

    // additional
    auto_backup: false,
    auto_backup_period: 0,
    auto_backup_max_count: 0,
    custom_world_name: false,
    custom_wrold_name_err: false,
    world_name: "world"
};

const baseServerAtom = atom(defaultObject);

export const serverAtom = atom(get => get(baseServerAtom), async (get, set, newServer) => {
    const prev = get(baseServerAtom);

    // newServer가 리셋될 경우 (ResetAtom 사용했을 경우)
    if (typeof newServer === "symbol") {
        set(baseServerAtom, defaultObject);
        return;
    }

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
