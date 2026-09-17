import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clientIpHeaders } from './client-ip';

test('forwards a single validated ingress IP only with explicit trust', () => {
    assert.deepEqual(clientIpHeaders('203.0.113.5', true), {
        'X-Forwarded-For': '203.0.113.5',
    });
    assert.deepEqual(clientIpHeaders('2001:db8::1', true), {
        'X-Forwarded-For': '2001:db8::1',
    });
    assert.deepEqual(clientIpHeaders('203.0.113.5', false), {});
    for (const ip of [
        null,
        '',
        '127.0.0.1, 203.0.113.5',
        'unknown',
        '127.0.0.1:80',
    ])
        assert.deepEqual(clientIpHeaders(ip, true), {});
});
