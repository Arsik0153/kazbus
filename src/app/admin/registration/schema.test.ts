import assert from 'node:assert/strict';
import { test } from 'node:test';
import { companyPhoneSchema, companyRegistrationSchema } from './schema';

test('normalizes formatted Kazakhstan phones but rejects letters and unicode digits', () => {
    assert.equal(companyPhoneSchema.parse('+7 (701) 123-45-67'), '77011234567');
    for (const input of ['+7 abc 7011234567', '٧٧٠١١٢٣٤٥٦٧', '12025550101'])
        assert.equal(companyPhoneSchema.safeParse(input).success, false);
});
test('registration requires confirmation, identity fields and matching passwords', () => {
    const valid = {
        phone_number: '77011234567',
        code: '4567',
        full_name: 'Владелец компании',
        password: 'Owner-Strong-2026!',
        repeat_password: 'Owner-Strong-2026!',
        legal_name: 'ТОО Тест',
        bin_iin: '123456789012',
        city: 'Алматы',
        address: '',
        email: '',
    };
    assert.equal(companyRegistrationSchema.safeParse(valid).success, true);
    for (const change of [
        { code: '' },
        { repeat_password: 'another' },
        { bin_iin: '123' },
        { legal_name: '' },
        { email: 'bad' },
    ])
        assert.equal(
            companyRegistrationSchema.safeParse({ ...valid, ...change })
                .success,
            false
        );
});
