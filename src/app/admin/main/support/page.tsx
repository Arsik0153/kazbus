'use client';

import { useMemo, useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Paperclip,
    Phone,
    Search,
    Send,
    UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    supportPriorityLabel,
    supportPriorityStyles,
    supportRoleLabel,
    supportStatusLabel,
    supportStatusStyles,
    supportTicketsMock,
} from '@/features/support/mock';
import type { SupportTicketStatus } from '@/features/support/types';

const SupportPage = () => {
    const [selectedTicketId, setSelectedTicketId] = useState(
        supportTicketsMock[0].id
    );
    const [statusFilter, setStatusFilter] = useState<
        SupportTicketStatus | 'all'
    >('all');
    const [search, setSearch] = useState('');

    const filteredTickets = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return supportTicketsMock.filter((ticket) => {
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
                    supportRoleLabel[ticket.requesterRole],
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
        supportTicketsMock[0];

    const counters = {
        new: supportTicketsMock.filter((ticket) => ticket.status === 'new')
            .length,
        inProgress: supportTicketsMock.filter(
            (ticket) => ticket.status === 'inProgress'
        ).length,
        closed: supportTicketsMock.filter(
            (ticket) => ticket.status === 'closed'
        ).length,
    };

    return (
        <div className="mt-6 flex flex-col pb-10">
            <div>
                <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                    Служба поддержки
                </h1>
                <p className="mt-2 text-base text-[#7A7A7A]">
                    Единый экран для обработки обращений пассажиров, водителей и
                    диспетчеров.
                </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-[20px] bg-white p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#A0A0A0] uppercase">
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
                        <span className="text-sm font-semibold text-[#A0A0A0] uppercase">
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
                        <span className="text-sm font-semibold text-[#A0A0A0] uppercase">
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
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[#A0A0A0]" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Поиск по тикетам"
                            className="bg-[#F8FAFC] pl-10"
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {(
                            [
                                ['all', 'Все'],
                                ['new', 'Новые'],
                                ['inProgress', 'В работе'],
                                ['closed', 'Закрытые'],
                            ] as const
                        ).map(([value, label]) => (
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
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${supportStatusStyles[ticket.status]}`}
                                    >
                                        {supportStatusLabel[ticket.status]}
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
                                    {selectedTicket.id} ·{' '}
                                    {selectedTicket.category} ·{' '}
                                    {
                                        supportRoleLabel[
                                            selectedTicket.requesterRole
                                        ]
                                    }
                                </p>
                                <h2 className="mt-1 text-[28px] font-semibold text-[#4A4A4A]">
                                    {selectedTicket.subject}
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <span
                                    className={`rounded-full px-3 py-2 text-sm font-semibold ${supportPriorityStyles[selectedTicket.priority]}`}
                                >
                                    {
                                        supportPriorityLabel[
                                            selectedTicket.priority
                                        ]
                                    }
                                </span>
                                <span
                                    className={`rounded-full px-3 py-2 text-sm font-semibold ${supportStatusStyles[selectedTicket.status]}`}
                                >
                                    {supportStatusLabel[selectedTicket.status]}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-4 gap-3">
                            <div className="rounded-[14px] bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold text-[#A0A0A0] uppercase">
                                    Отправитель
                                </p>
                                <p className="mt-1 font-semibold text-[#4A4A4A]">
                                    {selectedTicket.userName}
                                </p>
                                <p className="text-xs font-medium text-[#A0A0A0]">
                                    {
                                        supportRoleLabel[
                                            selectedTicket.requesterRole
                                        ]
                                    }
                                </p>
                            </div>
                            <div className="rounded-[14px] bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold text-[#A0A0A0] uppercase">
                                    Телефон
                                </p>
                                <p className="mt-1 flex items-center gap-2 font-semibold text-[#4A4A4A]">
                                    <Phone className="h-4 w-4 text-[#E32B2B]" />
                                    {selectedTicket.userPhone}
                                </p>
                            </div>
                            <div className="rounded-[14px] bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold text-[#A0A0A0] uppercase">
                                    Рейс
                                </p>
                                <p className="mt-1 font-semibold text-[#4A4A4A]">
                                    {selectedTicket.trip}
                                </p>
                            </div>
                            <div className="rounded-[14px] bg-[#F8FAFC] p-3">
                                <p className="text-xs font-semibold text-[#A0A0A0] uppercase">
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
                                    <p className="text-sm leading-6">
                                        {message.text}
                                    </p>
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
