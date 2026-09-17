import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { Ticket } from '@/data/types';
import { filterTickets, partitionTickets } from './ticket-list';

const makeTicket = (overrides: Partial<Ticket> = {}): Ticket => ({
    id: 1,
    from_point: { id: 1, name: 'Алматы' },
    from_bus_station: {
        id: 1,
        name: 'Сайран',
        latitude: '43.234',
        longitude: '76.889',
    },
    from_date: '2026-09-20',
    from_time: '10:00',
    to_point: { id: 2, name: 'Шымкент' },
    to_bus_station: {
        id: 2,
        name: 'Самал',
        latitude: '42.341',
        longitude: '69.590',
    },
    to_date: '2026-09-20',
    to_time: '20:00',
    price: '12000.00',
    free_places_count: 10,
    bus: {
        have_toilet: false,
        have_wifi: true,
        is_recumbent: false,
    },
    taxi_park: 'Jol Express',
    status: 'Payed',
    ...overrides,
});

test('sorts tickets by numeric price without mutating the source list', () => {
    const tickets = [
        makeTicket({ id: 1, price: '12000.00' }),
        makeTicket({ id: 2, price: '9500.00' }),
    ];

    assert.deepEqual(
        filterTickets(tickets, 'cheap').map((ticket) => ticket.id),
        [2, 1]
    );
    assert.deepEqual(
        tickets.map((ticket) => ticket.id),
        [1, 2]
    );
});

test('sorts overnight trips by their full travel duration', () => {
    const tickets = [
        makeTicket({
            id: 1,
            from_date: '2026-09-20',
            from_time: '22:00',
            to_date: '2026-09-21',
            to_time: '08:00',
        }),
        makeTicket({
            id: 2,
            from_date: '2026-09-20',
            from_time: '23:00',
            to_date: '2026-09-21',
            to_time: '05:00',
        }),
    ];

    assert.deepEqual(
        filterTickets(tickets, 'fast').map((ticket) => ticket.id),
        [2, 1]
    );
});

test('shows only buses with recumbent seats', () => {
    const tickets = [
        makeTicket({ id: 1 }),
        makeTicket({
            id: 2,
            bus: {
                have_toilet: false,
                have_wifi: false,
                is_recumbent: true,
            },
        }),
    ];

    assert.deepEqual(
        filterTickets(tickets, 'recumbent').map((ticket) => ticket.id),
        [2]
    );
});

test('separates past and refunded tickets from current tickets', () => {
    const tickets = [
        makeTicket({ id: 1, to_date: '2026-09-16', to_time: '20:00' }),
        makeTicket({ id: 2, status: 'Refunded' }),
        makeTicket({ id: 3, to_date: '2026-09-18', to_time: '20:00' }),
    ];

    const result = partitionTickets(tickets, new Date(2026, 8, 17, 12));

    assert.deepEqual(
        result.history.map((ticket) => ticket.id),
        [2, 1]
    );
    assert.deepEqual(
        result.current.map((ticket) => ticket.id),
        [3]
    );
});


test('classifies a completed Kazakhstan trip independently of the browser timezone', () => {
    const ticket = makeTicket({ to_date: '2026-09-20', to_time: '12:00' });
    const result = partitionTickets([ticket], new Date('2026-09-20T07:01:00Z'));
    assert.equal(result.history.length, 1);
    assert.equal(result.current.length, 0);
});
