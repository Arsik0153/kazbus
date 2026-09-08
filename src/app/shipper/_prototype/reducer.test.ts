import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seed } from './seed';
import { reducer } from './reducer';
import { occurrences, reserved, Order } from './model';
const makeOrder = (overrides: Partial<Order> = {}): Order => ({
    ...seed().orders[4],
    id: 'test-order',
    ...overrides,
});
test('orders do not require dimensions or weight', () => {
    const s = reducer(seed(), { type: 'create', order: makeOrder() });
    assert.equal(s.orders[0].weight, undefined);
    assert.equal(s.orders[0].status, 'waiting');
});
test('only confirmed companies can receive orders', () => {
    assert.throws(() =>
        reducer(seed(), {
            type: 'create',
            order: makeOrder({ companyId: 'c3' }),
        })
    );
});
test('accepting proposal records original price and invoice', () => {
    const s = reducer(seed(), {
        type: 'decision',
        id: 'JL-2049',
        extra: false,
        accept: true,
    });
    const o = s.orders.find((o) => o.id === 'JL-2049')!;
    assert.equal(o.status, 'planned');
    assert.equal(o.agreedPrice, 64000);
    assert.equal(o.invoice?.amount, 64000);
    assert.throws(() =>
        reducer(s, { type: 'decision', id: o.id, extra: false, accept: true })
    );
});
test('declining surcharge preserves transit and original price', () => {
    const s = reducer(seed(), {
        type: 'decision',
        id: 'JL-2045',
        extra: true,
        accept: false,
    });
    const o = s.orders.find((o) => o.id === 'JL-2045')!;
    assert.equal(o.status, 'transit');
    assert.equal(o.agreedPrice, 285000);
    assert.equal(o.extra?.status, 'declined');
});
test('stock reserves on request, prevents overbooking, releases on cancel', () => {
    const initial = seed();
    const b = initial.batches[0];
    assert.equal(reserved(initial, b), 4);
    const s = reducer(initial, {
        type: 'create',
        order: makeOrder({
            batchId: b.id,
            companyId: b.companyId,
            quantity: 16,
        }),
    });
    assert.equal(reserved(s, b), 20);
    assert.throws(() =>
        reducer(s, {
            type: 'create',
            order: makeOrder({
                id: 'another',
                batchId: b.id,
                companyId: b.companyId,
                quantity: 1,
            }),
        })
    );
    const cancelled = reducer(s, { type: 'cancel', id: 'test-order' });
    assert.equal(reserved(cancelled, b), 4);
});
test('company rejection releases reservation', () => {
    const s = seed();
    s.orders.find((o) => o.batchId === 'b1')!.status = 'rejected';
    assert.equal(reserved(s, s.batches[0]), 0);
});
test('cancelled proposal cannot be accepted', () => {
    const s = reducer(seed(), { type: 'cancel', id: 'JL-2049' });
    assert.throws(() =>
        reducer(s, {
            type: 'decision',
            id: 'JL-2049',
            extra: false,
            accept: true,
        })
    );
});
test('duplicate recurring occurrence blocked', () => {
    const o = makeOrder({ supplyId: 's1', occurrence: '2026-10-01' });
    const s = reducer(seed(), { type: 'create', order: o });
    assert.throws(() =>
        reducer(s, { type: 'create', order: { ...o, id: 'duplicate' } })
    );
});
test('monthly short months, leap year, pause and skip', () => {
    const s = { ...seed().supplies[0], mode: 'monthly' as const, monthDay: 31 };
    assert.deepEqual(occurrences(s, new Date(2026, 1, 1), 2), [
        '2026-02-28',
        '2026-03-31',
    ]);
    assert.equal(occurrences(s, new Date(2028, 1, 1), 1)[0], '2028-02-29');
    assert.deepEqual(occurrences({ ...s, paused: true }), []);
    assert.equal(
        occurrences(
            { ...s, skipped: ['2026-02-28'] },
            new Date(2026, 1, 1),
            1
        )[0],
        '2026-03-31'
    );
});
test('weekly dates match selected weekdays', () => {
    const s = { ...seed().supplies[0], weekdays: [1, 4] };
    assert.deepEqual(occurrences(s, new Date(2026, 8, 9), 3), [
        '2026-09-10',
        '2026-09-14',
        '2026-09-17',
    ]);
});
test('issue attachments and state survive JSON roundtrip', () => {
    const s = reducer(seed(), {
        type: 'issue',
        id: 'JL-2048',
        issue: {
            id: 'i1',
            text: 'Проверить упаковку',
            date: new Date().toISOString(),
            files: [{ id: 'file-1', name: 'photo.png' }],
        },
    });
    const restored = JSON.parse(JSON.stringify(s));
    assert.deepEqual(restored.orders[0].issues, s.orders[0].issues);
    assert.equal(restored.orders[0].agreedPrice, s.orders[0].agreedPrice);
    assert.equal(restored.orders.length, s.orders.length);
});

import { restore } from './persistence';
test('restore validates nested data and rejects broken persistence', () => {
    assert.equal(restore(JSON.stringify(seed())).orders.length, 6);
    const bad = seed();
    (bad.orders[0] as any).stages = null;
    assert.throws(() => restore(JSON.stringify(bad)));
});
