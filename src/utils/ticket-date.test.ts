import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formatTicketDate } from './ticket-date';

test('uses the missing-date label for a null ticket date', () => {
    assert.equal(formatTicketDate(null), 'Дата не указана');
});
