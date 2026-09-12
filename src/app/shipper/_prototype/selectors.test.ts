import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seed } from './seed';
import {
    selectCompanyConnection,
    selectDecisionTasks,
    selectOrderCollection,
    selectOrderPrice,
} from './selectors';
import { emptyOrderFilters } from './order-filters';

test('decision tasks distinguish initial prices from surcharges', () => {
    const tasks = selectDecisionTasks(seed());
    assert.deepEqual(
        tasks.map((task) => [task.kind, task.order.id, task.proposal.amount]),
        [
            ['price', 'JL-2049', 64000],
            ['surcharge', 'JL-2045', 18000],
        ]
    );
});

test('order price prefers the agreed total including accepted surcharge', () => {
    const order = seed().orders[0];
    assert.deepEqual(
        selectOrderPrice({
            ...order,
            extra: {
                kind: 'extra',
                amount: 15000,
                eta: order.date,
                reason: 'Упаковка',
                status: 'accepted',
            },
        }),
        { kind: 'agreed', amount: 300000 }
    );
});

test('order collection separates an empty account from no matches', () => {
    const state = seed();
    assert.deepEqual(
        selectOrderCollection({ ...state, orders: [] }, emptyOrderFilters),
        { kind: 'empty-account' }
    );
    assert.deepEqual(
        selectOrderCollection(state, { ...emptyOrderFilters, q: 'missing' }),
        { kind: 'no-matches' }
    );
});

test('company connection reports the blocking state', () => {
    const state = seed();
    assert.equal(selectCompanyConnection(state).kind, 'connected');
    assert.equal(
        selectCompanyConnection({
            ...state,
            companies: state.companies.map((company) => ({
                ...company,
                relation: 'available',
            })),
        }).kind,
        'not-connected'
    );
});
