'use client';

import { useMemo, useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    MessageCircle,
    Paperclip,
    Phone,
    Search,
    Send,
    UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type TicketStatus = 'new' | 'inProgress' | 'closed';
type TicketPriority = 'high' | 'medium' | 'low';

type SupportTicket = {
    id: string;
    userName: string;
    userPhone: string;
    subject: string;
    preview: string;
    category: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    lastMessageAt: string;
    assignedTo: string;
    trip: string;
    messages: {
        author: 'user' | 'support';
        text: string;
        time: string;
    }[];
};

const statusLabel: Record<TicketStatus, string> = {
    new: 'Новый',
    inProgress: 'В работе',
    closed: 'Закрыт',
};

const priorityLabel: Record<TicketPriority, string> = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
};

const tickets: SupportTicket[] = [
    {
        id: 'TK-1024',
        userName: 'Айгерим Нурланова',
        userPhone: '+7 701 233 44 55',
        subject: 'Не пришёл билет после оплаты',
        preview:
            'Оплатила билет Алматы — Астана, деньги списались, но билет не появился в приложении.',
        category: 'Оплата',
        status: 'new',
        priority: 'high',
        createdAt: 'Сегодня, 10:42',
        lastMessageAt: '2 мин назад',
        assignedTo: 'Не назначен',
        trip: 'Алматы → Астана, 18:30',
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
        trip: 'Шымкент → Алматы, 11:00',
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
        trip: 'Караганда → Павлодар, 08:15',
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
        trip: 'Астана → Костанай, 07:40',
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

const statusStyles: Record<TicketStatus, string> = {
    new: 'bg-[#FFE8E8] text-[#E32B2B]',
    inProgress: 'bg-[#FFF3D7] text-[#B7791F]',
    closed: 'bg-[#DCFCE7] text-[#15803D]',
};

const priorityStyles: Record<TicketPriority, string> = {
    high: 'bg-[#FFE8E8] text-[#E32B2B]',
    medium: 'bg-[#E8F1FF] text-[#2563EB]',
    low: 'bg-[#EEF2F7] text-[#64748B]',
};

const SupportPage = () => {
    const [selectedTicketId, setSelectedTicketId] = useState(tickets[0].id);
    const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
    const [search, setSearch] = useState('');

    const filteredTickets = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return tickets.filter((ticket) => {
            const matchesStatus =
                statusFilter === 'all' || ticket.status === statusFilter;
            const matchesSearch =
                normalizedSearch.length === 0 ||
                [
                    ticket.id,
                    ticket.userName,
                    ticket.userPhone,
                    ticket.subject,
                    ticket.category,
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedSearch);

            return matchesStatus && matchesSearch;
        });
    }, [search, statusFilter]);

    const selectedTicket =
        filteredTickets.find((ticket) => ticket.id === selectedTicketId) ||
        filteredTickets[0] ||
        tickets[0];

    const counters = {
        new: tickets.filter((ticket) => ticket.status === 'new').length,
        inProgress: tickets.filter((ticket) => ticket.status === 'inProgress').length,
        closed: tickets.filter((ticket) => ticket.status === 'closed').length,
    };

    return (
        <div className="mt-6 flex flex-col pb-10">
            <div className="flex flex-row items-start justify-between gap-6">
                <div>
                    <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                        Служба поддержки
                    </h1>
                    <p className="mt-2 text-base text-[#7A7A7A]">
                        Единый экран для обработки обращений пассажиров,
                        водителей и диспетчеров.
                    </p>
                </div>
                <Button size="lg" className="px-8 text-base">
                    <MessageCircle />
                    Создать тикет
                </Button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-[20px] bg-white p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold uppercase text-[#A0A0A0]">
                            Новые
                        </span>
                        <AlertCircle className="h-5 w-5 text-[#E32B2B]" />
                    </div>
                    <p className="mt-3 text-[34px] font-semibold text-[#4A4A4A]">
                        {counters.new}
                    </p>
                    <p className="text-sm text-[#7A7A7A]">
                        требуют первого ответа
                    </p>
                </div>
                <div className="rounded-[20px] bg-white p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold uppercase text-[#A0A0A0]">
                            В работе
                        </span>
                        <Clock3 className="h-5 w-5 text-[#B7791F]" />
                    </div>
                    <p className="mt-3 text-[34px] font-semibold text-[#4A4A4A]">
                        {counters.inProgress}
                    </p>
                    <p className="text-sm text-[#7A7A7A]">
                        ожидают решения оператора
                    </p>
                </div>
                <div className="rounded-[20px] bg-white p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold uppercase text-[#A0A0A0]">
                            Закрытые
                        </span>
                        <CheckCircle2 className="h-5 w-5 text-[#15803D]" />
                    </div>
                    <p className="mt-3 text-[34px] font-semibold text-[#4A4A4A]">
                        {counters.closed}
                    </p>
                    <p className="text-sm text-[#7A7A7A]">
                        решены за последние сутки
                    </p>
                </div>
            </div>

            <div className="mt-5 grid min-h-[640px] grid-cols-[420px_minmax(0,1fr)] gap-5">
                <div className="rounded-[20px] bg-white p-5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A0A0A0]" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Поиск по тикетам"
                            className="bg-[#F8FAFC] pl-10"
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {([
                            ['all', 'Все'],
                            ['new', 'Новые'],
                            ['inProgress', 'В работе'],
                            ['closed', 'Закрытые'],
                        ] as const).map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setStatusFilter(value)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold duration-150 ${
                                    statusFilter === value
                                        ? 'bg-[#E32B2B] text-white'
                                        : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E8EEF6]'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                        {filteredTickets.map((ticket) => (
                            <button
                                key={ticket.id}
                                type="button"
                                onClick={() => setSelectedTicketId(ticket.id)}
                                className={`rounded-[16px] border p-4 text-left duration-150 ${
                                    selectedTicket.id === ticket.id
                                        ? 'border-[#E32B2B] bg-[#FFF7F7]'
                                        : 'border-transparent bg-[#F8FAFC] hover:border-[#FFD0D0]'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-[#A0A0A0]">
                                            {ticket.id} · {ticket.createdAt}
                                        </p>
                                        <h2 className="mt-1 text-base font-semibold text-[#4A4A4A]">
                                            {ticket.subject}
                                        </h2>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}
                                    >
                                        {statusLabel[ticket.status]}
                                    </span>
                                </div>
                                <p className="mt-2 line-clamp-2 text-sm text-[#64748B]">
                                    {ticket.preview}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-[#4A4A4A]">
                                        <UserRound className="h-4 w-4 text-[#E32B2B]" />
                                        {ticket.userName}
                                    </div>
                                    <span className="text-xs font-medium text-[#A0A0A0]">
                                        {ticket.lastMessageAt}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex min-w-0 flex-col rounded-[20px] bg-white">
                    <div className="border-b px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-[#A0A0A0]">
                                    {selectedTicket.id} · {selectedTicket.category}
                                </p>
                                <h2 className="mt-1 text-[28px] font-semibold text-[#4A4A4A]">
                                    {selectedTicket.subject}
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <span
                                    className={`rounded-full px-3 py-2 text-sm font-semibold ${priorityStyles[selectedTicket.priority]}`}
                                >
                                    {priorityLabel[selectedTicket.priority]}
                                </span>
                                <span
                                    className={`rounded-full px-3 py-2 text-sm font-semibold ${statusStyles[selectedTicket.status]}`}
                                >
                                    {statusLabel[selectedTicket.status]}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-4 gap-3">
                            <div className="rounded-[14px] bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold uppercase text-[#A0A0A0]">
                                    Клиент
                                </p>
                                <p className="mt-1 font-semibold text-[#4A4A4A]">
                                    {selectedTicket.userName}
                                </p>
                            </div>
                            <div className="rounded-[14px] bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold uppercase text-[#A0A0A0]">
                                    Телефон
                                </p>
                                <p className="mt-1 flex items-center gap-2 font-semibold text-[#4A4A4A]">
                                    <Phone className="h-4 w-4 text-[#E32B2B]" />
                                    {selectedTicket.userPhone}
                                </p>
                            </div>
                            <div className="rounded-[14px] bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold uppercase text-[#A0A0A0]">
                                    Рейс
                                </p>
                                <p className="mt-1 font-semibold text-[#4A4A4A]">
                                    {selectedTicket.trip}
                                </p>
                            </div>
                            <div className="rounded-[14px] bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold uppercase text-[#A0A0A0]">
                                    Ответственный
                                </p>
                                <p className="mt-1 font-semibold text-[#4A4A4A]">
                                    {selectedTicket.assignedTo}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[#F8FAFC] px-6 py-5">
                        {selectedTicket.messages.map((message, index) => (
                            <div
                                key={`${message.time}-${index}`}
                                className={`flex ${message.author === 'support' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[72%] rounded-[18px] px-4 py-3 ${
                                        message.author === 'support'
                                            ? 'bg-[#E32B2B] text-white'
                                            : 'bg-white text-[#4A4A4A]'
                                    }`}
                                >
                                    <p className="text-sm leading-6">{message.text}</p>
                                    <p
                                        className={`mt-2 text-xs ${
                                            message.author === 'support'
                                                ? 'text-white/70'
                                                : 'text-[#A0A0A0]'
                                        }`}
                                    >
                                        {message.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t p-5">
                        <div className="rounded-[16px] border bg-white p-3">
                            <Textarea
                                placeholder="Напишите ответ пользователю..."
                                className="min-h-[92px] resize-none border-0 p-0 shadow-none focus-visible:ring-0"
                            />
                            <div className="mt-3 flex items-center justify-between">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#64748B] duration-150 hover:bg-[#F1F5F9]"
                                >
                                    <Paperclip className="h-4 w-4" />
                                    Прикрепить файл
                                </button>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="px-5">
                                        Закрыть тикет
                                    </Button>
                                    <Button className="px-6">
                                        <Send />
                                        Отправить
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[#A0A0A0]">
                            Это демонстрационный UI: данные, фильтры и сообщения
                            работают локально без подключения к бэкенду.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
