import Link from 'next/link';

import AdminStateCard from '@/components/admin/state-card';
import { Button } from '@/components/ui/button';
import { Bus, Driver, Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

type DashboardMetric = {
    label: string;
    value: string;
    hint?: string;
};

async function readList<T>(path: string): Promise<T[]> {
    const response = await adminFetch(path);

    if (!response.ok) {
        return [];
    }

    return (await response.json()) as T[];
}

function getStatusLabel(status: string) {
    if (status === 'active') {
        return 'Активен';
    }

    if (status === 'not_on_sale') {
        return 'Не в продаже';
    }

    if (status === 'cancelled') {
        return 'Отменен';
    }

    if (status === 'scheduled') {
        return 'Запланирован';
    }

    return status || 'Неизвестно';
}

function getUpcomingTrips(trips: Trips[]) {
    return [...trips]
        .sort((left, right) => {
            if (left.is_always_active !== right.is_always_active) {
                return left.is_always_active ? -1 : 1;
            }

            const leftDate = new Date(
                `${left.start_date ?? '9999-12-31'}T${left.departure_time}`
            ).getTime();
            const rightDate = new Date(
                `${right.start_date ?? '9999-12-31'}T${right.departure_time}`
            ).getTime();

            return leftDate - rightDate;
        })
        .slice(0, 5);
}

function getTripDepartureLabel(trip: Trips) {
    if (trip.is_always_active) {
        return `Постоянно ${trip.departure_time}`;
    }

    return `${trip.start_date ?? 'Без даты'} ${trip.departure_time}`;
}

export default async function AdminMainPage() {
    const [trips, buses, drivers] = await Promise.all([
        readList<Trips>('/trip/trips/'),
        readList<Bus>('/buses/'),
        readList<Driver>('/drivers/'),
    ]);

    const today = new Date().toISOString().slice(0, 10);
    const activeTripsToday = trips.filter(
        (trip) =>
            trip.status === 'active' &&
            (trip.is_always_active ||
                (Boolean(trip.start_date) &&
                    Boolean(trip.end_date) &&
                    trip.start_date! <= today &&
                    trip.end_date! >= today))
    );
    const activeDrivers = drivers.filter((driver) => driver.is_active !== false);
    const inactiveDrivers = drivers.filter(
        (driver) => driver.is_active === false
    );
    const tripsWithoutDriver = trips.filter((trip) => !trip.driver).length;
    const tripsWithoutBus = trips.filter((trip) => !trip.bus).length;
    const upcomingTrips = getUpcomingTrips(trips);

    const metrics: DashboardMetric[] = [
        {
            label: 'Активные рейсы сегодня',
            value: String(activeTripsToday.length),
        },
        {
            label: 'Автобусы в системе',
            value: String(buses.length),
            hint: 'Backend пока не отдает отдельный operational status автобуса',
        },
        {
            label: 'Активные водители',
            value: String(activeDrivers.length),
        },
        {
            label: 'Проданные билеты',
            value: 'Нет данных',
            hint: 'Отдельная метрика продаж пока не подключена',
        },
        {
            label: 'Выручка',
            value: 'Нет данных',
            hint: 'Backend-метрика выручки пока не подключена',
        },
        {
            label: 'Средняя загрузка',
            value: 'Нет данных',
            hint: 'Нужны данные по проданным местам на рейс',
        },
    ];

    return (
        <div className="mt-6 flex flex-col gap-5">
            <div className="rounded-[20px] bg-white px-8 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-2xl">
                        <p className="text-4xl font-semibold text-[#4A4A4A]">
                            Дашборд автопарка
                        </p>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Экран показывает только реальные данные, доступные в
                            текущем backend-контуре. Для неподключенных метрик
                            админка честно отображает отсутствие данных.
                        </p>
                    </div>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/admin/main/trips">Перейти к рейсам</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-[20px] bg-white px-6 py-6"
                    >
                        <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                            {metric.label}
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-[#E74949]">
                            {metric.value}
                        </p>
                        {metric.hint ? (
                            <p className="mt-3 text-sm text-[#A0A0A0]">
                                {metric.hint}
                            </p>
                        ) : null}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[1.4fr_1fr] gap-5">
                <div className="rounded-[20px] bg-white px-8 py-8">
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">
                            Ближайшие рейсы
                        </p>
                        <Button asChild variant="ghost">
                            <Link href="/admin/main/trips">Все рейсы</Link>
                        </Button>
                    </div>

                    {upcomingTrips.length === 0 ? (
                        <div className="pt-6">
                            <AdminStateCard
                                title="Нет данных для отображения"
                                description="Когда в системе появятся рейсы, здесь будет показан ближайший график отправлений."
                            />
                        </div>
                    ) : (
                        <div className="mt-5 overflow-hidden rounded-[16px] border border-[#E5E7EB]">
                            <table className="w-full border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-[#F8FAFC]">
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                            Маршрут
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                            Отправление
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                            Автобус
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                            Водитель
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                            Статус
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingTrips.map((trip) => (
                                        <tr
                                            key={trip.id}
                                            className="border-t border-[#EEF2F6]"
                                        >
                                            <td className="px-4 py-4 font-semibold text-[#4A4A4A]">
                                                {trip.from_city} - {trip.to_city}
                                            </td>
                                            <td className="px-4 py-4 text-[#4A4A4A]">
                                                {getTripDepartureLabel(trip)}
                                            </td>
                                            <td className="px-4 py-4 text-[#4A4A4A]">
                                                {trip.bus?.name ||
                                                    trip.bus?.model_stamp ||
                                                    'Не указан'}
                                            </td>
                                            <td className="px-4 py-4 text-[#4A4A4A]">
                                                {trip.driver?.full_name ||
                                                    'Не назначен'}
                                            </td>
                                            <td className="px-4 py-4 text-[#4A4A4A]">
                                                {getStatusLabel(trip.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="rounded-[20px] bg-white px-8 py-8">
                    <p className="text-2xl font-semibold text-[#4A4A4A]">
                        Проблемы и предупреждения
                    </p>
                    <div className="mt-5 flex flex-col gap-3">
                        <div className="rounded-[16px] bg-[#F8FAFC] px-4 py-4">
                            <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                                Рейсы без водителя
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#E74949]">
                                {tripsWithoutDriver}
                            </p>
                        </div>
                        <div className="rounded-[16px] bg-[#F8FAFC] px-4 py-4">
                            <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                                Рейсы без автобуса
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#E74949]">
                                {tripsWithoutBus}
                            </p>
                        </div>
                        <div className="rounded-[16px] bg-[#F8FAFC] px-4 py-4">
                            <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                                Неактивные водители
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#E74949]">
                                {inactiveDrivers.length}
                            </p>
                        </div>
                        <div className="rounded-[16px] bg-[#FFF4E5] px-4 py-4">
                            <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                                Ограничение текущего API
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#4A4A4A]">
                                Метрики по выручке, проданным билетам, техосмотру
                                и загрузке автобусов появятся после расширения
                                backend-контракта.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
