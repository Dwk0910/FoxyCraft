
import { atom } from 'jotai';

export const serverAtom = atom({
    name: "",
    path: "",
    runner: "",
    port: 25565,
    custom: false,
    custom_jre: "",
    custom_runner_path: "",
    additional: []
});