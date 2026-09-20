import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    occurrences,
    reserved,
    type Batch,
    type State,
    type Supply,
} from './model';

const supply: Supply = {
    id: '4',
    title: 'Поставка',
    companyId: '2',
    from: 'Алматы',
    to: 'Шымкент',
    cargo: 'Посуда',
    quantity: 20,
    unit: 'коробок',
    mode: 'weekly',
    weekdays: [1, 4],
    monthDay: 1,
    automatic: false,
    paused: false,
    skipped: [],
    price: 0,
    approved: false,
};

test('weekly occurrences use JavaScript weekdays and omit skipped dates', () => {
    const dates = occurrences(
        { ...supply, skipped: ['2026-09-21'] },
        new Date('2026-09-17T12:00:00'),
        3
    );

    assert.deepEqual(dates, ['2026-09-17', '2026-09-24', '2026-09-28']);
});

test('monthly occurrences clamp day 31 to the end of a leap February', () => {
    const dates = occurrences(
        { ...supply, mode: 'monthly', monthDay: 31 },
        new Date('2028-02-01T12:00:00'),
        2
    );

    assert.deepEqual(dates, ['2028-02-29', '2028-03-31']);
});

test('reserved quantity counts active orders and ignores terminal orders', () => {
    const batch: Batch = {
        id: '8',
        companyId: '2',
        warehouse: 'Склад',
        cargo: 'Посуда',
        unit: 'коробок',
        onHand: 100,
        baseReserved: 3,
        source: 'Приемка',
    };
    const order = {
        id: 'JL-1',
        companyId: '2',
        from: 'Склад',
        to: 'Адрес',
        pickup: '2026-09-20',
        date: '2026-09-21',
        cargo: 'Посуда',
        quantity: 10,
        unit: 'коробок' as const,
        comment: '',
        stages: [],
        updated: '',
        files: [],
        issues: [],
        batchId: batch.id,
    };
    const state = {
        version: 1,
        capabilities: { supplyAutomaticEnabled: false },
        profile: {
            name: '',
            company: '',
            phone: '',
            city: '',
            bin: '',
            notifications: false,
        },
        companies: [],
        supplies: [],
        batches: [batch],
        orders: [
            { ...order, status: 'waiting' },
            { ...order, id: 'JL-2', quantity: 20, status: 'cancelled' },
            { ...order, id: 'JL-3', quantity: 30, status: 'delivered' },
        ],
    } satisfies State;

    assert.equal(reserved(state, batch), 13);
});
