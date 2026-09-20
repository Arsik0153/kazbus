import assert from 'node:assert/strict';
import test from 'node:test';
import {
    getSupportApiError,
    supportDetailSchema,
    supportListSchema,
} from './passenger-support';

const detail = {
    id: 15,
    subject: 'Перенос поездки',
    status: 'answered',
    ticket: {
        id: 42,
        status: 'Payed',
        serviceDate: null,
        route: { from: 'Алматы', to: 'Астана' },
    },
    passenger: { id: null, name: 'Алия' },
    messageCount: 2,
    createdAt: '2026-09-17T09:00:00+00:00',
    updatedAt: '2026-09-17T09:05:00+00:00',
    closedAt: null,
    messages: [
        {
            id: 1,
            senderRole: 'passenger',
            authorName: 'Алия',
            text: 'Можно изменить дату?',
            createdAt: '2026-09-17T09:00:00+00:00',
        },
        {
            id: 2,
            senderRole: 'company',
            authorName: 'Перевозчик',
            text: 'Ответ компании',
            createdAt: '2026-09-17T09:05:00+00:00',
        },
    ],
};

test('support detail accepts legacy tickets without a service date', () => {
    const parsed = supportDetailSchema.parse(detail);
    assert.equal(parsed.ticket.serviceDate, null);
    assert.equal(parsed.passenger.id, null);
    assert.equal(parsed.messages[1].senderRole, 'company');
});

test('support list rejects an undocumented status', () => {
    const result = supportListSchema.safeParse({
        count: 1,
        next: null,
        previous: null,
        results: [{ ...detail, status: 'pending' }],
    });
    assert.equal(result.success, false);
});

test('API field errors are shown instead of a generic message', () => {
    assert.equal(
        getSupportApiError(
            { message: ['Сообщение обязательно.'] },
            'Не удалось отправить.'
        ),
        'Сообщение обязательно.'
    );
});
