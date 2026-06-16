import type {
    SupportTicket,
    SupportTicketPriority,
    SupportTicketStatus,
} from './types';

export const supportStatusLabel: Record<SupportTicketStatus, string> = {
    new: 'Новый',
    inProgress: 'В работе',
    closed: 'Закрыт',
};

export const supportPriorityLabel: Record<SupportTicketPriority, string> = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
};

export const supportStatusStyles: Record<SupportTicketStatus, string> = {
    new: 'bg-[#FFE8E8] text-[#E32B2B]',
    inProgress: 'bg-[#FFF3D7] text-[#B7791F]',
    closed: 'bg-[#DCFCE7] text-[#15803D]',
};

export const supportPriorityStyles: Record<SupportTicketPriority, string> = {
    high: 'bg-[#FFE8E8] text-[#E32B2B]',
    medium: 'bg-[#E8F1FF] text-[#2563EB]',
    low: 'bg-[#EEF2F7] text-[#64748B]',
};

export const supportRoleLabel: Record<SupportTicket['requesterRole'], string> =
    {
        passenger: 'Пассажир',
        busDriver: 'Водитель',
        dispatcher: 'Диспетчер',
    };

export const supportTicketsMock: SupportTicket[] = [
    {
        id: 'TK-1025',
        requesterRole: 'busDriver',
        userName: 'Руслан Омаров',
        userPhone: '+7 701 555 13 26',
        subject: 'Задержка или внеплановая остановка',
        preview:
            'В рейсе Алматы - Шымкент нужна помощь поддержки: задержка отправления на платформе.',
        category: 'Водитель',
        status: 'new',
        priority: 'high',
        createdAt: 'Сегодня, 11:06',
        lastMessageAt: 'Сейчас',
        assignedTo: 'Не назначен',
        trip: 'Алматы - Шымкент, 21:30',
        messages: [
            {
                author: 'user',
                text: 'Добрый день. Рейс задерживается из-за технической проверки. Нужна помощь с уведомлением пассажиров.',
                time: '11:06',
            },
        ],
    },
    {
        id: 'TK-1024',
        requesterRole: 'passenger',
        userName: 'Айгерим Нурланова',
        userPhone: '+7 701 233 44 55',
        subject: 'Не пришёл билет после оплаты',
        preview:
            'Оплатила билет Алматы - Астана, деньги списались, но билет не появился в приложении.',
        category: 'Оплата',
        status: 'new',
        priority: 'high',
        createdAt: 'Сегодня, 10:42',
        lastMessageAt: '2 мин назад',
        assignedTo: 'Не назначен',
        trip: 'Алматы - Астана, 18:30',
        messages: [
            {
                author: 'user',
                text: 'Здравствуйте! Я оплатила билет, но он не появился в моих поездках.',
                time: '10:42',
            },
            {
                author: 'user',
                text: 'Чек Kaspi есть, могу отправить скриншот.',
                time: '10:45',
            },
        ],
    },
    {
        id: 'TK-1023',
        requesterRole: 'passenger',
        userName: 'Ербол Садыков',
        userPhone: '+7 777 019 18 21',
        subject: 'Водитель не отвечает на звонки',
        preview:
            'Пассажир ждёт посадку, водитель не берёт трубку, нужно уточнить статус рейса.',
        category: 'Рейс',
        status: 'inProgress',
        priority: 'medium',
        createdAt: 'Сегодня, 09:18',
        lastMessageAt: '18 мин назад',
        assignedTo: 'Алина',
        trip: 'Шымкент - Алматы, 11:00',
        messages: [
            {
                author: 'user',
                text: 'Я на автовокзале, автобус не могу найти. Водитель не отвечает.',
                time: '09:18',
            },
            {
                author: 'support',
                text: 'Ербол, здравствуйте. Проверяем рейс и свяжемся с диспетчером.',
                time: '09:20',
            },
        ],
    },
    {
        id: 'TK-1022',
        requesterRole: 'passenger',
        userName: 'Динара Ахметова',
        userPhone: '+7 705 555 88 10',
        subject: 'Нужно вернуть билет',
        preview:
            'Пассажир хочет отменить поездку и узнать сроки возврата средств на карту.',
        category: 'Возврат',
        status: 'inProgress',
        priority: 'low',
        createdAt: 'Вчера, 17:04',
        lastMessageAt: '1 ч назад',
        assignedTo: 'Марат',
        trip: 'Караганда - Павлодар, 08:15',
        messages: [
            {
                author: 'user',
                text: 'Добрый день. Я заболела, хочу вернуть билет на завтра.',
                time: '17:04',
            },
            {
                author: 'support',
                text: 'Отправили инструкцию по возврату. Деньги поступят по правилам банка.',
                time: '17:11',
            },
        ],
    },
    {
        id: 'TK-1021',
        requesterRole: 'passenger',
        userName: 'Руслан Омаров',
        userPhone: '+7 708 741 36 90',
        subject: 'Ошибка в имени пассажира',
        preview:
            'В билете допущена опечатка в фамилии, пассажир просит исправить данные.',
        category: 'Профиль',
        status: 'closed',
        priority: 'low',
        createdAt: '12 июн, 14:20',
        lastMessageAt: 'Вчера',
        assignedTo: 'Алина',
        trip: 'Астана - Костанай, 07:40',
        messages: [
            {
                author: 'user',
                text: 'В билете фамилия написана с ошибкой. Можно исправить?',
                time: '14:20',
            },
            {
                author: 'support',
                text: 'Исправили данные пассажира. Новый билет доступен в приложении.',
                time: '14:34',
            },
        ],
    },
];
