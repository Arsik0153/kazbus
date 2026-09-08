import { State, Order, Supply, Profile, Issue, reserved } from './model';
export type Action =
    | { type: 'replace'; state: State }
    | { type: 'create'; order: Order }
    | { type: 'decision'; id: string; extra: boolean; accept: boolean }
    | { type: 'cancel'; id: string }
    | { type: 'issue'; id: string; issue: Issue }
    | { type: 'supply'; supply: Supply }
    | { type: 'connect'; id: string; invited?: boolean }
    | { type: 'profile'; profile: Profile };
export function reducer(state: State, a: Action): State {
    if (a.type === 'replace') return a.state;
    if (a.type === 'profile') return { ...state, profile: a.profile };
    if (a.type === 'connect')
        return {
            ...state,
            companies: state.companies.map((c) =>
                c.id === a.id && c.relation !== 'confirmed'
                    ? { ...c, relation: a.invited ? 'confirmed' : 'requested' }
                    : c
            ),
        };
    if (a.type === 'supply')
        return {
            ...state,
            supplies: state.supplies.some((s) => s.id === a.supply.id)
                ? state.supplies.map((s) =>
                      s.id === a.supply.id ? a.supply : s
                  )
                : [...state.supplies, a.supply],
        };
    if (a.type === 'create') {
        const o = a.order;
        if (state.orders.some((x) => x.id === o.id))
            throw Error('Этот заказ уже создан.');
        if (
            !state.companies.some(
                (c) => c.id === o.companyId && c.relation === 'confirmed'
            )
        )
            throw Error('Выберите подключённую компанию.');
        if (
            !Number.isFinite(o.quantity) ||
            o.quantity <= 0 ||
            !o.cargo.trim() ||
            !o.from.trim() ||
            !o.to.trim() ||
            !o.pickup ||
            !o.date ||
            o.date < o.pickup
        )
            throw Error('Проверьте груз, количество, адреса и даты.');
        if (
            o.supplyId &&
            o.occurrence &&
            state.orders.some(
                (x) =>
                    x.supplyId === o.supplyId && x.occurrence === o.occurrence
            )
        )
            throw Error(
                'Заказ на эту дату уже создан. Откройте его в списке заказов.'
            );
        if (o.batchId) {
            const b = state.batches.find((b) => b.id === o.batchId);
            if (
                !b ||
                b.companyId !== o.companyId ||
                o.quantity > b.onHand - reserved(state, b)
            )
                throw Error('Недостаточно доступного груза на складе.');
        }
        return { ...state, orders: [o, ...state.orders] };
    }
    return {
        ...state,
        orders: state.orders.map((o) => {
            if (o.id !== a.id) return o;
            if (a.type === 'issue')
                return { ...o, issues: [...o.issues, a.issue] };
            if (a.type === 'cancel') {
                if (!['waiting', 'offer', 'planned'].includes(o.status))
                    throw Error(
                        'Отмена недоступна. Свяжитесь с менеджером заказа.'
                    );
                return { ...o, status: 'cancelled' };
            }
            const offer = a.extra ? o.extra : o.offer;
            if (
                !offer ||
                offer.status !== 'pending' ||
                ['cancelled', 'rejected', 'delivered'].includes(o.status)
            )
                throw Error('Предложение уже обработано или заказ закрыт.');
            if (a.extra)
                return {
                    ...o,
                    extra: {
                        ...offer,
                        status: a.accept ? 'accepted' : 'declined',
                    },
                };
            return {
                ...o,
                offer: { ...offer, status: a.accept ? 'accepted' : 'declined' },
                status: a.accept ? 'planned' : 'waiting',
                agreedPrice: a.accept ? offer.amount : undefined,
                date: a.accept ? offer.eta : o.date,
                invoice: a.accept
                    ? {
                          number: `СЧ-${o.id}`,
                          amount: offer.amount,
                          paid: false,
                      }
                    : undefined,
            };
        }),
    };
}
