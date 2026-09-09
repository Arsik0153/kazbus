export type Unit = 'шт.' | 'коробок' | 'паллет' | 'кг' | 'т';
export type Contact = { name: string; role: string; phone: string };
export type Company = {
    id: string;
    name: string;
    city: string;
    description: string;
    relation: 'confirmed' | 'requested' | 'available';
    phone: string;
};
export type Stage = {
    id: string;
    from: string;
    to: string;
    transport: string;
    status: 'done' | 'current' | 'next';
    date: string;
    contacts: Contact[];
};
export type Offer = {
    amount: number;
    eta: string;
    reason: string;
    status: 'pending' | 'accepted' | 'declined';
    kind: 'initial' | 'extra';
};
export type Attachment = { id: string; name: string };
export type Issue = {
    id: string;
    text: string;
    date: string;
    files: Attachment[];
};
export type Invoice = { number: string; amount: number; paid: boolean };
export type OrderStatus =
    | 'waiting'
    | 'offer'
    | 'planned'
    | 'transit'
    | 'delivered'
    | 'cancelled'
    | 'rejected';
export type Order = {
    id: string;
    companyId: string;
    from: string;
    to: string;
    pickup: string;
    date: string;
    cargo: string;
    quantity: number;
    unit: Unit;
    weight?: string;
    dimensions?: string;
    comment: string;
    status: OrderStatus;
    stages: Stage[];
    offer?: Offer;
    extra?: Offer;
    agreedPrice?: number;
    invoice?: Invoice;
    delay?: string;
    originalEta?: string;
    updated: string;
    proof?: string;
    files: Attachment[];
    issues: Issue[];
    supplyId?: string;
    occurrence?: string;
    batchId?: string;
};
export type Supply = {
    id: string;
    title: string;
    companyId: string;
    from: string;
    to: string;
    fromCity?: string;
    toCity?: string;
    cargo: string;
    quantity: number;
    unit: Unit;
    mode: 'manual' | 'weekly' | 'monthly';
    weekdays: number[];
    monthDay: number;
    automatic: boolean;
    paused: boolean;
    skipped: string[];
    price: number;
    approved: boolean;
};
export type Batch = {
    id: string;
    companyId: string;
    warehouse: string;
    cargo: string;
    unit: Unit;
    onHand: number;
    baseReserved: number;
    source: string;
};
export type Profile = {
    name: string;
    company: string;
    phone: string;
    city: string;
    bin: string;
    notifications: boolean;
};
export type State = {
    version: 1;
    orders: Order[];
    companies: Company[];
    supplies: Supply[];
    batches: Batch[];
    profile: Profile;
};
export const statuses: Record<OrderStatus, string> = {
    waiting: 'Ждёт предложения',
    offer: 'На согласовании',
    planned: 'Запланирован',
    transit: 'В пути',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
    rejected: 'Отклонён компанией',
};
export const units: Unit[] = ['шт.', 'коробок', 'паллет', 'кг', 'т'];
export const money = (n: number) =>
    new Intl.NumberFormat('ru-RU').format(n) + ' ₸';
export const dateLabel = (s: string) =>
    new Date(s.length === 10 ? s + 'T12:00:00' : s).toLocaleDateString(
        'ru-RU',
        { day: 'numeric', month: 'short' }
    );
export const localDate = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export function occurrences(s: Supply, from = new Date(), count = 4): string[] {
    if (s.mode === 'manual' || s.paused) return [];
    const result: string[] = [];
    const d = new Date(from);
    d.setHours(12, 0, 0, 0);
    for (
        let i = 0;
        i < 400 && result.length < count;
        i++, d.setDate(d.getDate() + 1)
    ) {
        const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        if (
            (s.mode === 'weekly'
                ? s.weekdays.includes(d.getDay())
                : d.getDate() === Math.min(s.monthDay, last)) &&
            !s.skipped.includes(localDate(d))
        )
            result.push(localDate(d));
    }
    return result;
}
export function reserved(state: State, b: Batch) {
    return (
        b.baseReserved +
        state.orders
            .filter(
                (o) =>
                    o.batchId === b.id &&
                    !['cancelled', 'rejected', 'delivered'].includes(o.status)
            )
            .reduce((n, o) => n + o.quantity, 0)
    );
}
