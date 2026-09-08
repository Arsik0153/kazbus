'use client';
import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useRef,
    useState,
    ReactNode,
} from 'react';
import { State } from './model';
import { restore } from './persistence';
import { seed } from './seed';
import { Action, reducer } from './reducer';
const KEY = 'jol-shipper-prototype-v1';
const Context = createContext<{
    state: State;
    act: (a: Action) => boolean;
    message: string;
    reset: () => void;
} | null>(null);
export function Store({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, undefined, seed);
    const ref = useRef(state);
    const [ready, setReady] = useState(false);
    const [message, setMessage] = useState('');
    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) {
                const data = restore(raw);
                ref.current = data;
                dispatch({ type: 'replace', state: data });
            }
        } catch {
            setMessage(
                'Не удалось восстановить сохранение. Загружены демоданные.'
            );
        }
        setReady(true);
    }, []);
    function act(a: Action) {
        try {
            const next = reducer(ref.current, a);
            ref.current = next;
            dispatch({ type: 'replace', state: next });
            try {
                localStorage.setItem(KEY, JSON.stringify(next));
                setMessage('Изменения сохранены в этом браузере.');
            } catch {
                setMessage(
                    'Изменения применены, но браузер не смог сохранить их после закрытия страницы.'
                );
            }
            return true;
        } catch (e) {
            setMessage(
                e instanceof Error
                    ? e.message
                    : 'Не удалось выполнить действие.'
            );
            return false;
        }
    }
    if (!ready)
        return (
            <div className="shipper-loading" role="status">
                Загружаем кабинет…
            </div>
        );
    return (
        <Context.Provider
            value={{
                state,
                act,
                message,
                reset: () => {
                    act({ type: 'replace', state: seed() });
                },
            }}
        >
            {children}
        </Context.Provider>
    );
}
export function useStore() {
    const value = useContext(Context);
    if (!value) throw Error('Store missing');
    return value;
}
