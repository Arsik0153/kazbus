import { z } from 'zod';

const decimal = z
    .union([z.string(), z.number()])
    .transform(Number)
    .refine(Number.isFinite, 'Ожидалось десятичное число');

export const cargoRoleSchema = z.enum([
    'shipper',
    'admin_cargo',
    'cargo_driver',
]);
export type CargoRole = z.infer<typeof cargoRoleSchema>;

export const cargoUserSchema = z.object({
    id: z.number().int().positive(),
    phone_number: z.string(),
    full_name: z.string(),
});

export const cargoAuthResponseSchema = z.object({
    token: z.string().min(1),
    role: cargoRoleSchema,
    user: cargoUserSchema,
});

export const cargoMeSchema = z.object({
    user: cargoUserSchema,
    roles: z.array(cargoRoleSchema),
    shipper_profile: z.unknown().nullable(),
    cargo_company: z.unknown().nullable(),
    cargo_driver: z.unknown().nullable(),
});

const contactSchema = z.object({
    name: z.string(),
    role: z.string(),
    phone: z.string(),
});

const stageSchema = z.object({
    id: z.string(),
    from: z.string(),
    to: z.string(),
    transport: z.string(),
    status: z.enum(['done', 'current', 'next']),
    date: z.string(),
    contacts: z.array(contactSchema),
});

const offerSchema = z.object({
    id: z.string(),
    amount: decimal,
    eta: z.string(),
    reason: z.string(),
    status: z.enum(['pending', 'accepted', 'declined']),
    kind: z.enum(['initial', 'extra']),
});

const issueSchema = z.object({
    id: z.string(),
    text: z.string(),
    date: z.string(),
    files: z.array(z.object({ id: z.string(), name: z.string() })),
});

const orderStatusSchema = z.enum([
    'waiting',
    'offer',
    'planned',
    'transit',
    'delivered',
    'cancelled',
    'rejected',
]);

export const shipperOrderSchema = z.object({
    recordId: z.number().int().positive(),
    id: z.string(),
    companyId: z.string(),
    from: z.string(),
    to: z.string(),
    pickup: z.string(),
    date: z.string(),
    cargo: z.string(),
    quantity: decimal,
    unit: z.enum(['шт.', 'коробок', 'паллет', 'кг', 'т']),
    weight: decimal.optional(),
    dimensions: z.string().optional().default(''),
    comment: z.string().default(''),
    status: orderStatusSchema,
    stages: z.array(stageSchema),
    updated: z.string(),
    files: z.array(z.object({ id: z.string(), name: z.string() })),
    issues: z.array(issueSchema),
    offer: offerSchema.optional(),
    extra: offerSchema.optional(),
    agreedPrice: decimal.optional(),
    delay: z.string().optional(),
    originalEta: z.string().optional(),
    invoice: z
        .object({
            number: z.string(),
            amount: decimal,
            paid: z.boolean(),
        })
        .optional(),
    proof: z.string().optional(),
});

export const shipperStateSchema = z.object({
    version: z.literal(1),
    profile: z.object({
        name: z.string(),
        company: z.string(),
        phone: z.string(),
        city: z.string(),
        bin: z.string(),
        notifications: z.boolean(),
    }),
    companies: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            city: z.string(),
            description: z.string(),
            relation: z.enum(['confirmed', 'requested', 'available']),
            phone: z.string(),
        })
    ),
    orders: z.array(shipperOrderSchema),
    supplies: z.array(z.never()),
    batches: z.array(z.never()),
});

const adminOrderSchema = shipperOrderSchema
    .omit({ offer: true, extra: true, agreedPrice: true })
    .extend({
        shipper: z.object({
            id: z.number().int().positive(),
            name: z.string(),
            company: z.string(),
            phone: z.string(),
        }),
    });

export const cargoDriverSchema = z.object({
    id: z.number().int().positive(),
    full_name: z.string(),
    phone_number: z.string(),
    license_number: z.string(),
    status: z.enum(['active', 'inactive']),
    account_status: z.enum(['active', 'pending']),
    created_at: z.string(),
    updated_at: z.string(),
});

export const cargoVehicleSchema = z.object({
    id: z.number().int().positive(),
    model: z.string(),
    plate_number: z.string(),
    trailer_number: z.string(),
    kind: z.string(),
    capacity_tons: decimal,
    status: z.enum(['active', 'inactive']),
    created_at: z.string(),
    updated_at: z.string(),
});

export const adminCompanySchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    bin: z.string(),
    city: z.string(),
    status: z.enum(['active', 'suspended']),
    contactPhone: z.string(),
    email: z.string(),
    description: z.string(),
    isSearchable: z.boolean(),
});

export const adminStateSchema = z.object({
    company: adminCompanySchema,
    relations: z.array(
        z.object({
            id: z.number().int().positive(),
            status: z.enum(['requested', 'confirmed', 'rejected', 'blocked']),
            comment: z.string(),
            requestedAt: z.string(),
            handledAt: z.string().nullable(),
            shipper: z.object({
                id: z.number().int().positive(),
                name: z.string(),
                company: z.string(),
                phone: z.string(),
                city: z.string(),
            }),
        })
    ),
    orders: z.array(adminOrderSchema),
    drivers: z.array(cargoDriverSchema),
    vehicles: z.array(cargoVehicleSchema),
    trips: z.array(
        z.object({
            id: z.number().int().positive(),
            orderRecordId: z.number().int().positive(),
            orderId: z.string(),
            status: z.enum([
                'planned',
                'loading',
                'in_transit',
                'unloading',
                'completed',
            ]),
            eta: z.string(),
            driverId: z.number().int().positive(),
            vehicleId: z.number().int().positive(),
            updated: z.string(),
        })
    ),
});

export const driverTripSchema = z.object({
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
    order: z.object({
        recordId: z.number().int().positive(),
        id: z.string(),
        from: z.string(),
        to: z.string(),
        pickup: z.string(),
        date: z.string(),
        cargo: z.string(),
        quantity: decimal,
        unit: z.string(),
        comment: z.string(),
    }),
    vehicle: z.object({
        id: z.number().int().positive(),
        model: z.string(),
        plateNumber: z.string(),
        trailerNumber: z.string(),
        kind: z.string(),
    }),
    stages: z.array(stageSchema),
});

export const driverStateSchema = z.object({
    profile: z.object({
        id: z.number().int().positive(),
        fullName: z.string(),
        phone: z.string(),
        company: z.object({ id: z.number(), name: z.string() }),
    }),
    trips: z.array(driverTripSchema),
});

export type ShipperState = z.infer<typeof shipperStateSchema>;
export type AdminCargoState = z.infer<typeof adminStateSchema>;
export type DriverState = z.infer<typeof driverStateSchema>;
export type DriverTrip = z.infer<typeof driverTripSchema>;
