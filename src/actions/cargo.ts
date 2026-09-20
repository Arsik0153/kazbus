'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import {
    adminStateSchema,
    adminCompanySchema,
    cargoDriverSchema,
    cargoRoleSchema,
    cargoVehicleSchema,
    driverStateSchema,
    shipperStateSchema,
    adminStockSchema,
    warehouseSchema,
} from '@/lib/cargo-contract';
import {
    cargoFetch,
    clearCargoSession,
    loginCargo,
    registerCargo,
} from '@/lib/cargo-auth';

type ActionResult<T = undefined> =
    { ok: true; data: T } | { ok: false; error: string };

async function result<T>(
    operation: () => Promise<T>
): Promise<ActionResult<T>> {
    try {
        return { ok: true, data: await operation() };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Не удалось выполнить действие',
        };
    }
}

const credentialsSchema = z.object({
    role: cargoRoleSchema,
    phone_number: z.string().min(11),
    password: z.string().min(8),
});

export async function cargoLoginAction(
    input: z.input<typeof credentialsSchema>
) {
    return result(async () => {
        const credentials = credentialsSchema.parse(input);
        const auth = await loginCargo(credentials);
        return { role: auth.role };
    });
}

const registrationSchema = z
    .object({
        role: cargoRoleSchema,
        phone_number: z.string().min(11),
        password: z.string().min(8),
        full_name: z.string().min(2),
        company_name: z.string().optional(),
        bin_iin: z.string().optional(),
        city: z.string().optional(),
        contact_phone: z.string().optional(),
        email: z.string().email().or(z.literal('')).optional(),
        description: z.string().optional(),
        invite_token: z.string().optional(),
    })
    .superRefine((value, context) => {
        if (value.role === 'cargo_driver' && !value.invite_token) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['invite_token'],
                message: 'Введите приглашение компании',
            });
        }
        if (value.role !== 'cargo_driver') {
            for (const field of ['company_name', 'city'] as const) {
                if (!value[field]) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [field],
                        message: 'Обязательное поле',
                    });
                }
            }
        }
        if (value.role === 'admin_cargo') {
            for (const field of ['bin_iin', 'contact_phone'] as const) {
                if (!value[field]) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [field],
                        message: 'Обязательное поле',
                    });
                }
            }
        }
    });

export async function cargoRegisterAction(
    input: z.input<typeof registrationSchema>
) {
    return result(async () => {
        const registration = registrationSchema.parse(input);
        const base = {
            role: registration.role,
            phone_number: registration.phone_number,
            password: registration.password,
            full_name: registration.full_name,
        };
        const payload =
            registration.role === 'cargo_driver'
                ? { ...base, invite_token: registration.invite_token }
                : registration.role === 'shipper'
                  ? {
                        ...base,
                        company_name: registration.company_name,
                        bin_iin: registration.bin_iin ?? '',
                        city: registration.city,
                    }
                  : {
                        ...base,
                        company_name: registration.company_name,
                        bin_iin: registration.bin_iin,
                        city: registration.city,
                        contact_phone: registration.contact_phone,
                        email: registration.email ?? '',
                        description: registration.description ?? '',
                    };
        const auth = await registerCargo(payload);
        return { role: auth.role };
    });
}

export async function cargoLogoutAction() {
    await clearCargoSession();
    return { ok: true as const, data: undefined };
}

export async function loadShipperState() {
    const response = await cargoFetch('shipper', 'shipper/state/');
    return shipperStateSchema.parse(await response.json());
}

const shipperCommandSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('request-relation'),
        companyId: z.number().int(),
    }),
    z.object({
        type: z.literal('create-order'),
        requestId: z.string().uuid(),
        companyId: z.number().int(),
        from: z.string().min(1),
        to: z.string().min(1),
        pickup: z.string().min(1),
        date: z.string().min(1),
        cargo: z.string().min(1),
        quantity: z.number().positive(),
        unit: z.enum(['шт.', 'коробок', 'паллет', 'кг', 'т']),
        weight: z.string().optional(),
        dimensions: z.string().optional(),
        comment: z.string().optional(),
    }),
    z.object({
        type: z.literal('create-supply'),
        title: z.string().min(1),
        companyId: z.number().int().positive(),
        from: z.string().min(1),
        to: z.string().min(1),
        cargo: z.string().min(1),
        quantity: z.number().positive(),
        unit: z.enum(['шт.', 'коробок', 'паллет', 'кг', 'т']),
        mode: z.enum(['manual', 'weekly', 'monthly']),
        weekdays: z.array(z.number().int().min(0).max(6)),
        monthDay: z.number().int().min(1).max(31),
        automatic: z.boolean().default(false),
    }),
    z.object({
        type: z.literal('update-supply'),
        supplyId: z.number().int().positive(),
        title: z.string().min(1),
        companyId: z.number().int().positive(),
        from: z.string().min(1),
        to: z.string().min(1),
        cargo: z.string().min(1),
        quantity: z.number().positive(),
        unit: z.enum(['шт.', 'коробок', 'паллет', 'кг', 'т']),
        mode: z.enum(['manual', 'weekly', 'monthly']),
        weekdays: z.array(z.number().int().min(0).max(6)),
        monthDay: z.number().int().min(1).max(31),
        automatic: z.boolean().default(false),
    }),
    z.object({
        type: z.literal('pause-supply'),
        supplyId: z.number().int().positive(),
    }),
    z.object({
        type: z.literal('resume-supply'),
        supplyId: z.number().int().positive(),
    }),
    z.object({
        type: z.literal('skip-supply-date'),
        supplyId: z.number().int().positive(),
        date: z.string().min(1),
    }),
    z.object({
        type: z.literal('launch-supply'),
        supplyId: z.number().int().positive(),
        plannedFor: z.string().min(1),
    }),
    z.object({
        type: z.literal('create-stock-order'),
        requestId: z.string().uuid(),
        lotId: z.number().int().positive(),
        to: z.string().min(1),
        pickup: z.string().min(1),
        date: z.string().min(1),
        quantity: z.number().positive(),
        comment: z.string().optional(),
    }),
    z.object({
        type: z.literal('decide-offer'),
        orderId: z.number().int(),
        offerId: z.number().int(),
        decision: z.enum(['accept', 'decline']),
    }),
    z.object({ type: z.literal('cancel-order'), orderId: z.number().int() }),
    z.object({
        type: z.literal('report-incident'),
        orderId: z.number().int(),
        text: z.string().min(1),
    }),
    z.object({
        type: z.literal('update-profile'),
        fullName: z.string().min(2),
        companyName: z.string().min(1),
        binIin: z.string(),
        city: z.string().min(1),
        notifications: z.boolean(),
    }),
]);

export type ShipperCommand = z.input<typeof shipperCommandSchema>;

export async function shipperCommandAction(input: ShipperCommand) {
    return result(async () => {
        const command = shipperCommandSchema.parse(input);
        let action: string;
        let payload: Record<string, unknown>;

        switch (command.type) {
            case 'request-relation':
                action = command.type;
                payload = { company_id: command.companyId };
                break;
            case 'create-order':
                action = command.type;
                payload = {
                    request_id: command.requestId,
                    company_id: command.companyId,
                    from_address: command.from,
                    to_address: command.to,
                    pickup_date: command.pickup,
                    delivery_date: command.date,
                    cargo_description: command.cargo,
                    quantity: String(command.quantity),
                    unit: command.unit,
                    ...(command.weight ? { weight_kg: command.weight } : {}),
                    dimensions: command.dimensions ?? '',
                    comment: command.comment ?? '',
                };
                break;
            case 'create-supply':
            case 'update-supply':
                action = command.type;
                payload = {
                    ...(command.type === 'update-supply'
                        ? { supply_id: command.supplyId }
                        : {}),
                    title: command.title,
                    company_id: command.companyId,
                    from_address: command.from,
                    to_address: command.to,
                    cargo_description: command.cargo,
                    quantity: String(command.quantity),
                    unit: command.unit,
                    mode: command.mode,
                    weekdays: command.mode === 'weekly' ? command.weekdays : [],
                    month_day:
                        command.mode === 'monthly' ? command.monthDay : 1,
                    automatic: command.automatic,
                };
                break;
            case 'pause-supply':
            case 'resume-supply':
                action = command.type;
                payload = { supply_id: command.supplyId };
                break;
            case 'skip-supply-date':
                action = command.type;
                payload = {
                    supply_id: command.supplyId,
                    date: command.date,
                };
                break;
            case 'launch-supply':
                action = command.type;
                payload = {
                    supply_id: command.supplyId,
                    planned_for: command.plannedFor,
                };
                break;
            case 'create-stock-order':
                action = command.type;
                payload = {
                    request_id: command.requestId,
                    lot_id: command.lotId,
                    to_address: command.to,
                    pickup_date: command.pickup,
                    delivery_date: command.date,
                    quantity: String(command.quantity),
                    comment: command.comment ?? '',
                };
                break;
            case 'decide-offer':
                action = command.type;
                payload = {
                    order_id: command.orderId,
                    offer_id: command.offerId,
                    decision: command.decision,
                };
                break;
            case 'cancel-order':
                action = command.type;
                payload = { order_id: command.orderId };
                break;
            case 'report-incident':
                action = command.type;
                payload = { order_id: command.orderId, text: command.text };
                break;
            case 'update-profile':
                action = command.type;
                payload = {
                    full_name: command.fullName,
                    company_name: command.companyName,
                    bin_iin: command.binIin,
                    city: command.city,
                    notifications: command.notifications,
                };
                break;
        }

        const response = await cargoFetch(
            'shipper',
            `shipper/commands/${action}/`,
            { method: 'POST', body: JSON.stringify(payload) }
        );
        const body = z
            .object({ state: shipperStateSchema })
            .passthrough()
            .parse(await response.json());
        revalidatePath('/shipper', 'layout');
        return body.state;
    });
}

export async function loadAdminCargoState() {
    const response = await cargoFetch('admin_cargo', 'admin/state/');
    return adminStateSchema.parse(await response.json());
}

const companyUpdateSchema = z.object({
    name: z.string().min(1),
    city: z.string().min(1),
    contactPhone: z.string().min(11),
    email: z.string().email().or(z.literal('')),
    description: z.string(),
    isSearchable: z.boolean(),
});

export async function updateCargoCompanyAction(
    input: z.input<typeof companyUpdateSchema>
) {
    return result(async () => {
        const value = companyUpdateSchema.parse(input);
        const response = await cargoFetch('admin_cargo', 'admin/company/', {
            method: 'PATCH',
            body: JSON.stringify({
                name: value.name,
                city: value.city,
                contact_phone: value.contactPhone.replace(/\D/g, ''),
                email: value.email,
                description: value.description,
                is_searchable: value.isSearchable,
            }),
        });
        revalidatePath('/admin-cargo');
        return adminCompanySchema.parse(await response.json());
    });
}

const relationDecisionSchema = z.object({
    relationId: z.number().int(),
    decision: z.enum(['confirm', 'reject', 'block']),
    comment: z.string(),
});

export async function decideCargoRelationAction(
    input: z.input<typeof relationDecisionSchema>
) {
    return result(async () => {
        const value = relationDecisionSchema.parse(input);
        await cargoFetch(
            'admin_cargo',
            `admin/relations/${value.relationId}/decision/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    decision: value.decision,
                    comment: value.comment,
                }),
            }
        );
        revalidatePath('/admin-cargo');
    });
}

const offerInputSchema = z.object({
    orderId: z.number().int(),
    kind: z.enum(['offer', 'surcharge']),
    amount: z.string().min(1),
    eta: z.string().min(1),
    routeText: z.string(),
    reason: z.string().min(1),
});

export async function createCargoOfferAction(
    input: z.input<typeof offerInputSchema>
) {
    return result(async () => {
        const value = offerInputSchema.parse(input);
        await cargoFetch(
            'admin_cargo',
            `admin/orders/${value.orderId}/${value.kind}/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    amount: value.amount,
                    eta: value.eta,
                    reason: value.reason,
                    ...(value.kind === 'offer'
                        ? { route_text: value.routeText }
                        : {}),
                }),
            }
        );
        revalidatePath('/admin-cargo');
    });
}

const assignmentSchema = z.object({
    orderId: z.number().int(),
    driverId: z.number().int(),
    vehicleId: z.number().int(),
    eta: z.string().min(1),
});

export async function assignCargoOrderAction(
    input: z.input<typeof assignmentSchema>
) {
    return result(async () => {
        const value = assignmentSchema.parse(input);
        await cargoFetch(
            'admin_cargo',
            `admin/orders/${value.orderId}/assign/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    driver_id: value.driverId,
                    vehicle_id: value.vehicleId,
                    eta: value.eta,
                }),
            }
        );
        revalidatePath('/admin-cargo');
    });
}

export async function rejectCargoOrderAction(input: {
    orderId: number;
    reason: string;
}) {
    return result(async () => {
        const value = z
            .object({ orderId: z.number().int(), reason: z.string().min(1) })
            .parse(input);
        await cargoFetch(
            'admin_cargo',
            `admin/orders/${value.orderId}/reject/`,
            {
                method: 'POST',
                body: JSON.stringify({ reason: value.reason }),
            }
        );
        revalidatePath('/admin-cargo');
    });
}

const newDriverSchema = cargoDriverSchema.pick({
    full_name: true,
    phone_number: true,
    license_number: true,
    status: true,
});

export async function createCargoDriverAction(
    input: z.input<typeof newDriverSchema>
) {
    return result(async () => {
        const value = newDriverSchema.parse(input);
        const response = await cargoFetch('admin_cargo', 'admin/drivers/', {
            method: 'POST',
            body: JSON.stringify(value),
        });
        revalidatePath('/admin-cargo');
        return cargoDriverSchema.parse(await response.json());
    });
}

export async function createDriverInviteAction(driverId: number) {
    return result(async () => {
        const response = await cargoFetch(
            'admin_cargo',
            `admin/drivers/${z.number().int().parse(driverId)}/invite/`,
            { method: 'POST' }
        );
        return z
            .object({ invite_token: z.string(), expires_at: z.string() })
            .parse(await response.json());
    });
}

const newVehicleSchema = cargoVehicleSchema.pick({
    model: true,
    plate_number: true,
    trailer_number: true,
    kind: true,
    capacity_tons: true,
    status: true,
});

export async function createCargoVehicleAction(
    input: z.input<typeof newVehicleSchema>
) {
    return result(async () => {
        const value = newVehicleSchema.parse(input);
        const response = await cargoFetch('admin_cargo', 'admin/vehicles/', {
            method: 'POST',
            body: JSON.stringify({
                ...value,
                capacity_tons: String(value.capacity_tons),
            }),
        });
        revalidatePath('/admin-cargo');
        return cargoVehicleSchema.parse(await response.json());
    });
}

export async function createCargoWarehouseAction(input: {
    name: string;
    address: string;
}) {
    return result(async () => {
        const value = z
            .object({ name: z.string().min(1), address: z.string().min(1) })
            .parse(input);
        const response = await cargoFetch('admin_cargo', 'admin/warehouses/', {
            method: 'POST',
            body: JSON.stringify(value),
        });
        revalidatePath('/admin-cargo');
        return warehouseSchema.passthrough().parse(await response.json());
    });
}

const stockInputSchema = z.object({
    warehouseId: z.number().int().positive(),
    shipperId: z.number().int().positive(),
    cargo: z.string().min(1),
    sku: z.string(),
    unit: z.enum(['шт.', 'коробок', 'паллет', 'кг', 'т']),
    onHand: z.number().nonnegative(),
    source: z.string(),
});

export async function createCargoStockAction(
    input: z.input<typeof stockInputSchema>
) {
    return result(async () => {
        const value = stockInputSchema.parse(input);
        const response = await cargoFetch('admin_cargo', 'admin/stock/', {
            method: 'POST',
            body: JSON.stringify({
                warehouse_id: value.warehouseId,
                shipper_id: value.shipperId,
                cargo_description: value.cargo,
                sku: value.sku,
                unit: value.unit,
                on_hand: String(value.onHand),
                source: value.source,
            }),
        });
        revalidatePath('/admin-cargo');
        return adminStockSchema.passthrough().parse(await response.json());
    });
}

export async function adjustCargoStockAction(input: {
    lotId: number;
    delta: number;
    reason: string;
}) {
    return result(async () => {
        const value = z
            .object({
                lotId: z.number().int().positive(),
                delta: z.number().refine((number) => number !== 0),
                reason: z.string().min(1),
            })
            .parse(input);
        const response = await cargoFetch(
            'admin_cargo',
            `admin/stock/${value.lotId}/adjust/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    delta: String(value.delta),
                    reason: value.reason,
                }),
            }
        );
        revalidatePath('/admin-cargo');
        return adminStockSchema.passthrough().parse(await response.json());
    });
}

export async function loadDriverState() {
    const response = await cargoFetch('cargo_driver', 'driver/state/');
    return driverStateSchema.parse(await response.json());
}

const tripStatusInputSchema = z.object({
    tripId: z.number().int(),
    expected: z.enum(['planned', 'loading', 'in_transit', 'unloading']),
    target: z.enum(['loading', 'in_transit', 'unloading', 'completed']),
});

export async function updateDriverTripStatusAction(
    input: z.input<typeof tripStatusInputSchema>
) {
    return result(async () => {
        const value = tripStatusInputSchema.parse(input);
        const response = await cargoFetch(
            'cargo_driver',
            `driver/trips/${value.tripId}/status/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    expected: value.expected,
                    target: value.target,
                }),
            }
        );
        revalidatePath('/cargo', 'layout');
        return z
            .object({
                id: z.number().int().positive(),
                status: z.enum([
                    'planned',
                    'loading',
                    'in_transit',
                    'unloading',
                    'completed',
                ]),
                eta: z.string(),
                updated: z.string(),
            })
            .parse(await response.json());
    });
}

const driverIncidentSchema = z.object({
    tripId: z.number().int(),
    text: z.string().min(1),
    newEta: z.string().optional(),
});

export async function reportDriverIncidentAction(
    input: z.input<typeof driverIncidentSchema>
) {
    return result(async () => {
        const value = driverIncidentSchema.parse(input);
        await cargoFetch(
            'cargo_driver',
            `driver/trips/${value.tripId}/incidents/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    text: value.text,
                    ...(value.newEta ? { new_eta: value.newEta } : {}),
                }),
            }
        );
        revalidatePath('/cargo', 'layout');
    });
}
