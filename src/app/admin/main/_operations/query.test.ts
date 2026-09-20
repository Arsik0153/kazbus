import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeOperationsQuery } from './query';
import { operationsSchema } from './schema';

test('normalizes repeated query parameters and unknown status', () => {
    assert.deepEqual(
        normalizeOperationsQuery({
            q: [' рейс ', 'other'],
            date: ['2026-09-17', 'bad'],
            status: 'unknown',
        }),
        { q: 'рейс', date: '2026-09-17', status: 'all' }
    );
});

test('rejects malformed incident dates before rendering', () => {
    const row = {
        id: 1,
        tripId: 1,
        runId: 1,
        date: '2026-09-17',
        title: 'Тема',
        comment: '',
        driverName: 'Водитель',
        createdAt: 'not-a-date',
        resolvedAt: null,
        resolution: '',
    };
    assert.equal(
        operationsSchema.shape.incidents.safeParse([row]).success,
        false
    );
    assert.equal(
        operationsSchema.shape.incidents.safeParse([
            { ...row, createdAt: '2026-09-17T13:14:00+00:00' },
        ]).success,
        true
    );
});
