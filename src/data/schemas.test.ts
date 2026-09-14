import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { CombinedBookingSchema } from './schemas';

const passenger = {
    passenger: 7,
    place_num: 1,
    place_floor: 1,
};

describe('CombinedBookingSchema service date', () => {
    const datedBookings = [
        {
            direction: 42,
            service_date: '2026-09-21',
            tickets: [passenger],
        },
        {
            direction: 42,
            service_date: '2026-09-21',
            place_num: 1,
            place_floor: 1,
        },
    ];

    for (const booking of datedBookings) {
        test('accepts a dated booking', () => {
            assert.equal(
                CombinedBookingSchema.safeParse(booking).success,
                true
            );
        });
    }

    const invalidBookings = [
        { direction: 42, tickets: [passenger] },
        { direction: 42, place_num: 1, place_floor: 1 },
        {
            direction: 42,
            service_date: '2026-02-30',
            tickets: [passenger],
        },
        {
            direction: 42,
            service_date: 'not-a-date',
            place_num: 1,
            place_floor: 1,
        },
    ];

    for (const booking of invalidBookings) {
        test('rejects a missing or impossible service date', () => {
            assert.equal(
                CombinedBookingSchema.safeParse(booking).success,
                false
            );
        });
    }
});
