'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
    cargoPhoneSchema,
    cargoEmailSchema,
    cargoBinSchema,
    requiredText,
    cargoValidationErrors,
    cargoFieldErrors,
    companyUpdateSchema,
    newDriverSchema,
    newVehicleSchema,
    warehouseInputSchema,
    offerInputSchema,
    assignmentSchema,
    stockInputSchema,
    adjustmentSchema,
} from '@/lib/cargo-validation';

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
    CargoApiError,
    cargoFetch,
    clearCargoSession,
    loginCargo,
    registerCargo,
} from '@/lib/cargo-auth';

type ActionResult<T = undefined> =
    | { ok: true; data: T }
    | { ok: false; error: string; fieldErrors?: Record<string, string> };

async function result<T>(
    operation: () => Promise<T>
): Promise<ActionResult<T>> {
    try {
        return { ok: true, data: await operation() };
    } catch (error) {
        if (error instanceof CargoApiError)
            return {
                ok: false,
                error: error.message,
                fieldErrors: error.fieldErrors,
            };
        if (error instanceof z.ZodError) {
            return {
                ok: false,
                error: error.issues[0]?.message ?? 'Проверьте заполненные поля',
                fieldErrors: cargoFieldErrors(cargoValidationErrors(error)),
            };
        }
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
    phone_number: cargoPhoneSchema,
    password: z.string().min(1, 'Введите пароль'),
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
        phone_number: cargoPhoneSchema,
        password: z.string().min(8, 'Не меньше 8 символов'),
        password_confirm: z.string().optional(),
        full_name: requiredText(255),
        company_name: z.string().trim().max(255).optional(),
        bin_iin: cargoBinSchema.or(z.literal('')).optional(),
        city: z.string().trim().max(120).optional(),
        contact_phone: cargoPhoneSchema.or(z.literal('')).optional(),
        email: cargoEmailSchema.optional(),
        description: z
            .string()
            .trim()
            .max(10000, 'Не больше 10000 символов')
            .optional(),
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
            if (value.password !== value.password_confirm)
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['password_confirm'],
                    message: 'Пароли не совпадают',
                });
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
                contact_phone: value.contactPhone,
                email: value.email,
                description: value.description,
                is_searchable: value.isSearchable,
            }),
        });
        revalidatePath('/admin-cargo', 'layout');
        return adminCompanySchema.parse(await response.json());
    });
}

const relationDecisionSchema = z.object({
    relationId: z.number().int().positive(),
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
        revalidatePath('/admin-cargo', 'layout');
    });
}

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
        revalidatePath('/admin-cargo', 'layout');
    });
}

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
        revalidatePath('/admin-cargo', 'layout');
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
        revalidatePath('/admin-cargo', 'layout');
    });
}

export async function createCargoDriverAction(
    input: z.input<typeof newDriverSchema>
) {
    return result(async () => {
        const value = newDriverSchema.parse(input);
        const response = await cargoFetch('admin_cargo', 'admin/drivers/', {
            method: 'POST',
            body: JSON.stringify(value),
        });
        revalidatePath('/admin-cargo', 'layout');
        return cargoDriverSchema.parse(await response.json());
    });
}

export async function createDriverInviteAction(driverId: number) {
    return result(async () => {
        const response = await cargoFetch(
            'admin_cargo',
            `admin/drivers/${z.number().int().positive().parse(driverId)}/invite/`,
            { method: 'POST' }
        );
        return z
            .object({ invite_token: z.string(), expires_at: z.string() })
            .parse(await response.json());
    });
}

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
        revalidatePath('/admin-cargo', 'layout');
        return cargoVehicleSchema.parse(await response.json());
    });
}

export async function createCargoWarehouseAction(input: {
    name: string;
    address: string;
}) {
    return result(async () => {
        const value = warehouseInputSchema.parse(input);
        const response = await cargoFetch('admin_cargo', 'admin/warehouses/', {
            method: 'POST',
            body: JSON.stringify(value),
        });
        revalidatePath('/admin-cargo', 'layout');
        return warehouseSchema.passthrough().parse(await response.json());
    });
}

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
        revalidatePath('/admin-cargo', 'layout');
        return adminStockSchema.passthrough().parse(await response.json());
    });
}

export async function adjustCargoStockAction(input: {
    lotId: number;
    delta: number;
    reason: string;
}) {
    return result(async () => {
        const value = adjustmentSchema.parse(input);
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
        revalidatePath('/admin-cargo', 'layout');
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
