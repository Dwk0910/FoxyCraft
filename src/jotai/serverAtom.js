
import { atom } from 'jotai';

export const serverAtom = atom({
    name: "",
    dir: "",
    runner: "",
    port: 25565,
    custom: false,
    additional: []
});