import { dayjsExt } from '@/lib/dayjs';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

export const profileSchema = z.object({
    full_name: z.string().min(5, 'Введите полное ФИО'),
    // email: z.string().email('Введите корректный email').optional(),
    document_type: z
        .string({ message: 'Выберите тип документа' })
        .min(2, 'Выберите тип документа'),
    document_number_or_iin: z
        .string({ message: 'Введите номер документа или ИИН' })
        .min(5, 'Введите номер документа или ИИН'),
    birth_date: z
        .string({ message: 'Введите дату рождения' })
        .min(5, 'Введите дату рождения')
        .refine(
            (date) => {
                const parsedDate = dayjsExt(date, 'DD.MM.YYYY', true);
                return (
                    parsedDate.isValid() &&
                    parsedDate.isBefore(dayjsExt()) &&
                    parsedDate.isAfter('1900-01-01')
                );
            },
            { message: 'Введите корректную дату рождения в формате ДД.ММ.ГГГГ' }
        ),
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
        .min(5, 'Введите дату рождения')
        .refine(
            (date) => {
                const parsedDate = dayjsExt(date, 'DD.MM.YYYY');
                return (
                    parsedDate.isValid() &&
                    parsedDate.isBefore(dayjsExt()) &&
                    parsedDate.isAfter('1900-01-01')
                );
            },
            { message: 'Введите корректную дату рождения в формате ДД.ММ.ГГГГ' }
        ),
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
        .trim()
        .min(1, 'Введите логин')
        .max(150, 'Логин слишком длинный'),
    password: z
        .string({ message: 'Введите пароль' })
        .min(1, 'Введите пароль')
        .max(128, 'Пароль слишком длинный'),
});

export const bookTicketSchema = z.object({
    direction: z.number(),
    place_num: z.number(),
    place_floor: z.number(),
});

export const driverSchema = z
    .object({
        full_name: z
            .string({
                required_error: 'Введите полное ФИО',
                invalid_type_error: 'Введите полное ФИО',
            })
            .trim()
            .min(5, 'Введите полное ФИО')
            .max(150, 'ФИО слишком длинное'),
        date_of_birth: z
            .string({
                required_error: 'Выберите дату рождения',
                invalid_type_error: 'Выберите дату рождения',
            })
            .min(1, 'Выберите дату рождения')
            .refine(
                (date) => {
                    if (!date) return true;

                    const parsedDate = dayjsExt(date, 'YYYY-MM-DD', true);
                    return (
                        parsedDate.isValid() &&
                        !parsedDate.isAfter(dayjsExt(), 'day') &&
                        parsedDate.isAfter('1900-01-01', 'day')
                    );
                },
                { message: 'Выберите корректную дату рождения' }
            ),
        license_number: z
            .string({
                required_error: 'Введите номер водительских прав',
                invalid_type_error: 'Введите номер водительских прав',
            })
            .trim()
            .min(5, 'Введите номер водительских прав')
            .max(50, 'Номер водительских прав слишком длинный'),
        license_issue_date: z
            .string({
                required_error: 'Выберите дату выдачи водительских прав',
                invalid_type_error: 'Выберите дату выдачи водительских прав',
            })
            .min(1, 'Выберите дату выдачи водительских прав')
            .refine(
                (date) => {
                    if (!date) return true;

                    const parsedDate = dayjsExt(date, 'YYYY-MM-DD', true);
                    return (
                        parsedDate.isValid() &&
                        !parsedDate.isAfter(dayjsExt(), 'day')
                    );
                },
                { message: 'Выберите корректную дату выдачи' }
            ),
        picture: z
            .instanceof(File, {
                message: 'Выберите изображение',
            })
            .refine(
                (file) => file.size <= MAX_FILE_SIZE,
                'Максимальный размер фото — 5 MB'
            )
            .refine(
                (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
                'Допустимы изображения JPEG, PNG или WebP'
            )
            .optional(),
    })
    .superRefine((data, context) => {
        const birthDate = dayjsExt(data.date_of_birth, 'YYYY-MM-DD', true);
        const licenseDate = dayjsExt(
            data.license_issue_date,
            'YYYY-MM-DD',
            true
        );

        if (
            birthDate.isValid() &&
            licenseDate.isValid() &&
            !licenseDate.isAfter(birthDate, 'day')
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['license_issue_date'],
                message: 'Дата выдачи должна быть позже даты рождения',
            });
        }
    });

export const busSeatSchema = z.object({
    seat_id: z.number().int().nonnegative(),
    seat_col: z.number().int().nonnegative(),
    seat_row: z.number().int().nonnegative(),
    seat_type: z.enum(['aisle', 'passenger', 'driver']),
});

export const busSchema = z
    .object({
        name: z
            .string({ required_error: 'Введите внутреннее название автобуса' })
            .trim()
            .min(1, 'Введите внутреннее название автобуса')
            .max(255, 'Название слишком длинное'),
        stamp: z
            .string({ required_error: 'Введите марку автобуса' })
            .trim()
            .min(1, 'Введите марку автобуса')
            .max(255, 'Марка слишком длинная'),
        model: z
            .string({ required_error: 'Введите модель автобуса' })
            .trim()
            .min(1, 'Введите модель автобуса')
            .max(255, 'Модель слишком длинная'),
        state_number: z
            .string({ required_error: 'Введите государственный номер' })
            .trim()
            .min(1, 'Введите государственный номер')
            .max(10, 'Государственный номер слишком длинный'),
        VIN: z
            .string({ required_error: 'Введите VIN' })
            .trim()
            .min(1, 'Введите VIN')
            .max(17, 'VIN не должен быть длиннее 17 символов'),
        count_of_seats: z.coerce
            .number({
                required_error: 'Введите количество мест',
                invalid_type_error: 'Введите количество мест',
            })
            .int('Количество мест должно быть целым числом')
            .positive('Количество мест должно быть больше 0'),
        floors: z.coerce
            .number({
                required_error: 'Выберите количество этажей',
                invalid_type_error: 'Выберите количество этажей',
            })
            .int()
            .refine((value) => value === 1 || value === 2, {
                message: 'Количество этажей должно быть 1 или 2',
            }),
        have_toilet: z.boolean().default(false),
        have_wifi: z.boolean().default(false),
        is_recumbent: z.boolean().default(false),
        seats: z
            .array(busSeatSchema)
            .min(1, 'Настройте схему автобуса хотя бы с одним местом'),
    })
    .superRefine((data, context) => {
        const passengerSeats = data.seats.filter(
            (seat) => seat.seat_type === 'passenger'
        ).length;

        if (passengerSeats !== data.count_of_seats) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['seats'],
                message:
                    'Количество пассажирских мест в схеме должно совпадать с указанным количеством мест',
            });
        }
    });

const durationSchema = z
    .string({ required_error: 'Введите время' })
    .trim()
    .regex(
        /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        'Введите время в формате ЧЧ:ММ:СС'
    );

const routeCitySchema = z.object({
    name: z
        .string({ required_error: 'Введите город' })
        .trim()
        .min(2, 'Введите город')
        .max(255, 'Город слишком длинный'),
    region: z
        .string({ required_error: 'Введите регион' })
        .trim()
        .min(2, 'Введите регион')
        .max(255, 'Регион слишком длинный'),
});

export const routeStopSchema = z.object({
    id: z.number().int().positive().optional(),
    name: z
        .string({ required_error: 'Введите название остановки' })
        .trim()
        .min(2, 'Введите название остановки')
        .max(255, 'Название остановки слишком длинное'),
    travel_time_from_start: durationSchema,
    stop_time: durationSchema,
});

export const routeSchema = z
    .object({
        start_city: routeCitySchema,
        end_city: routeCitySchema,
        total_travel_time: durationSchema,
        stops: z.array(routeStopSchema).default([]),
    })
    .superRefine((data, context) => {
        const sameCity =
            data.start_city.name.toLowerCase() ===
                data.end_city.name.toLowerCase() &&
            data.start_city.region.toLowerCase() ===
                data.end_city.region.toLowerCase();

        if (sameCity) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['end_city', 'name'],
                message:
                    'Город прибытия должен отличаться от города отправления',
            });
        }
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
