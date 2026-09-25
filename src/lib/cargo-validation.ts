import { z } from 'zod';

export const requiredText = (max: number) =>
    z
        .string()
        .trim()
        .min(1, 'Заполните поле')
        .max(max, `Не больше ${max} символов`);
const optionalText = (max: number) =>
    z.string().trim().max(max, `Не больше ${max} символов`);
export const cargoPhoneSchema = z
    .string()
    .trim()
    .regex(/^[0-9+()\s-]+$/, 'Введите телефон без букв и посторонних символов')
    .transform((value) => value.replace(/[+()\s-]/g, ''))
    .pipe(z.string().regex(/^7[0-9]{10}$/, 'Введите 11 цифр, начиная с 7'));
export const cargoBinSchema = z
    .string()
    .trim()
    .regex(/^[0-9]{12}$/, 'Введите 12 цифр БИН / ИИН');
export const cargoEmailSchema = optionalText(254).refine(
    (value) => !value || z.string().email().safeParse(value).success,
    'Введите корректный email'
);
export const cargoDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Укажите дату')
    .refine((value) => {
        const date = new Date(`${value}T00:00:00Z`);
        return (
            value >= '0001-01-01' &&
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value
        );
    }, 'Укажите существующую дату');
export const cargoAmountSchema = z
    .string()
    .trim()
    .transform((value) => value.replace(',', '.'))
    .pipe(
        z
            .string()
            .regex(
                /^\d{1,12}(\.\d{1,2})?$/,
                'Введите сумму до 12 цифр и не больше 2 знаков после запятой'
            )
    )
    .refine((value) => Number(value) > 0, 'Сумма должна быть больше нуля');
const quantity = z
    .number()
    .finite('Введите число')
    .min(0, 'Количество не может быть отрицательным')
    .max(999999999999.999, 'Слишком большое количество')
    .refine(
        (value) => Math.abs(value * 1000 - Math.round(value * 1000)) < 0.0001,
        'Не больше 3 знаков после запятой'
    );
export const cargoIdSchema = z.number().int().positive('Выберите значение');
export const companyUpdateSchema = z.object({
    name: requiredText(255),
    city: requiredText(120),
    contactPhone: cargoPhoneSchema,
    email: cargoEmailSchema,
    description: optionalText(10000),
    isSearchable: z.boolean(),
});
export const newDriverSchema = z.object({
    full_name: requiredText(255),
    phone_number: cargoPhoneSchema,
    license_number: requiredText(50),
    status: z.enum(['active', 'inactive']),
});
export const newVehicleSchema = z.object({
    model: requiredText(120),
    plate_number: requiredText(20).transform((value) => value.toUpperCase()),
    trailer_number: optionalText(20).transform((value) => value.toUpperCase()),
    kind: requiredText(50),
    capacity_tons: quantity
        .refine((value) => value <= 9999999.999, 'Не больше 9 999 999,999 т')
        .refine(
            (value) => value > 0,
            'Грузоподъёмность должна быть больше нуля'
        ),
    status: z.enum(['active', 'inactive']),
});
export const warehouseInputSchema = z.object({
    name: requiredText(255),
    address: requiredText(500),
});
export const offerInputSchema = z.object({
    orderId: cargoIdSchema,
    kind: z.enum(['offer', 'surcharge']),
    amount: cargoAmountSchema,
    eta: cargoDateSchema,
    routeText: optionalText(1000),
    reason: requiredText(10000),
});
export const assignmentSchema = z.object({
    orderId: cargoIdSchema,
    driverId: cargoIdSchema,
    vehicleId: cargoIdSchema,
    eta: cargoDateSchema,
});
export const stockInputSchema = z.object({
    warehouseId: cargoIdSchema,
    shipperId: cargoIdSchema,
    cargo: requiredText(500),
    sku: optionalText(120),
    unit: z.enum(['шт.', 'коробок', 'паллет', 'кг', 'т']),
    onHand: quantity,
    source: requiredText(500),
});
export const adjustmentSchema = z.object({
    lotId: cargoIdSchema,
    delta: z
        .number()
        .finite('Введите число')
        .refine((value) => value !== 0, 'Корректировка не может быть нулевой')
        .refine(
            (value) => quantity.safeParse(Math.abs(value)).success,
            'Допустимо до 12 цифр и 3 знаков после запятой'
        ),
    reason: requiredText(500),
});

const formNumber = z
    .string()
    .trim()
    .min(1, 'Заполните поле')
    .transform((value) => Number(value.replace(',', '.')));
export const cargoFormSchemas = {
    company: companyUpdateSchema
        .omit({ contactPhone: true, isSearchable: true })
        .extend({ contact_phone: cargoPhoneSchema }),
    driver: newDriverSchema.omit({ status: true }),
    vehicle: newVehicleSchema
        .omit({ status: true, capacity_tons: true })
        .extend({
            capacity_tons: formNumber.pipe(
                newVehicleSchema.shape.capacity_tons
            ),
        }),
    warehouse: warehouseInputSchema,
    offer: offerInputSchema.pick({ amount: true, eta: true, reason: true }),
    assignment: z.object({
        driver_id: formNumber.pipe(cargoIdSchema),
        vehicle_id: formNumber.pipe(cargoIdSchema),
        eta: cargoDateSchema,
    }),
    stock: stockInputSchema
        .omit({ warehouseId: true, shipperId: true, onHand: true })
        .extend({
            warehouse_id: formNumber.pipe(cargoIdSchema),
            shipper_id: formNumber.pipe(cargoIdSchema),
            on_hand: formNumber.pipe(quantity),
        }),
    adjustment: adjustmentSchema
        .omit({ lotId: true, delta: true })
        .extend({ delta: formNumber.pipe(adjustmentSchema.shape.delta) }),
    login: z.object({
        phone_number: cargoPhoneSchema,
        password: z.string().min(1, 'Введите пароль'),
    }),
    registration: z
        .object({
            phone_number: cargoPhoneSchema,
            contact_phone: cargoPhoneSchema,
            password: z.string().min(8, 'Не меньше 8 символов'),
            password_confirm: z.string(),
            full_name: requiredText(255),
            company_name: requiredText(255),
            bin_iin: cargoBinSchema,
            city: requiredText(120),
            email: cargoEmailSchema,
            description: optionalText(10000),
        })
        .refine((value) => value.password === value.password_confirm, {
            path: ['password_confirm'],
            message: 'Пароли не совпадают',
        }),
};

export function cargoValidationErrors(
    error: z.ZodError
): Record<string, string> {
    return Object.fromEntries(
        error.issues.map((issue) => [
            String(issue.path[0] ?? ''),
            issue.message,
        ])
    );
}

export function formatCargoPhone(value: string) {
    const parsed = cargoPhoneSchema.safeParse(value);
    if (!parsed.success) return value;
    const digits = parsed.data;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
}
export function formatCargoNumber(value: number) {
    return new Intl.NumberFormat('ru-KZ', { maximumFractionDigits: 3 }).format(
        value
    );
}
export function formatCargoDate(value: string) {
    if (!cargoDateSchema.safeParse(value).success) return value;
    return new Intl.DateTimeFormat('ru-KZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Almaty',
    }).format(new Date(`${value}T00:00:00Z`));
}

const cargoFieldAliases: Record<string, string> = {
    contactPhone: 'contact_phone',
    driverId: 'driver_id',
    vehicleId: 'vehicle_id',
    warehouseId: 'warehouse_id',
    shipperId: 'shipper_id',
    onHand: 'on_hand',
    cargo_description: 'cargo',
};
export function cargoFieldErrors(fields: Record<string, string>) {
    return Object.fromEntries(
        Object.entries(fields).map(([key, message]) => [
            cargoFieldAliases[key] ?? key,
            message,
        ])
    );
}
export function parseCargoApiErrors(payload: unknown) {
    const parsed = z.record(z.unknown()).safeParse(payload);
    const fields: Record<string, string> = {};
    let message: string | undefined;
    if (parsed.success) {
        for (const [key, value] of Object.entries(parsed.data)) {
            const text =
                typeof value === 'string'
                    ? value
                    : Array.isArray(value)
                      ? value.find(
                            (item): item is string => typeof item === 'string'
                        )
                      : undefined;
            if (!text) continue;
            if (
                key === 'detail' ||
                key === 'non_field_errors' ||
                key === 'error'
            )
                message ??= text;
            else fields[key] = text;
        }
    }
    return {
        message: message ?? Object.values(fields)[0],
        fieldErrors: cargoFieldErrors(fields),
    };
}
