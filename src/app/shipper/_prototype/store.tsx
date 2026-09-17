'use client';

import {
    createContext,
    useContext,
    useRef,
    useState,
    type ReactNode,
} from 'react';

import { shipperCommandAction } from '@/actions/cargo';
import type { Issue, Order, Profile, State } from './model';

type Action =
    | { type: 'create'; order: Order }
    | { type: 'decision'; id: string; extra: boolean; accept: boolean }
    | { type: 'cancel'; id: string }
    | { type: 'issue'; id: string; issue: Issue }
    | { type: 'connect'; id: string }
    | { type: 'profile'; profile: Profile };

const Context = createContext<{
    state: State;
    act: (action: Action) => Promise<boolean>;
    message: string;
} | null>(null);

export function Store({
    children,
    initialState,
}: {
    children: ReactNode;
    initialState: State;
}) {
    const [state, setState] = useState(initialState);
    const [message, setMessage] = useState('');
    const busy = useRef(false);

    async function act(action: Action) {
        if (busy.current) return false;
        busy.current = true;
        setMessage('Сохраняем…');

        try {
            let response;
            if (action.type === 'connect') {
                response = await shipperCommandAction({
                    type: 'request-relation',
                    companyId: Number(action.id),
                });
            } else if (action.type === 'create') {
                response = await shipperCommandAction({
                    type: 'create-order',
                    companyId: Number(action.order.companyId),
                    from: action.order.from,
                    to: action.order.to,
                    pickup: action.order.pickup,
                    date: action.order.date,
                    cargo: action.order.cargo,
                    quantity: action.order.quantity,
                    unit: action.order.unit,
                    weight:
                        action.order.weight === undefined
                            ? undefined
                            : String(action.order.weight),
                    dimensions: action.order.dimensions,
                    comment: action.order.comment,
                });
            } else if (action.type === 'decision') {
                const order = state.orders.find(
                    (item) => item.id === action.id
                );
                const offer = action.extra ? order?.extra : order?.offer;
                if (!order?.recordId || !offer?.id) {
                    throw new Error('Предложение не найдено');
                }
                response = await shipperCommandAction({
                    type: 'decide-offer',
                    orderId: order.recordId,
                    offerId: Number(offer.id),
                    decision: action.accept ? 'accept' : 'decline',
                });
            } else if (action.type === 'cancel') {
                const order = state.orders.find(
                    (item) => item.id === action.id
                );
                if (!order?.recordId) throw new Error('Заказ не найден');
                response = await shipperCommandAction({
                    type: 'cancel-order',
                    orderId: order.recordId,
                });
            } else if (action.type === 'issue') {
                const order = state.orders.find(
                    (item) => item.id === action.id
                );
                if (!order?.recordId) throw new Error('Заказ не найден');
                response = await shipperCommandAction({
                    type: 'report-incident',
                    orderId: order.recordId,
                    text: action.issue.text,
                });
            } else if (action.type === 'profile') {
                response = await shipperCommandAction({
                    type: 'update-profile',
                    fullName: action.profile.name,
                    companyName: action.profile.company,
                    binIin: action.profile.bin,
                    city: action.profile.city,
                    notifications: action.profile.notifications,
                });
            }

            if (!response) throw new Error('Неизвестная команда');
            if (response.ok === false) throw new Error(response.error);
            setState(response.data);
            setMessage('Изменения сохранены на сервере.');
            return true;
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : 'Не удалось выполнить действие.'
            );
            return false;
        } finally {
            busy.current = false;
        }
    }

    return (
        <Context.Provider value={{ state, act, message }}>
            {children}
        </Context.Provider>
    );
}

export function useStore() {
    const value = useContext(Context);
    if (!value) throw new Error('Shipper Store отсутствует');
    return value;
}
