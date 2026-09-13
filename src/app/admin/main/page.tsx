import Link from 'next/link';

import AdminStateCard from '@/components/admin/state-card';
import { Button } from '@/components/ui/button';
import { Bus, Driver, Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

type DashboardMetric = {
    label: string;
    value: string;
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
    const activeDrivers = drivers.filter(
        (driver) => driver.is_active !== false
    );
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
        },
        {
            label: 'Активные водители',
            value: String(activeDrivers.length),
        },
    ];

    return (
        <div className="flex flex-col gap-5">
            <section className="rounded-[20px] bg-white px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold text-[#4A4A4A] sm:text-3xl">
                        Обзор автопарка
                    </h1>
                    <Button asChild size="lg">
                        <Link href="/admin/main/trips/new-trip">
                            Создать рейс
                        </Link>
                    </Button>
                </div>
            </section>

            <section
                aria-label="Основные показатели"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-[20px] bg-white px-5 py-5 sm:px-6"
                    >
                        <p className="text-sm font-bold text-[#6B7280] uppercase">
                            {metric.label}
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-[#E74949]">
                            {metric.value}
                        </p>
                    </div>
                ))}
            </section>

            <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                <section className="min-w-0 rounded-[20px] bg-white px-5 py-6 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-[#4A4A4A] sm:text-2xl">
                            Ближайшие рейсы
                        </h2>
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
                        <div className="mt-5 overflow-x-auto rounded-[16px] border border-[#E5E7EB]">
                            <table className="w-full min-w-[640px] border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-[#F8FAFC]">
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-bold text-[#6B7280] uppercase"
                                        >
                                            Маршрут
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-bold text-[#6B7280] uppercase"
                                        >
                                            Отправление
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-bold text-[#6B7280] uppercase"
                                        >
                                            Автобус
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-bold text-[#6B7280] uppercase"
                                        >
                                            Водитель
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-bold text-[#6B7280] uppercase"
                                        >
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
                                                {trip.from_city} -{' '}
                                                {trip.to_city}
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
                </section>

                <section className="rounded-[20px] bg-white px-5 py-6 sm:px-6">
                    <h2 className="text-xl font-semibold text-[#4A4A4A] sm:text-2xl">
                        Требует внимания
                    </h2>
                    <div className="mt-5 flex flex-col gap-3">
                        <div className="rounded-[16px] bg-[#F8FAFC] px-4 py-4">
                            <p className="text-sm font-bold text-[#6B7280] uppercase">
                                Рейсы без водителя
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#E74949]">
                                {tripsWithoutDriver}
                            </p>
                        </div>
                        <div className="rounded-[16px] bg-[#F8FAFC] px-4 py-4">
                            <p className="text-sm font-bold text-[#6B7280] uppercase">
                                Рейсы без автобуса
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#E74949]">
                                {tripsWithoutBus}
                            </p>
                        </div>
                        <div className="rounded-[16px] bg-[#F8FAFC] px-4 py-4">
                            <p className="text-sm font-bold text-[#6B7280] uppercase">
                                Неактивные водители
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#E74949]">
                                {inactiveDrivers.length}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
