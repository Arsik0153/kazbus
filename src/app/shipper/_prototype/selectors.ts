import { OrderFilters } from './order-filters';
import { Company, Offer, Order, State, Supply, occurrences } from './model';

export type CompanyConnection =
    | { kind: 'connected'; companies: Company[] }
    | { kind: 'not-connected'; availableCompanies: Company[] };

type InitialProposal = Offer & { kind: 'initial' };
type SurchargeProposal = Offer & { kind: 'extra' };

export type DecisionTask =
    | { kind: 'price'; order: Order; proposal: InitialProposal }
    | { kind: 'surcharge'; order: Order; proposal: SurchargeProposal };

export type OrderPrice =
    | { kind: 'agreed'; amount: number }
    | { kind: 'proposal'; amount: number }
    | { kind: 'pending' };

export type OrderCollection =
    | { kind: 'empty-account' }
    | { kind: 'no-matches' }
    | { kind: 'results'; orders: Order[] };

export type UpcomingSupply = { supply: Supply; date: string };

const closedStatuses = new Set<Order['status']>([
    'cancelled',
    'rejected',
    'delivered',
]);

export function selectCompanyConnection(state: State): CompanyConnection {
    const companies = state.companies.filter(
        (company) => company.relation === 'confirmed'
    );
    return companies.length
        ? { kind: 'connected', companies }
        : {
              kind: 'not-connected',
              availableCompanies: state.companies.filter(
                  (company) => company.relation !== 'confirmed'
              ),
          };
}

export function selectDecisionTasks(state: State): DecisionTask[] {
    return state.orders.flatMap((order) => {
        if (closedStatuses.has(order.status)) return [];
        const tasks: DecisionTask[] = [];
        if (order.offer?.status === 'pending') {
            tasks.push({
                kind: 'price',
                order,
                proposal: { ...order.offer, kind: 'initial' },
            });
        }
        if (order.extra?.status === 'pending') {
            tasks.push({
                kind: 'surcharge',
                order,
                proposal: { ...order.extra, kind: 'extra' },
            });
        }
        return tasks;
    });
}

export function selectOrderPrice(order: Order): OrderPrice {
    if (order.agreedPrice !== undefined) {
        return {
            kind: 'agreed',
            amount:
                order.agreedPrice +
                (order.extra?.status === 'accepted' ? order.extra.amount : 0),
        };
    }
    if (order.offer?.status === 'pending') {
        return { kind: 'proposal', amount: order.offer.amount };
    }
    return { kind: 'pending' };
}

export function orderNeedsAttention(order: Order): boolean {
    return (
        !closedStatuses.has(order.status) &&
        (order.offer?.status === 'pending' || order.extra?.status === 'pending')
    );
}

export function selectOrderCollection(
    state: State,
    filters: OrderFilters
): OrderCollection {
    if (!state.orders.length) return { kind: 'empty-account' };
    const query = filters.q.toLocaleLowerCase('ru-RU');
    const orders = state.orders.filter(
        (order) =>
            `${order.id} ${order.from} ${order.to} ${order.cargo}`
                .toLocaleLowerCase('ru-RU')
                .includes(query) &&
            (!filters.companyId || order.companyId === filters.companyId) &&
            (!filters.status || order.status === filters.status) &&
            (!filters.attentionOnly || orderNeedsAttention(order))
    );
    return orders.length ? { kind: 'results', orders } : { kind: 'no-matches' };
}

export function selectUpcomingSupplies(state: State): UpcomingSupply[] {
    return state.supplies
        .flatMap((supply) => {
            const date = occurrences(supply, new Date(), 1)[0];
            return date ? [{ supply, date }] : [];
        })
        .sort((a, b) => a.date.localeCompare(b.date));
}

export function selectDashboard(state: State) {
    return {
        decisions: selectDecisionTasks(state),
        delays: state.orders.filter(
            (order) => order.delay && !closedStatuses.has(order.status)
        ),
        active: state.orders.filter((order) =>
            ['planned', 'transit'].includes(order.status)
        ),
        unpaid: state.orders.filter(
            (order) => order.invoice && !order.invoice.paid
        ),
        supplies: selectUpcomingSupplies(state),
    };
}
