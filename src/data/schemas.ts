import { z } from 'zod';

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

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

export const passwordSchema = z
    .object({
        password: z
            .string({ message: 'Введите пароль' })
            .min(8, 'Пароль должен содержать минимум 8 символов'),
        repeatPassword: z
            .string({ message: 'Повторите пароль' })
            .min(8, 'Повторите пароль'),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: 'Пароли не совпадают',
        path: ['repeatPassword'],
    });

export const loginSchema = z.object({
    phone_number: z
        .string({ message: 'Введите номер телефона' })
        .min(5, 'Введите номер телефона'),
    password: z
        .string({ message: 'Введите пароль' })
        .min(8, 'Пароль должен содержать минимум 8 символов'),
});
export const adminLoginSchema = z.object({
    username: z
        .string({ message: 'Введите логин' })
        .min(4, 'Введите логин'),
    password: z
        .string({ message: 'Введите пароль' })
        .min(1, 'Пароль должен содержать минимум 1 символов'),
});

export const bookTicketSchema = z.object({
    direction: z.number(),
    place_num: z.number(),
    place_floor: z.number(),
});

export const driverSchema = z.object({
    full_name: z.string().min(5, 'Введите полное ФИО'),
    date_of_birth: z
        .string({ message: 'Введите дату рождения' })
        .min(5, 'Введите дату рождения'),
    license_number: z
        .string({ message: 'Введите номер водительских прав' })
        .min(5, 'Введите номер водительских прав'),
    license_issue_date: z
        .string({ message: 'Введите дату выдачи водительских прав' })
        .min(5, 'Введите дату выдачи водительских прав'),
    picture: z
        .instanceof(File, {
            message: 'Выберите изображение',
        })
        .refine((file: File) => file?.size, 'Выберите изображение')
        .refine(
            (file) => file?.size <= MAX_FILE_SIZE,
            `Максимальный вес фото - 5MB.`
        )
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            'Неверный формат файла'
        ),
});

const PassengerSchema = z.object({
    passenger: z.number().nullable(),
    place_num: z.number(),
    place_floor: z.number(),
});

const TicketsSchema = z.object({
    direction: z.number(),
    tickets: z.array(PassengerSchema),
});

const SingleTicketSchema = z.object({
    direction: z.number(),
    place_num: z.number(),
    place_floor: z.number(),
});

export const CombinedBookingSchema = z.union([
    TicketsSchema,
    SingleTicketSchema,
]);


export const NewTripSchema = z.object({
    departure_time: z
        .string({ message: 'Укажите время отправления' })
        .min(1, 'Время отправления не может быть пустым'),
    start_date: z
        .string({ message: 'Укажите дату начала' })
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты начала (ожидается YYYY-MM-DD)'),
    end_date: z
        .string({ message: 'Укажите дату окончания' })
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты окончания (ожидается YYYY-MM-DD)'),
    ticket_price: z
        .string({ message: 'Укажите цену билета' })
        .regex(/^\d+(\.\d{1,2})?$/, 'Неверный формат цены (ожидается число с двумя десятичными знаками)'),
    frequency: z
        .string({ message: 'Укажите частоту рейса' })
        .min(1, 'Частота рейса не может быть пустой')
        .max(255, 'Частота рейса слишком длинная'),
    weekdays: z.array(z.string()).min(1, 'Выберите хотя бы один день недели'),
    status: z.enum(['active', 'not_on_sale', 'cancelled', 'scheduled'], {
        message: 'Укажите статус рейса',
    }),
    route: z.object({
        id: z.number().int(),
        start_city: z.object({
            id: z.number().int(),
            name: z.string().min(1),
            region: z.string().min(1)
        }),
        end_city: z.object({
            id: z.number().int(),
            name: z.string().min(1),
            region: z.string().min(1)
        }),
        total_travel_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Неверный формат времени (ожидается HH:MM:SS)'),
        created_at: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Неверный формат даты (ожидается ISO формат)'),
        // stops: z.array(
        //     z.object({
        //         id: z.number().int(),
        //         name: z.string().min(1),
        //         travel_time_from_start: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Неверный формат времени (ожидается HH:MM:SS)'),
        //         stop_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Неверный формат времени остановки (ожидается HH:MM:SS)')
        //     })
        // )
    }),
    bus: z.object({
        name: z
            .string({ message: 'Укажите название автобуса' })
            .min(1, 'Название автобуса не может быть пустым')
            .max(255, 'Название автобуса слишком длинное'),
        state_number: z
            .string({ message: 'Укажите государственный номер автобуса' })
            .min(1, 'Государственный номер не может быть пустым')
            .max(10, 'Государственный номер слишком длинный'),
        VIN: z
            .string({ message: 'Укажите VIN автобуса' })
            .min(1, 'VIN не может быть пустым')
            .max(17, 'VIN слишком длинный'),
        count_of_seats: z
            .number()
            .int()
            .min(0, 'Количество мест не может быть отрицательным')
            .max(9223372036854776000, 'Слишком большое количество мест'),
        have_toilet: z.boolean({ message: 'Укажите наличие туалета' }),
        have_wifi: z.boolean({ message: 'Укажите наличие Wi-Fi' }),
        is_recumbent: z.boolean({ message: 'Укажите наличие лежачих мест' }),
        floors: z.union([z.literal(1), z.literal(2)], { message: 'Количество этажей может быть только 1 или 2' }),
    }),
    driver: z.object({
        full_name: z
            .string({ message: 'Укажите полное имя водителя' })
            .min(1, 'Полное имя не может быть пустым')
            .max(255, 'Полное имя слишком длинное'),
        date_of_birth: z
            .string({ message: 'Укажите дату рождения водителя' })
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты рождения (ожидается YYYY-MM-DD)'),
    }),
});
