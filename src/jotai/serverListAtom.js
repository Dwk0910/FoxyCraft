
import { atom } from 'jotai';

const defaultObj = {
    id: "",
    menu: "console"
};

const baseAtom = atom(defaultObj);
export const currentServerAtom = atom(get => get(baseAtom), (get, set, args) => {
    if (!args.menu) args = {...args, menu: "console"};
    set(baseAtom, args);
});
