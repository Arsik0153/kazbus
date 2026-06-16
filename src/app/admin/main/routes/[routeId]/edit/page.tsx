import Link from 'next/link';
import { GitBranch, MapPinned, TimerReset } from 'lucide-react';

import AdminInfoField from '@/components/admin/info-field';
import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';

type Props = {
    params: {
        routeId: string;
    };
};

export default function EditRoutePage({ params }: Props) {
    return (
        <div className="mt-6 flex flex-col gap-5">
            <div className="rounded-[20px] bg-white px-8 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                            Маршрут #{params.routeId}
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Экран подготовлен под редактирование карточки
                            маршрута, остановок и транспортной логики без
                            имитации сохранения в недоступный backend-контур.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/admin/main/routes">К маршрутам</Link>
                        </Button>
                        <Button size="lg" disabled>
                            Сохранение маршрута подключится позже
                        </Button>
                    </div>
                </div>
            </div>

            <AdminSectionCard
                title="Параметры маршрута"
                description="Основные поля соответствуют продуктовой карточке автобусного маршрута."
            >
                <div className="grid grid-cols-2 gap-4">
                    <AdminInfoField
                        label="Стартовый город"
                        value="Будет приходить из route.start_city"
                    />
                    <AdminInfoField
                        label="Конечный город"
                        value="Будет приходить из route.end_city"
                    />
                    <AdminInfoField
                        label="Станция отправления"
                        value="Заполняется на уровне маршрута"
                    />
                    <AdminInfoField
                        label="Станция прибытия"
                        value="Заполняется на уровне маршрута"
                    />
                    <AdminInfoField
                        label="Суммарное время в пути"
                        value="Будет приходить из total_travel_time"
                    />
                    <AdminInfoField
                        label="Статус жизненного цикла"
                        value="active / archived / draft"
                    />
                </div>
            </AdminSectionCard>

            <div className="grid grid-cols-[1.15fr_1fr] gap-5">
                <AdminSectionCard
                    title="Остановки и сегменты"
                    description="Маршрут должен поддерживать набор остановок, порядок прохождения и транспортные интервалы."
                >
                    <div className="flex min-h-[280px] items-center justify-center rounded-[18px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-8 text-center">
                        <div className="max-w-lg">
                            <GitBranch className="mx-auto h-8 w-8 text-[#E74949]" />
                            <p className="mt-4 text-2xl font-semibold text-[#4A4A4A]">
                                Здесь будет редактор остановок
                            </p>
                            <p className="mt-2 text-base font-medium text-[#94A3B8]">
                                После подключения backend здесь появятся
                                сегменты маршрута, времена стоянок и порядок
                                автобусных станций.
                            </p>
                        </div>
                    </div>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Операционные связи"
                    description="Маршрут должен быть основой для создания рейсов и дальнейшей продажи билетов."
                >
                    <div className="grid gap-4">
                        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5">
                            <MapPinned className="h-5 w-5 text-[#E74949]" />
                            <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                                География маршрута
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                Используется в поиске билетов, карточках рейса и
                                клиентском отображении направления.
                            </p>
                        </div>
                        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5">
                            <TimerReset className="h-5 w-5 text-[#E74949]" />
                            <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                                Временные параметры
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                Общая длительность и остановки должны влиять на
                                расписание и будущие ETA рейсов.
                            </p>
                        </div>
                    </div>
                </AdminSectionCard>
            </div>
        </div>
    );
}
