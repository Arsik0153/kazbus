import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Headphones,
    MailQuestion,
    MessageSquareText,
    PhoneCall,
    ShieldAlert,
    TimerReset,
} from 'lucide-react';

import AdminSectionCard from '@/components/admin/section-card';

const supportStats = [
    {
        title: 'Новые',
        value: '18',
        detail: '7 обращений ждут первого ответа',
        icon: MailQuestion,
        tone: 'bg-[#FEE2E2] text-[#E74949]',
    },
    {
        title: 'В работе',
        value: '42',
        detail: 'Среднее время ответа 11 минут',
        icon: Headphones,
        tone: 'bg-[#DBEAFE] text-[#2563EB]',
    },
    {
        title: 'SLA риск',
        value: '6',
        detail: 'Нужна реакция старшего диспетчера',
        icon: TimerReset,
        tone: 'bg-[#FEF3C7] text-[#92400E]',
    },
    {
        title: 'Закрыто сегодня',
        value: '73',
        detail: '94% без повторного обращения',
        icon: CheckCircle2,
        tone: 'bg-[#DCFCE7] text-[#166534]',
    },
];

const filters = [
    'Все входящие',
    'Новые',
    'В работе',
    'SLA риск',
    'Возврат',
    'Посадка',
    'Оплата',
    'Багаж',
];

const tickets = [
    {
        id: 'SUP-1048',
        customer: 'Айгерим С.',
        subject: 'Не пришел QR-билет после оплаты',
        route: 'Алматы - Астана',
        channel: 'WhatsApp',
        priority: 'Высокий',
        status: 'Новый',
        owner: 'Не назначен',
        updated: '2 мин назад',
        statusTone: 'bg-[#FEE2E2] text-[#B91C1C]',
        priorityTone: 'bg-[#FEF3C7] text-[#92400E]',
    },
    {
        id: 'SUP-1047',
        customer: 'Дамир К.',
        subject: 'Пассажир просит изменить место',
        route: 'Шымкент - Алматы',
        channel: 'Телефон',
        priority: 'Средний',
        status: 'В работе',
        owner: 'Мадина',
        updated: '8 мин назад',
        statusTone: 'bg-[#DBEAFE] text-[#1D4ED8]',
        priorityTone: 'bg-[#E2E8F0] text-[#475569]',
    },
    {
        id: 'SUP-1046',
        customer: 'Ольга Н.',
        subject: 'Возврат за отмененный рейс',
        route: 'Караганда - Павлодар',
        channel: 'Email',
        priority: 'SLA риск',
        status: 'Эскалация',
        owner: 'Ерлан',
        updated: '16 мин назад',
        statusTone: 'bg-[#FEF3C7] text-[#92400E]',
        priorityTone: 'bg-[#FEE2E2] text-[#B91C1C]',
    },
    {
        id: 'SUP-1045',
        customer: 'Роман В.',
        subject: 'Водитель не видит пассажира в списке',
        route: 'Астана - Кокшетау',
        channel: 'Диспетчер',
        priority: 'Высокий',
        status: 'В работе',
        owner: 'Сауле',
        updated: '21 мин назад',
        statusTone: 'bg-[#DBEAFE] text-[#1D4ED8]',
        priorityTone: 'bg-[#FEF3C7] text-[#92400E]',
    },
];

const lanes = [
    {
        title: 'Критичные обращения',
        description: 'Оплата, посадка, отмена рейса и любые сбои перед отправлением.',
        count: '9',
        icon: ShieldAlert,
    },
    {
        title: 'Ожидают пассажира',
        description: 'Оператор запросил данные и ждет подтверждение от клиента.',
        count: '14',
        icon: MessageSquareText,
    },
    {
        title: 'Нужен звонок',
        description: 'Обращения, где текстового ответа недостаточно для решения.',
        count: '5',
        icon: PhoneCall,
    },
];

export default function AdminSupportPage() {
    return (
        <div className="mt-6 flex flex-col gap-5">
            <div className="rounded-[20px] bg-white px-8 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                            Служба поддержки
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Входящий контур обращений пассажиров и диспетчеров:
                            очередь, приоритеты, SLA и ответственные операторы.
                            Интерфейс статический и готовит место под будущую
                            интеграцию с ticketing API.
                        </p>
                    </div>
                    <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
                        <p className="text-sm font-semibold uppercase text-[#A0A0A0]">
                            Дежурная смена
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#4A4A4A]">
                            6 операторов
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#64748B]">
                            Нагрузка: 10 обращений на оператора
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-5">
                {supportStats.map(({ title, value, detail, icon: Icon, tone }) => (
                    <div key={title} className="rounded-[20px] bg-white px-6 py-6">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${tone}`}
                        >
                            <Icon className="h-6 w-6" />
                        </div>
                        <p className="mt-4 text-sm font-semibold uppercase text-[#A0A0A0]">
                            {title}
                        </p>
                        <p className="mt-1 text-[34px] font-semibold leading-none text-[#4A4A4A]">
                            {value}
                        </p>
                        <p className="mt-3 text-sm font-medium text-[#A0A0A0]">
                            {detail}
                        </p>
                    </div>
                ))}
            </div>

            <AdminSectionCard
                title="Очередь входящих обращений"
                description="Список показывает будущий рабочий стол оператора: источник обращения, тему, маршрут, приоритет и ответственного."
                action={
                    <div className="flex items-center gap-2 rounded-full bg-[#FFF7F7] px-4 py-2 text-sm font-semibold text-[#E74949]">
                        <AlertCircle className="h-4 w-4" />
                        6 обращений близко к SLA
                    </div>
                }
            >
                <div className="mb-5 flex flex-wrap gap-3">
                    {filters.map((label, index) => (
                        <button
                            key={label}
                            type="button"
                            disabled
                            className={`rounded-full border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed ${
                                index === 0
                                    ? 'border-[#E74949] bg-[#FEE2E2] text-[#E74949]'
                                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="overflow-hidden rounded-[18px] border border-[#E2E8F0]">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-[#F8FAFC]">
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Тикет
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Обращение
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Маршрут
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Приоритет
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Статус
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Ответственный
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Обновлено
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr
                                    key={ticket.id}
                                    className="border-t border-[#E2E8F0]"
                                >
                                    <td className="border-t border-[#E2E8F0] px-5 py-4 align-top">
                                        <p className="text-sm font-semibold text-[#4A4A4A]">
                                            {ticket.id}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-[#A0A0A0]">
                                            {ticket.channel}
                                        </p>
                                    </td>
                                    <td className="border-t border-[#E2E8F0] px-5 py-4 align-top">
                                        <p className="text-sm font-semibold text-[#4A4A4A]">
                                            {ticket.customer}
                                        </p>
                                        <p className="mt-1 max-w-[280px] text-sm font-medium text-[#64748B]">
                                            {ticket.subject}
                                        </p>
                                    </td>
                                    <td className="border-t border-[#E2E8F0] px-5 py-4 align-top text-sm font-medium text-[#64748B]">
                                        {ticket.route}
                                    </td>
                                    <td className="border-t border-[#E2E8F0] px-5 py-4 align-top">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ticket.priorityTone}`}
                                        >
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="border-t border-[#E2E8F0] px-5 py-4 align-top">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ticket.statusTone}`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="border-t border-[#E2E8F0] px-5 py-4 align-top text-sm font-semibold text-[#4A4A4A]">
                                        {ticket.owner}
                                    </td>
                                    <td className="border-t border-[#E2E8F0] px-5 py-4 align-top text-sm font-medium text-[#A0A0A0]">
                                        {ticket.updated}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminSectionCard>

            <div className="grid grid-cols-[1fr_1.15fr] gap-5">
                <AdminSectionCard
                    title="Рабочие корзины"
                    description="Быстрые срезы помогают старшему оператору видеть, где требуется ручное распределение."
                    className="h-full"
                >
                    <div className="flex flex-col gap-3">
                        {lanes.map(({ title, description, count, icon: Icon }) => (
                            <div
                                key={title}
                                className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE2E2]">
                                            <Icon className="h-5 w-5 text-[#E74949]" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-[#4A4A4A]">
                                                {title}
                                            </p>
                                            <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#4A4A4A]">
                                        {count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Правила обработки"
                    description="Статический шаблон будущих регламентов для triage, эскалации и закрытия обращений."
                >
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            {
                                title: 'Первый ответ',
                                text: 'Новые обращения должны получить реакцию оператора в течение 15 минут.',
                            },
                            {
                                title: 'Эскалация',
                                text: 'Возвраты, отмены рейсов и спорные платежи уходят старшему диспетчеру.',
                            },
                            {
                                title: 'Привязка к рейсу',
                                text: 'Каждый тикет по поездке должен хранить маршрут, дату и номер билета.',
                            },
                            {
                                title: 'Закрытие',
                                text: 'Обращение закрывается только после ответа пассажиру или фиксации причины.',
                            },
                        ].map((rule) => (
                            <div
                                key={rule.title}
                                className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5"
                            >
                                <div className="flex items-center gap-3">
                                    <Clock3 className="h-5 w-5 text-[#E74949]" />
                                    <p className="text-base font-semibold text-[#4A4A4A]">
                                        {rule.title}
                                    </p>
                                </div>
                                <p className="mt-3 text-sm font-medium text-[#A0A0A0]">
                                    {rule.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </AdminSectionCard>
            </div>
        </div>
    );
}
