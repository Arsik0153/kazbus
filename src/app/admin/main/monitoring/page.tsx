import Link from 'next/link';
import { MapPinned, RadioTower, Route, TimerReset } from 'lucide-react';

import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';

const monitoringBlocks = [
    {
        title: 'Рейсы в продаже',
        description:
            'Лента должна показывать текущий operational status рейсов и факт доступности продаж.',
        icon: Route,
    },
    {
        title: 'Транспорт на линии',
        description:
            'Карта и status feed нужны для контроля активных автобусов и отклонений по исполнению.',
        icon: MapPinned,
    },
    {
        title: 'События в реальном времени',
        description:
            'В перспективе здесь будут boarding, start, arrival и другие ключевые события по рейсам.',
        icon: RadioTower,
    },
    {
        title: 'ETA и временные окна',
        description:
            'Наблюдаемость по таймингам поможет диспетчеру быстро реагировать на сбои и задержки.',
        icon: TimerReset,
    },
];

export default function AdminMonitoringPage() {
    return (
        <div className="mt-6 flex flex-col gap-5">
            <div className="rounded-[20px] bg-white px-8 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                            Мониторинг перевозок
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Это будущая карта и статусная лента автобусного
                            оператора. Раздел нужен для live-контроля транспорта
                            и исполнения активных рейсов внутри tenant-контура
                            компании.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/admin/main/trips">К рейсам</Link>
                        </Button>
                        <Button size="lg" disabled>
                            Live-данные появятся после geo-интеграции
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[1.35fr_1fr] gap-5">
                <AdminSectionCard
                    title="Карта автобусов"
                    description="Большая карта для отображения маршрутов, текущих позиций транспорта и приближенного ETA."
                    className="h-full"
                >
                    <div className="flex min-h-[380px] items-center justify-center rounded-[18px] border border-dashed border-[#CBD5E1] bg-[radial-gradient(circle_at_top,#FEE2E2,transparent_35%),linear-gradient(180deg,#FFF,#F8FAFC)] px-8 text-center">
                        <div className="max-w-xl">
                            <p className="text-2xl font-semibold text-[#4A4A4A]">
                                Здесь будет интерактивная карта транспорта
                            </p>
                            <p className="mt-3 text-base font-medium text-[#94A3B8]">
                                После подключения геолокации и рейсовых статусов
                                карта покажет активные автобусы, маршрут,
                                направление движения и оперативные отклонения.
                            </p>
                        </div>
                    </div>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Статусная лента"
                    description="Блок под live-события, которые помогут диспетчеру быстро понимать обстановку."
                >
                    <div className="flex flex-col gap-3">
                        {monitoringBlocks.map(({ title, description, icon: Icon }) => (
                            <div
                                key={title}
                                className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE2E2]">
                                        <Icon className="h-5 w-5 text-[#E74949]" />
                                    </div>
                                    <p className="text-lg font-semibold text-[#4A4A4A]">
                                        {title}
                                    </p>
                                </div>
                                <p className="mt-3 text-sm font-medium text-[#A0A0A0]">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </AdminSectionCard>
            </div>

            <AdminSectionCard
                title="Фильтры мониторинга"
                description="Фильтрация нужна, чтобы диспетчер мог быстро сузить картину по маршруту, периоду и статусу."
            >
                <div className="flex flex-wrap gap-3">
                    {[
                        'Все рейсы',
                        'Только активные',
                        'Посадка',
                        'На маршруте',
                        'Задержка',
                        'Проблемы по транспорту',
                    ].map((label) => (
                        <button
                            key={label}
                            type="button"
                            disabled
                            className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#64748B] disabled:cursor-not-allowed"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </AdminSectionCard>
        </div>
    );
}
