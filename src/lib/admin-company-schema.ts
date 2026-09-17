import { z } from 'zod';

const optionalText = (max: number) => z.string().trim().max(max);

export const companyProfileSchema = z.object({
    legal_name: optionalText(255),
    bin_iin: z
        .string()
        .trim()
        .refine(
            (value) => value === '' || /^\d{12}$/.test(value),
            'Введите 12 цифр'
        ),
    city: optionalText(120),
    address: optionalText(500),
    contact_phone: z
        .string()
        .trim()
        .refine(
            (value) => value === '' || /^7\d{10}$/.test(value),
            'Введите номер из 11 цифр, начиная с 7'
        ),
    email: z
        .string()
        .trim()
        .max(254)
        .refine(
            (value) =>
                value === '' || z.string().email().safeParse(value).success,
            'Введите корректный email'
        ),
    status: z.enum(['active', 'suspended']),
});

export const companyProfileInputSchema = companyProfileSchema.omit({
    status: true,
});
export const companyProfilePatchSchema = companyProfileInputSchema
    .partial()
    .refine(
        (value) => Object.keys(value).length > 0,
        'Нет изменений для сохранения'
    );

export type CompanyProfile = z.infer<typeof companyProfileSchema>;
export type CompanyProfileInput = z.infer<typeof companyProfileInputSchema>;
export type CompanyProfilePatch = z.infer<typeof companyProfilePatchSchema>;
export type CompanyProfileField = keyof CompanyProfileInput;
export type CompanyProfileFieldErrors = Partial<
    Record<CompanyProfileField, string>
>;

export function normalizeCompanyPhone(value: string) {
    return value.replace(/\D/g, '');
}

export function hasValidCompanyPhoneCharacters(value: string) {
    return /^[\d+()\s-]*$/.test(value);
}

function firstMessage(value: unknown): string | undefined {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value.find((item): item is string => typeof item === 'string');
    }
    return undefined;
}

export function parseCompanyProfileErrors(body: unknown) {
    const fieldErrors: CompanyProfileFieldErrors = {};
    let message: string | undefined;

    if (body && typeof body === 'object' && !Array.isArray(body)) {
        for (const [key, value] of Object.entries(body)) {
            const currentMessage = firstMessage(value);
            if (!currentMessage) continue;
            if (key in companyProfileInputSchema.shape) {
                fieldErrors[key as CompanyProfileField] = currentMessage;
            } else if (!message) {
                message = currentMessage;
            }
        }
    }

    return {
        fieldErrors,
        message:
            message ??
            Object.values(fieldErrors)[0] ??
            'Проверьте данные и попробуйте ещё раз.',
    };
}
