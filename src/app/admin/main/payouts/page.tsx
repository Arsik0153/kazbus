import Link from 'next/link';
import {
    Banknote,
    CalendarCheck2,
    CircleDollarSign,
    ClipboardCheck,
    FileSpreadsheet,
    Landmark,
    Percent,
    ReceiptText,
    ShieldCheck,
    TriangleAlert,
} from 'lucide-react';

import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';

const summaryCards = [
    {
        title: 'К выплате',
        value: '8 420 000 ₸',
        description: 'Сумма по закрытым рейсам текущего расчетного окна.',
        icon: Banknote,
    },
    {
        title: 'Комиссия платформы',
        value: '421 000 ₸',
        description: '5% удержание по подтвержденной билетной выручке.',
        icon: Percent,
    },
    {
        title: 'Ожидают сверки',
        value: '3 батча',
        description: 'Нужна проверка возвратов, посадок и ручных корректировок.',
        icon: ClipboardCheck,
    },
];

const settlementBatches = [
    {
        period: '10-16 июня 2026',
        company: 'ТОО Astana Express',
        revenue: '3 280 000 ₸',
        commission: '164 000 ₸',
        payout: '3 116 000 ₸',
        trips: '48 рейсов',
        status: 'ready',
        tone: 'bg-[#DCFCE7] text-[#166534]',
    },
    {
        period: '10-16 июня 2026',
        company: 'ТОО KazInterBus',
        revenue: '2 145 000 ₸',
        commission: '107 250 ₸',
        payout: '2 037 750 ₸',
        trips: '31 рейс',
        status: 'review',
        tone: 'bg-[#FEF3C7] text-[#92400E]',
    },
    {
        period: '03-09 июня 2026',
        company: 'ТОО Saryarka Lines',
        revenue: '1 760 000 ₸',
        commission: '88 000 ₸',
        payout: '1 672 000 ₸',
        trips: '27 рейсов',
        status: 'processing',
        tone: 'bg-[#DBEAFE] text-[#1D4ED8]',
    },
    {
        period: '03-09 июня 2026',
        company: 'ТОО Turan Bus',
        revenue: '1 235 000 ₸',
        commission: '61 750 ₸',
        payout: '1 173 250 ₸',
        trips: '19 рейсов',
        status: 'paid',
        tone: 'bg-[#E2E8F0] text-[#475569]',
    },
];

const reconciliationItems = [
    {
        title: 'Билетная выручка',
        value: '8 420 000 ₸',
        detail: 'Оплаченные билеты без отмененных заказов и тестовых продаж.',
        icon: ReceiptText,
    },
    {
        title: 'Возвраты пассажирам',
        value: '312 000 ₸',
        detail: 'Исключаются из базы выплаты до формирования settlement batch.',
        icon: CircleDollarSign,
    },
    {
        title: 'Комиссия KazBus',
        value: '421 000 ₸',
        detail: 'Платформенное удержание по договорной ставке перевозчика.',
        icon: Percent,
    },
    {
        title: 'Банковский реестр',
        value: '4 компании',
        detail: 'Финальный файл выплат после ручной проверки статусов.',
        icon: Landmark,
    },
];

const payoutStatuses = [
    {
        title: 'draft',
        text: 'Батч собирается из закрытых рейсов и еще не готов к финансовой проверке.',
        tone: 'bg-[#E2E8F0] text-[#475569]',
    },
    {
        title: 'review',
        text: 'Нужна сверка заказов, возвратов, посадок и возможных ручных корректировок.',
        tone: 'bg-[#FEF3C7] text-[#92400E]',
    },
    {
        title: 'ready',
        text: 'Суммы подтверждены, можно формировать банковский реестр выплат.',
        tone: 'bg-[#DCFCE7] text-[#166534]',
    },
    {
        title: 'processing',
        text: 'Реестр передан в банк или бухгалтерию, результат оплаты ожидается.',
        tone: 'bg-[#DBEAFE] text-[#1D4ED8]',
    },
    {
        title: 'paid',
        text: 'Выплата завершена, settlement закрыт и доступен для аудита.',
        tone: 'bg-[#F3E8FF] text-[#7E22CE]',
    },
    {
        title: 'blocked',
        text: 'Выплата остановлена из-за расхождений, реквизитов или compliance-проверки.',
        tone: 'bg-[#FEE2E2] text-[#B91C1C]',
    },
];

const payoutChecklist = [
    'Все рейсы в периоде закрыты и имеют финальный operational status',
    'Возвраты пассажирам исключены из базы расчета выплаты',
    'Комиссия платформы рассчитана по договорной ставке перевозчика',
    'Банковские реквизиты компании актуальны и прошли проверку',
    'Расхождения по посадкам и ручным корректировкам разобраны',
];

export default function AdminPayoutsPage() {
    return (
        <div className="mt-6 flex flex-col gap-5">
            <div className="rounded-[20px] bg-white px-8 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                            Выплаты и settlements
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Статический интерфейс для сверки выплат автобусным
                            компаниям: расчетные периоды, комиссии платформы,
                            реестры выплат, расхождения и статусы settlement
                            batch.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/admin/main/trips">К рейсам</Link>
                        </Button>
                        <Button size="lg" disabled>
                            Экспорт реестра подключится позже
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {summaryCards.map(({ title, value, description, icon: Icon }) => (
                    <div
                        key={title}
                        className="rounded-[20px] bg-white px-6 py-6"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]">
                            <Icon className="h-6 w-6 text-[#E74949]" />
                        </div>
                        <p className="mt-4 text-sm font-bold uppercase text-[#A0A0A0]">
                            {title}
                        </p>
                        <p className="mt-2 text-[32px] font-semibold leading-tight text-[#4A4A4A]">
                            {value}
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            {description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[1.35fr_1fr] gap-5">
                <AdminSectionCard
                    title="Settlement batches"
                    description="Список расчетных батчей показывает период, перевозчика, билетную выручку, комиссию и сумму к выплате."
                    action={
                        <Button size="lg" disabled>
                            Создание batch появится после API
                        </Button>
                    }
                >
                    <div className="overflow-hidden rounded-[18px] border border-[#E2E8F0]">
                        <table className="w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-[#F8FAFC]">
                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                        Период
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                        Компания
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                        Выручка
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                        Комиссия
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                        К выплате
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                        Статус
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {settlementBatches.map((batch) => (
                                    <tr
                                        key={`${batch.company}-${batch.period}`}
                                        className="border-t border-[#E2E8F0]"
                                    >
                                        <td className="border-t border-[#E2E8F0] px-5 py-4 align-top">
                                            <p className="text-sm font-semibold text-[#4A4A4A]">
                                                {batch.period}
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-[#94A3B8]">
                                                {batch.trips}
                                            </p>
                                        </td>
                                        <td className="border-t border-[#E2E8F0] px-5 py-4 text-sm font-semibold text-[#4A4A4A]">
                                            {batch.company}
                                        </td>
                                        <td className="border-t border-[#E2E8F0] px-5 py-4 text-sm font-medium text-[#64748B]">
                                            {batch.revenue}
                                        </td>
                                        <td className="border-t border-[#E2E8F0] px-5 py-4 text-sm font-medium text-[#64748B]">
                                            {batch.commission}
                                        </td>
                                        <td className="border-t border-[#E2E8F0] px-5 py-4 text-sm font-semibold text-[#4A4A4A]">
                                            {batch.payout}
                                        </td>
                                        <td className="border-t border-[#E2E8F0] px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${batch.tone}`}
                                            >
                                                {batch.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Сверка выплаты"
                    description="Финансовый контур должен объяснять, из чего получилась сумма payout."
                >
                    <div className="flex flex-col gap-3">
                        {reconciliationItems.map(
                            ({ title, value, detail, icon: Icon }) => (
                                <div
                                    key={title}
                                    className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                                                {title}
                                            </p>
                                            <p className="mt-2 text-2xl font-semibold text-[#4A4A4A]">
                                                {value}
                                            </p>
                                        </div>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2]">
                                            <Icon className="h-5 w-5 text-[#E74949]" />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-[#A0A0A0]">
                                        {detail}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                </AdminSectionCard>
            </div>

            <AdminSectionCard
                title="Статусы payout lifecycle"
                description="Единый словарь статусов нужен для финансовой команды, поддержки и аудита расчетов с перевозчиками."
            >
                <div className="grid grid-cols-3 gap-4">
                    {payoutStatuses.map((status) => (
                        <div
                            key={status.title}
                            className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5"
                        >
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${status.tone}`}
                            >
                                {status.title}
                            </span>
                            <p className="mt-3 text-sm font-medium text-[#4A4A4A]">
                                {status.text}
                            </p>
                        </div>
                    ))}
                </div>
            </AdminSectionCard>

            <div className="grid grid-cols-[1fr_1fr] gap-5">
                <AdminSectionCard
                    title="Контроль перед выплатой"
                    description="Чеклист показывает, какие условия должны быть закрыты перед переводом денег перевозчику."
                >
                    <div className="flex flex-col gap-3">
                        {payoutChecklist.map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-3 rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4"
                            >
                                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#16A34A]" />
                                <p className="text-sm font-medium text-[#4A4A4A]">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Финансовые артефакты"
                    description="Эти документы и действия появятся после подключения backend-контракта и бухгалтерского процесса."
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5">
                            <FileSpreadsheet className="h-5 w-5 text-[#E74949]" />
                            <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                                Реестр выплат
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                Экспорт сумм, реквизитов, комиссий и назначений
                                платежа для банка.
                            </p>
                        </div>
                        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5">
                            <CalendarCheck2 className="h-5 w-5 text-[#E74949]" />
                            <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                                Период закрытия
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                Правило, по которому завершенные рейсы попадают
                                в weekly или monthly settlement.
                            </p>
                        </div>
                    </div>
                </AdminSectionCard>
            </div>

            <div className="rounded-[20px] border border-[#FECACA] bg-[#FFF7F7] px-6 py-5">
                <div className="flex items-start gap-3">
                    <TriangleAlert className="mt-0.5 h-5 w-5 text-[#DC2626]" />
                    <div>
                        <p className="text-base font-semibold text-[#7F1D1D]">
                            Ограничение текущей frontend-итерации
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#B45309]">
                            Страница пока не вызывает API, не формирует реальные
                            платежи и не экспортирует банковские файлы. Это
                            готовый статический UI-контур для будущего
                            подключения settlement backend.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
