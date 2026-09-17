import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    buildBusDocumentRows,
    busDocumentListSchema,
    busDocumentSchema,
} from './bus-documents';

const registration = {
    id: 12,
    busId: '123456',
    kind: 'registration' as const,
    name: 'registration.pdf',
    contentType: 'application/pdf' as const,
    size: 1024,
    expiresOn: null,
    status: 'valid' as const,
    uploadedBy: { id: 7, name: 'Диспетчер' },
    createdAt: '2026-09-17T12:30:00+00:00',
    downloadUrl: '/api_jol/buses/documents/12/download/',
};

test('accepts the documented bus document metadata', () => {
    assert.equal(busDocumentSchema.safeParse(registration).success, true);
});

test('rejects a metadata download URL outside the documented namespace', () => {
    assert.equal(
        busDocumentSchema.safeParse({
            ...registration,
            downloadUrl: 'https://files.example.test/public/registration.pdf',
        }).success,
        false
    );
});

test('builds one registry row for every required document kind', () => {
    assert.deepEqual(buildBusDocumentRows([registration]), [
        { kind: 'registration', document: registration, status: 'valid' },
        { kind: 'insurance', document: null, status: 'missing' },
        { kind: 'inspection', document: null, status: 'missing' },
    ]);
});

test('rejects duplicate document kinds returned by the API', () => {
    assert.equal(
        busDocumentListSchema.safeParse([
            registration,
            {
                ...registration,
                id: 13,
                downloadUrl: '/api_jol/buses/documents/13/download/',
            },
        ]).success,
        false
    );
});
