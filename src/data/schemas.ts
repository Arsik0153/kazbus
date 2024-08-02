import { z } from 'zod';

export const profileSchema = z.object({
    full_name: z.string().min(5, 'Введите полное ФИО'),
    email: z.string().email('Введите корректный email').optional(),
    document_type: z
        .string({ message: 'Выберите тип документа' })
        .min(3, 'Выберите тип документа'),
    document_number_or_iin: z
        .string({ message: 'Введите номер документа или ИИН' })
        .min(5, 'Введите номер документа или ИИН'),
    birth_date: z
        .string({ message: 'Введите дату рождения' })
        .min(5, 'Введите дату рождения'),
});

export const editProfileSchema = z.object({
    document_type: z
        .string({ message: 'Выберите тип документа' })
        .min(3, 'Выберите тип документа'),
    document_number_or_iin: z
        .string({ message: 'Введите номер документа или ИИН' })
        .min(5, 'Введите номер документа или ИИН'),
    birth_date: z
        .string({ message: 'Введите дату рождения' })
        .min(5, 'Введите дату рождения'),
});
