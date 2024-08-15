import { z } from 'zod';

export const profileSchema = z.object({
    full_name: z.string().min(5, 'Введите полное ФИО'),
    email: z.string().email('Введите корректный email').optional(),
    document_type: z
        .string({ message: 'Выберите тип документа' })
        .min(2, 'Выберите тип документа'),
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
        .min(2, 'Выберите тип документа'),
    document_number_or_iin: z
        .string({ message: 'Введите номер документа или ИИН' })
        .min(5, 'Введите номер документа или ИИН'),
    birth_date: z
        .string({ message: 'Введите дату рождения' })
        .min(5, 'Введите дату рождения'),
});


// export const adminLogin = z.object({
//     document_adminName: z
//     .string({ message: 'Введите имя пользователя' })
//     .min(2, 'Введите пароль'),
//     document_password: z
//         .string({ message: 'Введите пароль' })
//         .min(2, 'Введите пароль'),
// });

export const contactsSchema = z.object({
    phone: z
        .string({ message: 'Введите номер телефона' })
        .min(5, 'Введите номер телефона'),
    email: z
        .union([z.string().email('Введите корректный email'), z.literal('')])
        .optional(),
});
