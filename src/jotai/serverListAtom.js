import { atom } from 'jotai';

const defaultObj = {
    id: '',
    menu: 'console',
};

const baseAtom = atom(defaultObj);
export const currentServerAtom = atom(
    (get) => get(baseAtom),
    (get, set, args) => {
        const prev = get(baseAtom);
        if (!args.menu || prev.id !== args.id) args = { ...args, menu: 'console' };
        set(baseAtom, args);
    },
);

export const serverMapAtom = atom({});
export const serverStatusMapAtom = atom({});

// Console Page
export const logAtom = atom({});
