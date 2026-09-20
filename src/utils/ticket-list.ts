import type { Ticket } from '@/data/types';

export type TicketFilter = 'default' | 'cheap' | 'fast' | 'recumbent';

export type TicketGroups = {
    current: Ticket[];
    history: Ticket[];
};

const getTimestamp = (date: string | null, time: string | null) => {
    if (!date || !time) {
        return null;
    }

    const timestamp = new Date(`${date}T${time}+05:00`).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
};

const getTravelDuration = (ticket: Ticket) => {
    const departure = getTimestamp(ticket.from_date, ticket.from_time);
    const arrival = getTimestamp(ticket.to_date, ticket.to_time);

    if (departure === null || arrival === null || arrival < departure) {
        return Number.POSITIVE_INFINITY;
    }

    return arrival - departure;
};

const getArrivalTimestamp = (ticket: Ticket) =>
    getTimestamp(ticket.to_date, ticket.to_time) ??
    getTimestamp(ticket.from_date, ticket.from_time);

export const filterTickets = (
    tickets: readonly Ticket[],
    filter: TicketFilter
): Ticket[] => {
    if (filter === 'recumbent') {
        return tickets.filter((ticket) => ticket.bus.is_recumbent);
    }

    if (filter === 'cheap') {
        return [...tickets].sort(
            (left, right) => Number(left.price) - Number(right.price)
        );
    }

    if (filter === 'fast') {
        return [...tickets].sort(
            (left, right) => getTravelDuration(left) - getTravelDuration(right)
        );
    }

    return [...tickets];
};

export const partitionTickets = (
    tickets: readonly Ticket[],
    now = new Date()
): TicketGroups => {
    const current: Ticket[] = [];
    const history: Ticket[] = [];

    for (const ticket of tickets) {
        const arrival = getArrivalTimestamp(ticket);
        const isPast = arrival !== null && arrival < now.getTime();

        if (
            ticket.status === 'Refunded' ||
            ticket.status === 'Expired' ||
            isPast
        ) {
            history.push(ticket);
        } else {
            current.push(ticket);
        }
    }

    current.sort(
        (left, right) =>
            (getArrivalTimestamp(left) ?? Number.POSITIVE_INFINITY) -
            (getArrivalTimestamp(right) ?? Number.POSITIVE_INFINITY)
    );
    history.sort(
        (left, right) =>
            (getArrivalTimestamp(right) ?? Number.NEGATIVE_INFINITY) -
            (getArrivalTimestamp(left) ?? Number.NEGATIVE_INFINITY)
    );

    return { current, history };
};
