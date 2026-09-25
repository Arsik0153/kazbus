import assert from 'node:assert/strict';
import test from 'node:test';
import {
    cargoPhoneSchema,
    cargoBinSchema,
    cargoDateSchema,
    cargoAmountSchema,
    cargoFormSchemas,
    newDriverSchema,
    newVehicleSchema,
    assignmentSchema,
    adjustmentSchema,
    companyUpdateSchema,
    formatCargoPhone,
    formatCargoDate,
    parseCargoApiErrors,
} from './cargo-validation';

test('cargo phones preserve valid formatted numbers and reject letters, extra digits and unicode digits', () => {
    assert.equal(cargoPhoneSchema.parse('+7 (701) 555-01-01'), '77015550101');
    assert.equal(formatCargoPhone('77015550101'), '+7 (701) 555-01-01');
    for (const value of [
        '77015550101abc',
        'abc77015550101',
        '87015550101',
        '7701555010',
        '770155501011',
        '７７０１５５５０１０１',
    ])
        assert.equal(cargoPhoneSchema.safeParse(value).success, false, value);
});
test('BIN and dates reject incomplete, Unicode and impossible values', () => {
    assert.equal(cargoBinSchema.safeParse('123456789012').success, true);
    for (const value of ['123', '12345678901x', '１２３４５６７８９０１２'])
        assert.equal(cargoBinSchema.safeParse(value).success, false);
    for (const value of [
        '2026-02-29',
        '2026-04-31',
        '2026-13-01',
        '2026-9-1',
        '0000-01-01',
    ])
        assert.equal(cargoDateSchema.safeParse(value).success, false, value);
    assert.equal(cargoDateSchema.safeParse('2028-02-29').success, true);
    assert.equal(formatCargoDate('2028-02-29'), '29.02.2028');
});
test('offer amounts accept comma decimals and enforce API precision and range', () => {
    assert.equal(cargoAmountSchema.parse(' 1200,50 '), '1200.50');
    for (const value of [
        '0',
        '-1',
        'NaN',
        'Infinity',
        '1e3',
        '1.001',
        '1000000000000',
        '',
    ])
        assert.equal(cargoAmountSchema.safeParse(value).success, false, value);
});
test('driver and company schemas reject whitespace and normalize contacts', () => {
    assert.equal(
        newDriverSchema.safeParse({
            full_name: '  ',
            phone_number: '77015550101',
            license_number: '  ',
            status: 'active',
        }).success,
        false
    );
    const company = {
        name: ' Jol ',
        city: ' Алматы ',
        contactPhone: '+7 (701) 555-01-01',
        email: '',
        description: '',
        isSearchable: true,
    };
    assert.equal(
        companyUpdateSchema.parse(company).contactPhone,
        '77015550101'
    );
    assert.equal(companyUpdateSchema.parse(company).name, 'Jol');
    assert.equal(
        companyUpdateSchema.safeParse({ ...company, email: 'bad' }).success,
        false
    );
});
test('vehicles enforce database length and precision, normalize plates', () => {
    const base = {
        model: 'Volvo',
        plate_number: '123 abc 02',
        trailer_number: '',
        kind: 'Тент',
        capacity_tons: 20.5,
        status: 'active',
    };
    assert.equal(newVehicleSchema.parse(base).plate_number, '123 ABC 02');
    for (const value of [0, -1, NaN, Infinity, 1.0001, 10000000])
        assert.equal(
            newVehicleSchema.safeParse({ ...base, capacity_tons: value })
                .success,
            false
        );
    assert.equal(
        newVehicleSchema.safeParse({ ...base, model: 'x'.repeat(121) }).success,
        false
    );
});
test('assignments require selected resources and stock adjustment must be finite and nonzero', () => {
    assert.equal(
        assignmentSchema.safeParse({
            orderId: 1,
            driverId: 0,
            vehicleId: 1,
            eta: '2026-10-01',
        }).success,
        false
    );
    for (const delta of [0, NaN, Infinity, 0.0001])
        assert.equal(
            adjustmentSchema.safeParse({
                lotId: 1,
                delta,
                reason: 'Инвентаризация',
            }).success,
            false
        );
    assert.equal(
        adjustmentSchema.safeParse({
            lotId: 1,
            delta: -1.25,
            reason: 'Инвентаризация',
        }).success,
        true
    );
    assert.equal(
        cargoFormSchemas.stock.safeParse({
            warehouse_id: '',
            shipper_id: '1',
            cargo: 'Груз',
            sku: '',
            unit: 'кг',
            on_hand: '0',
            source: 'Приёмка',
        }).success,
        false
    );
});
test('registration requires matching passwords while login accepts legacy passwords', () => {
    const base = {
        full_name: 'Имя',
        company_name: 'Компания',
        city: 'Алматы',
        bin_iin: '123456789012',
        phone_number: '77015550101',
        contact_phone: '77015550102',
        email: '',
        description: '',
        password: 'password1',
        password_confirm: 'password2',
    };
    assert.equal(cargoFormSchemas.registration.safeParse(base).success, false);
    assert.equal(
        cargoFormSchemas.registration.safeParse({
            ...base,
            password_confirm: 'password1',
        }).success,
        true
    );
    assert.equal(
        cargoFormSchemas.login.safeParse({
            phone_number: '+7 (701) 555-01-01',
            password: 'old',
        }).success,
        true
    );
});
test('API validation errors retain field names and non-field messages', () => {
    assert.deepEqual(
        parseCargoApiErrors({
            contact_phone: ['Телефон занят'],
            non_field_errors: ['Проверьте данные'],
        }),
        {
            message: 'Проверьте данные',
            fieldErrors: { contact_phone: 'Телефон занят' },
        }
    );
    assert.deepEqual(
        parseCargoApiErrors({
            cargo_description: ['Введите груз'],
            onHand: 'Недопустимый остаток',
        }).fieldErrors,
        { cargo: 'Введите груз', on_hand: 'Недопустимый остаток' }
    );
    assert.deepEqual(parseCargoApiErrors('Invalid HTML'), {
        message: undefined,
        fieldErrors: {},
    });
});
