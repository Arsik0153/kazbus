import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    emptyOrderFilters,
    parseOrderFilters,
    serializeOrderFilters,
} from './order-filters';

test('order filters parse known URL values', () => {
    const params = new URLSearchParams(
        'q=%20%D0%BF%D0%BE%D1%81%D1%83%D0%B4%D0%B0%20&company=c2&status=transit&attention=1'
    );
    assert.deepEqual(parseOrderFilters(params, ['c1', 'c2']), {
        q: 'посуда',
        companyId: 'c2',
        status: 'transit',
        attentionOnly: true,
    });
});

test('order filters ignore unknown status and company ids', () => {
    const params = new URLSearchParams(
        'company=missing&status=lost&attention=true'
    );
    assert.deepEqual(parseOrderFilters(params, ['c1']), emptyOrderFilters);
});

test('order filters serialize only active values', () => {
    assert.equal(
        serializeOrderFilters({
            q: '  JL-2049 ',
            companyId: 'c2',
            status: '',
            attentionOnly: true,
        }).toString(),
        'q=JL-2049&company=c2&attention=1'
    );
    assert.equal(serializeOrderFilters(emptyOrderFilters).toString(), '');
});
