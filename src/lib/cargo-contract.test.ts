import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    adminStateSchema,
    driverStateSchema,
    shipperStateSchema,
} from './cargo-contract';

const baseOrder = {
    recordId: 1,
    id: 'JL-000001',
    companyId: '2',
    from: 'Алматы, Складская 1',
    to: 'Шымкент, Абая 2',
    pickup: '2026-09-20',
    date: '2026-09-23',
    cargo: 'Посуда',
    quantity: '20.000',
    unit: 'коробок',
    weight: '125.500',
    dimensions: '40 x 30 x 30 см',
    comment: 'Хрупкое',
    status: 'waiting',
    stages: [],
    updated: '2026-09-17T12:00:00Z',
    files: [],
    issues: [],
} as const;

test('shipper state converts API decimal strings at the boundary', () => {
    const state = shipperStateSchema.parse({
        version: 1,
        profile: {
            name: 'Анна',
            company: 'Дом',
            phone: '77010000001',
            city: 'Шымкент',
            bin: '',
            notifications: true,
        },
        companies: [],
        orders: [
            {
                ...baseOrder,
                offer: {
                    id: '7',
                    amount: '64000.00',
                    eta: '2026-09-23',
                    reason: 'Перевозка',
                    status: 'pending',
                    kind: 'initial',
                },
            },
        ],
        supplies: [],
        batches: [],
    });

    assert.equal(state.orders[0].quantity, 20);
    assert.equal(state.orders[0].weight, 125.5);
    assert.equal(state.orders[0].offer?.amount, 64000);
});

test('cargo projections reject malformed decimal values', () => {
    assert.throws(() =>
        shipperStateSchema.parse({
            version: 1,
            profile: {
                name: 'Анна',
                company: 'Дом',
                phone: '77010000001',
                city: 'Шымкент',
                bin: '',
                notifications: true,
            },
            companies: [],
            orders: [{ ...baseOrder, quantity: 'двадцать' }],
            supplies: [],
            batches: [],
        })
    );
});

test('admin and driver projections keep numeric record ids and convert capacity', () => {
    const admin = adminStateSchema.parse({
        company: {
            id: 2,
            name: 'Qaz Logistics',
            bin: '',
            city: 'Алматы',
            status: 'active',
            contactPhone: '77010000002',
            email: '',
            description: '',
            isSearchable: true,
        },
        relations: [],
        orders: [],
        drivers: [],
        vehicles: [
            {
                id: 5,
                model: 'MAN',
                plate_number: '123ABC13',
                trailer_number: '',
                kind: 'truck',
                capacity_tons: '20.000',
                status: 'active',
                created_at: '2026-09-17T12:00:00Z',
                updated_at: '2026-09-17T12:00:00Z',
            },
        ],
        trips: [],
    });
    const driver = driverStateSchema.parse({
        profile: {
            id: 3,
            fullName: 'Ерлан',
            phone: '77010000003',
            company: { id: 2, name: 'Qaz Logistics' },
        },
        trips: [
            {
                id: 7,
                status: 'planned',
                eta: '2026-09-23',
                updated: '2026-09-17T12:00:00Z',
                order: { ...baseOrder, recordId: 1 },
                vehicle: {
                    id: 5,
                    model: 'MAN',
                    plateNumber: '123ABC13',
                    trailerNumber: '',
                    kind: 'truck',
                },
                stages: [],
            },
        ],
    });

    assert.equal(admin.vehicles[0].capacity_tons, 20);
    assert.equal(driver.trips[0].order.recordId, 1);
    assert.equal(driver.trips[0].order.quantity, 20);
});
