import Link from 'next/link';
import {
    BusFront,
    CheckCircle2,
    FileSearch,
    MessageSquareMore,
    Route,
    ShieldAlert,
    UserRound,
} from 'lucide-react';

import AdminSectionCard from '@/components/admin/section-card';
import AdminStateCard from '@/components/admin/state-card';
import { Button } from '@/components/ui/button';

const workflowSteps = [
    {
        title: 'Новое обращение',
        description:
            'Запрос пассажира, водителя или диспетчера поступает во входящую очередь с каналом связи и исходным контекстом.',
        icon: MessageSquareMore,
    },
    {
        title: 'Уточнить контекст',
        description:
            'Оператор сопоставляет обращение с рейсом, водителем или автобусом и при необходимости запрашивает детали.',
        icon: FileSearch,
    },
    {
        title: 'Решить или эскалировать',
        description:
            'После проверки оператор фиксирует решение либо передаёт случай ответственному за операционную работу.',
        icon: CheckCircle2,
    },
];

const referenceRecords = [
    {
        title: 'Рейс',
        description: 'Расписание, пассажиры и история выполнения рейса.',
        href: '/admin/main/trips',
        action: 'Открыть рейсы',
        icon: Route,
    },
    {
        title: 'Водитель',
        description: 'Контактные данные и профиль водителя, указанного в обращении.',
        href: '/admin/main/drivers',
        action: 'Открыть водителей',
        icon: UserRound,
    },
    {
        title: 'Автобус',
        description: 'Карточка транспорта и данные автобуса на линии.',
        href: '/admin/main/buses',
        action: 'Открыть автобусы',
        icon: BusFront,
    },
];

export default function SupportPage() {
    return (
        <div className="mt-6 flex flex-col gap-5 pb-7">
            <header className="rounded-[20px] bg-white px-8 py-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold text-[#E74949]">
                            Операционный контур
                        </p>
                        <h1 className="mt-2 text-[42px] font-semibold leading-tight text-[#4A4A4A]">
                            Служба поддержки
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Входящее рабочее место для запросов пассажиров,
                            водителей и диспетчеров. Здесь оператор сможет
                            принять обращение и перейти к нужной операционной
                            записи для проверки.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 xl:justify-end">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/admin/main/trips">Рейсы</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/admin/main/drivers">Водители</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/admin/main/buses">Автобусы</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <AdminSectionCard
                title="Очередь входящих обращений"
                description="В этом разделе будут отображаться только поступившие извне запросы — без ручного создания обращений оператором."
            >
                <AdminStateCard
                    title="Входящие обращения пока недоступны"
                    description="API для тикетов ещё не подключён, поэтому очередь, статусы и данные обращений здесь не загружаются. После появления серверного контракта этот блок покажет реальные входящие случаи."
                    action={
                        <div className="flex items-center gap-2 rounded-full bg-[#FFF1F1] px-4 py-2 text-sm font-semibold text-[#C92D2D]">
                            <ShieldAlert className="h-4 w-4" />
                            Ожидается подключение ticket API
                        </div>
                    }
                />
            </AdminSectionCard>

            <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
                <AdminSectionCard
                    title="Рабочий процесс оператора"
                    description="Предполагаемый порядок обработки входящего обращения. Статусы, ответственные и SLA станут рабочими только после согласования backend-контракта."
                >
                    <ol className="grid gap-3 md:grid-cols-3">
                        {workflowSteps.map(({ title, description, icon: Icon }, index) => (
                            <li
                                key={title}
                                className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-5"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE2E2]">
                                        <Icon className="h-5 w-5 text-[#E74949]" />
                                    </div>
                                    <span className="text-sm font-semibold text-[#94A3B8]">
                                        Шаг 0{index + 1}
                                    </span>
                                </div>
                                <h3 className="mt-5 text-lg font-semibold text-[#4A4A4A]">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm font-medium leading-6 text-[#94A3B8]">
                                    {description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Статусы и SLA"
                    description="Сервисные правила появятся здесь вместе с моделью тикета."
                >
                    <div className="rounded-[18px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6">
                        <p className="text-lg font-semibold text-[#4A4A4A]">
                            Пока без live-статусов
                        </p>
                        <p className="mt-2 text-sm font-medium leading-6 text-[#94A3B8]">
                            Нельзя показать корректные сроки реакции,
                            приоритеты или этапы обработки, пока их не отдаёт
                            backend.
                        </p>
                    </div>
                </AdminSectionCard>
            </div>

            <AdminSectionCard
                title="Записи для проверки обращения"
                description="Перед ответом откройте связанную операционную запись — она поможет подтвердить детали запроса и дальнейшие действия."
            >
                <div className="grid gap-3 md:grid-cols-3">
                    {referenceRecords.map(
                        ({ title, description, href, action, icon: Icon }) => (
                            <div
                                key={title}
                                className="flex flex-col rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-5"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                                    <Icon className="h-5 w-5 text-[#E74949]" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-[#4A4A4A]">
                                    {title}
                                </h3>
                                <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-[#94A3B8]">
                                    {description}
                                </p>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-5 w-full"
                                >
                                    <Link href={href}>{action}</Link>
                                </Button>
                            </div>
                        ),
                    )}
                </div>
            </AdminSectionCard>
        </div>
    );
}
