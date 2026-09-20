import assert from 'node:assert/strict';
import { test } from 'node:test';
import { availableDirections, selectDirections, type Direction } from './model';
const make = (
    id: number,
    city: number,
    price: string,
    changes: Partial<Direction> = {}
): Direction => ({
    id,
    ticket_price: price,
    departure_time: '10:00',
    status: 'active',
    is_always_active: false,
    end_date: '2026-09-20',
    route: {
        start_city: { id: city, name: 'Город' },
        end_city: { id: 99, name: 'Другой' },
    },
    bus: { have_wifi: false, have_toilet: false, is_recumbent: false },
    ...changes,
});
test('filters by city id and sorts prices numerically without changing source', () => {
    const rows = [make(1, 1, '100'), make(2, 2, '5'), make(3, 1, '20')];
    assert.deepEqual(
        selectDirections(rows, '1', true).map((x) => x.id),
        [3, 1]
    );
    assert.deepEqual(
        rows.map((x) => x.id),
        [1, 2, 3]
    );
    assert.deepEqual(selectDirections(rows, '', false), rows);
});
test('hides ended and unavailable sales but retains permanent and final-day trips', () => {
    const rows = [
        make(1, 1, '10'),
        make(2, 1, '10', { status: 'cancelled' }),
        make(3, 1, '10', { status: 'not_on_sale' }),
        make(4, 1, '10', { end_date: '2026-09-19' }),
        make(5, 1, '10', { end_date: '2020-01-01', is_always_active: true }),
    ];
    assert.deepEqual(
        availableDirections(rows, '2026-09-20').map((x) => x.id),
        [1, 5]
    );
});
