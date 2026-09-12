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
export type Notice = {
    kind: 'success' | 'warning' | 'error';
    text: string;
};
export type ActionReceipt =
    | { ok: true; state: State }
    | { ok: false; error: string };
type ActOptions = { success: string };
const Context = createContext<{
    state: State;
    act: (a: Action, options?: ActOptions) => ActionReceipt;
    notice: Notice | null;
    dismissNotice: () => void;
    reset: () => ActionReceipt;
} | null>(null);

function defaultSuccess(action: Action): string {
    switch (action.type) {
        case 'replace':
            return 'Данные обновлены.';
        case 'create':
            return `Заказ ${action.order.id} создан.`;
        case 'decision':
            return 'Решение по предложению сохранено.';
        case 'cancel':
            return `Заказ ${action.id} отменён.`;
        case 'issue':
            return 'Обращение отправлено менеджеру.';
        case 'supply':
            return 'Поставка сохранена.';
        case 'connect':
            return 'Запрос компании обновлён.';
        case 'profile':
            return 'Профиль сохранён.';
        default: {
            const exhaustive: never = action;
            return exhaustive;
        }
    }
}

export function Store({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, undefined, seed);
    const ref = useRef(state);
    const [ready, setReady] = useState(false);
    const [notice, setNotice] = useState<Notice | null>(null);
    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) {
                const data = restore(raw);
                ref.current = data;
                dispatch({ type: 'replace', state: data });
            }
        } catch {
            setNotice({
                kind: 'warning',
                text: 'Не удалось восстановить сохранение. Загружены демоданные.',
            });
        }
        setReady(true);
    }, []);
    useEffect(() => {
        if (!notice) return;
        const timeout = window.setTimeout(() => setNotice(null), 4000);
        return () => window.clearTimeout(timeout);
    }, [notice]);
    function act(a: Action, options?: ActOptions): ActionReceipt {
        try {
            const next = reducer(ref.current, a);
            ref.current = next;
            dispatch({ type: 'replace', state: next });
            try {
                localStorage.setItem(KEY, JSON.stringify(next));
                setNotice({
                    kind: 'success',
                    text: options?.success ?? defaultSuccess(a),
                });
            } catch {
                setNotice({
                    kind: 'warning',
                    text: 'Изменение применено, но оно действует только в этой вкладке или сессии.',
                });
            }
            return { ok: true, state: next };
        } catch (e) {
            const error =
                e instanceof Error
                    ? e.message
                    : 'Не удалось выполнить действие.';
            setNotice({ kind: 'error', text: error });
            return { ok: false, error };
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
                notice,
                dismissNotice: () => setNotice(null),
                reset: () =>
                    act(
                        { type: 'replace', state: seed() },
                        { success: 'Демоданные восстановлены.' }
                    ),
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
