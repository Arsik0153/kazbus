import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    companyProfileInputSchema,
    companyProfilePatchSchema,
    companyProfileSchema,
    hasValidCompanyPhoneCharacters,
    normalizeCompanyPhone,
    parseCompanyProfileErrors,
} from './admin-company-schema';

test('accepts the documented company profile response', () => {
    assert.equal(
        companyProfileSchema.safeParse({
            legal_name: 'ТОО «Сапар»',
            bin_iin: '123456789012',
            city: 'Алматы',
            address: 'Абая, 1',
            contact_phone: '77001234567',
            email: 'office@example.kz',
            status: 'active',
        }).success,
        true
    );
});

test('rejects invalid identifiers, phone numbers, email and status', () => {
    assert.equal(
        companyProfileSchema.safeParse({
            legal_name: '',
            bin_iin: '123',
            city: '',
            address: '',
            contact_phone: '87001234567',
            email: 'not-an-email',
            status: 'pending',
        }).success,
        false
    );
});

test('normalizes formatted phone input before validation', () => {
    const contact_phone = normalizeCompanyPhone('+7 (700) 123-45-67');
    assert.equal(contact_phone, '77001234567');
    assert.equal(
        companyProfileInputSchema.safeParse({
            legal_name: '',
            bin_iin: '',
            city: '',
            address: '',
            contact_phone,
            email: '',
        }).success,
        true
    );
    assert.equal(hasValidCompanyPhoneCharacters('+7 (700) 123-45-67'), true);
    assert.equal(hasValidCompanyPhoneCharacters('+7 abc 700 1234567'), false);
});

test('accepts a partial update and rejects an empty patch', () => {
    assert.equal(
        companyProfilePatchSchema.safeParse({ city: 'Астана' }).success,
        true
    );
    assert.equal(companyProfilePatchSchema.safeParse({}).success, false);
});

test('maps DRF validation errors to their fields', () => {
    assert.deepEqual(
        parseCompanyProfileErrors({
            bin_iin: ['Введите корректный БИН.'],
            contact_phone: ['Введите корректный телефон.'],
        }),
        {
            fieldErrors: {
                bin_iin: 'Введите корректный БИН.',
                contact_phone: 'Введите корректный телефон.',
            },
            message: 'Введите корректный БИН.',
        }
    );
});
