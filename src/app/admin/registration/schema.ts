import { z } from 'zod';

export const companyPhoneSchema = z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9\s()+-]+$/, 'Используйте только цифры и символы + ( ) -')
    .transform((value) => value.replace(/[^0-9]/g, ''))
    .pipe(
        z
            .string()
            .regex(
                /^7[0-9]{10}$/,
                'Введите номер Казахстана: 11 цифр, начиная с 7'
            )
    );

export const companyRegistrationSchema = z
    .object({
        phone_number: companyPhoneSchema,
        code: z.string().regex(/^[0-9]{4}$/, 'Введите четыре цифры из SMS'),
        full_name: z.string().trim().min(3, 'Укажите ФИО владельца').max(255),
        password: z
            .string()
            .min(8, 'Пароль должен содержать минимум 8 символов')
            .max(128),
        repeat_password: z.string().max(128),
        legal_name: z
            .string()
            .trim()
            .min(2, 'Укажите название компании')
            .max(255),
        bin_iin: z
            .string()
            .regex(/^[0-9]{12}$/, 'БИН / ИИН должен содержать 12 цифр'),
        city: z.string().trim().min(1, 'Укажите город').max(120),
        address: z.string().trim().max(500),
        email: z.union([
            z.literal(''),
            z.string().trim().email('Проверьте email').max(254),
        ]),
    })
    .refine((value) => value.password === value.repeat_password, {
        path: ['repeat_password'],
        message: 'Пароли не совпадают',
    });

export type CompanyRegistrationInput = z.input<
    typeof companyRegistrationSchema
>;
