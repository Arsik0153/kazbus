import AdminSectionCard from '@/components/admin/section-card';
import { Bus, Driver, Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

type ListResult<T> = {
    data: T[] | null;
    hasError: boolean;
};

type Metric = {
    label: string;
    value: string;
    description: string;
};

type RouteSummary = {
    route: string;
    tripsCount: number;
};

async function readList<T>(path: string): Promise<ListResult<T>> {
    try {
        const response = await adminFetch(path);

        if (!response.ok) {
            return { data: null, hasError: true };
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
            return { data: null, hasError: true };
        }

        return { data: data as T[], hasError: false };
    } catch {
        return { data: null, hasError: true };
    }
}

function getKazakhstanOperationalCalendar() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Almaty',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long',
    });
    const parts = new Map(
        formatter
            .formatToParts(now)
            .map(({ type, value }) => [type, value])
    );
    const year = parts.get('year');
    const month = parts.get('month');
    const day = parts.get('day');
    const weekday = parts.get('weekday') as keyof Trips['weekdays'];

    if (!year || !month || !day || !weekday) {
        throw new Error('Не удалось определить операционную дату Казахстана.');
    }

    return {
        date: `${year}-${month}-${day}`,
        weekday,
    };
}

function isActiveOnDate(
    trip: Trips,
    date: string,
    weekday: keyof Trips['weekdays']
) {
    if (trip.status !== 'active') {
        return false;
    }

    if (
        !trip.is_always_active &&
        (!trip.start_date ||
            trip.start_date > date ||
            (trip.end_date !== null && trip.end_date < date))
    ) {
        return false;
    }

    return trip.frequency !== 'weekly' || trip.weekdays[weekday];
}

function getRouteLabel(trip: Trips) {
    const fromCity = trip.from_city?.trim() || 'Город отправления не указан';
    const toCity = trip.to_city?.trim() || 'Город прибытия не указан';

    return `${fromCity} — ${toCity}`;
}

function getMostCommonRoutes(trips: Trips[]): RouteSummary[] {
    const routes = new Map<string, number>();

    trips.forEach((trip) => {
        const route = getRouteLabel(trip);
        routes.set(route, (routes.get(route) ?? 0) + 1);
    });

    return Array.from(routes, ([route, tripsCount]) => ({
        route,
        tripsCount,
    }))
        .sort(
            (left, right) =>
                right.tripsCount - left.tripsCount ||
                left.route.localeCompare(right.route, 'ru')
        )
        .slice(0, 5);
}

function getMetricValue(value: number | null) {
    return value === null ? 'Нет данных' : String(value);
}

export default async function AnalyticsPage() {
    const [tripsResult, busesResult, driversResult] = await Promise.all([
        readList<Trips>('/trip/trips/'),
        readList<Bus>('/buses/'),
        readList<Driver>('/drivers/'),
    ]);

    const today = getKazakhstanOperationalCalendar();
    const trips = tripsResult.data;
    const buses = busesResult.data;
    const drivers = driversResult.data;
    const activeTripsToday = trips?.filter((trip) =>
        isActiveOnDate(trip, today.date, today.weekday)
    ).length;
    const activeDrivers = drivers?.filter(
        (driver) => driver.is_active && driver.account_status === 'active'
    ).length;
    const inactiveDrivers = drivers?.filter(
        (driver) => !driver.is_active
    ).length;
    const driversWithInactiveAccounts = drivers?.filter(
        (driver) => driver.account_status !== 'active'
    ).length;
    const tripsWithoutBus = trips?.filter((trip) => !trip.bus).length;
    const tripsWithoutDriver = trips?.filter((trip) => !trip.driver).length;
    const routes = trips ? getMostCommonRoutes(trips) : [];
    const failedSources = [
        tripsResult.hasError ? 'рейсы' : null,
        busesResult.hasError ? 'автобусы' : null,
        driversResult.hasError ? 'водители' : null,
    ].filter(Boolean);

    const metrics: Metric[] = [
        {
            label: 'Всего рейсов',
            value: getMetricValue(trips?.length ?? null),
            description: trips
                ? 'Рейсы, доступные в текущем контуре.'
                : 'Не удалось получить список рейсов.',
        },
        {
            label: 'Активные рейсы сегодня',
            value: getMetricValue(activeTripsToday ?? null),
            description: trips
                ? 'Статус «Активен» на текущие дату и день недели по операционному времени Казахстана.'
                : 'Не удалось определить активные рейсы.',
        },
        {
            label: 'Автобусы в системе',
            value: getMetricValue(buses?.length ?? null),
            description: buses
                ? 'Транспорт из доступного списка автобусов.'
                : 'Не удалось получить список автобусов.',
        },
        {
            label: 'Активные водители',
            value: getMetricValue(activeDrivers ?? null),
            description: drivers
                ? 'Активные водители с действующей учетной записью.'
                : 'Не удалось получить список водителей.',
        },
    ];

    return (
        <div className="mt-6 flex flex-col gap-5">
            <section className="rounded-[20px] bg-white px-8 py-10">
                <div className="max-w-3xl">
                    <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                        Операционная аналитика
                    </h1>
                    <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                        Сводка по рейсам, автопарку и водителям на основе
                        доступных данных backend. Даты и дни рейсов рассчитаны
                        по операционному времени Казахстана (Asia/Almaty).
                    </p>
                </div>
            </section>

            {failedSources.length > 0 ? (
                <div className="rounded-[20px] border border-[#F5C2C7] bg-[#FFF5F5] px-6 py-5">
                    <p className="text-base font-semibold text-[#A83A3A]">
                        Часть операционных данных недоступна
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#A0A0A0]">
                        Не удалось загрузить: {failedSources.join(', ')}. Для
                        этих показателей отображается «Нет данных», а не
                        нулевое значение.
                    </p>
                </div>
            ) : null}

            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
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
                        <p className="mt-3 text-sm font-medium text-[#A0A0A0]">
                            {metric.description}
                        </p>
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">
                <AdminSectionCard
                    title="Наиболее частые маршруты"
                    description="Рейтинг построен по количеству заведенных рейсов, не по продажам билетов."
                >
                    {trips === null ? (
                        <div className="rounded-[16px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center">
                            <p className="text-lg font-semibold text-[#4A4A4A]">
                                Нет данных о маршрутах
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                Список рейсов временно недоступен, поэтому
                                рейтинг маршрутов не рассчитан.
                            </p>
                        </div>
                    ) : routes.length === 0 ? (
                        <div className="rounded-[16px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center">
                            <p className="text-lg font-semibold text-[#4A4A4A]">
                                Рейсов пока нет
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                Когда в системе появятся рейсы, здесь будет
                                показана частота маршрутов.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-[16px] border border-[#E5E7EB]">
                            <table className="w-full border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-[#F8FAFC]">
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                            Маршрут
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-bold uppercase text-[#A0A0A0]">
                                            Рейсов
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routes.map((route) => (
                                        <tr
                                            key={route.route}
                                            className="border-t border-[#EEF2F6]"
                                        >
                                            <td className="px-4 py-4 font-semibold text-[#4A4A4A]">
                                                {route.route}
                                            </td>
                                            <td className="px-4 py-4 text-right text-lg font-semibold text-[#E74949]">
                                                {route.tripsCount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AdminSectionCard>

                <AdminSectionCard
                    title="Качество операций"
                    description="Проверка назначений и доступности водителей."
                >
                    <div className="flex flex-col gap-3">
                        {[
                            {
                                label: 'Рейсы без автобуса',
                                value: getMetricValue(tripsWithoutBus ?? null),
                                available: trips !== null,
                            },
                            {
                                label: 'Рейсы без водителя',
                                value: getMetricValue(tripsWithoutDriver ?? null),
                                available: trips !== null,
                            },
                            {
                                label: 'Неактивные водители',
                                value: getMetricValue(inactiveDrivers ?? null),
                                available: drivers !== null,
                            },
                            {
                                label: 'Учетные записи не активны',
                                value: getMetricValue(
                                    driversWithInactiveAccounts ?? null
                                ),
                                available: drivers !== null,
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between gap-4 rounded-[16px] bg-[#F8FAFC] px-4 py-4"
                            >
                                <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                                    {item.label}
                                </p>
                                <p
                                    className={`text-2xl font-semibold ${
                                        item.available
                                            ? 'text-[#E74949]'
                                            : 'text-[#64748B]'
                                    }`}
                                >
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </AdminSectionCard>
            </div>

            <section className="rounded-[20px] border border-[#F6D49D] bg-[#FFF9ED] px-8 py-8">
                <p className="text-2xl font-semibold text-[#4A4A4A]">
                    Коммерческие метрики недоступны
                </p>
                <p className="mt-2 max-w-3xl text-sm font-medium text-[#8A6A35]">
                    В текущем backend-контракте нет подтвержденных данных о
                    продажах билетов, выручке и загрузке рейсов. Эти показатели
                    не рассчитываются из цены билета, количества мест или
                    других косвенных полей, чтобы не вводить в заблуждение.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {['Проданные билеты', 'Выручка', 'Загрузка рейсов'].map(
                        (label) => (
                            <div
                                key={label}
                                className="rounded-[14px] border border-[#F6DFAE] bg-white/70 px-4 py-4"
                            >
                                <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                                    {label}
                                </p>
                                <p className="mt-2 text-xl font-semibold text-[#8A6A35]">
                                    Нет данных
                                </p>
                            </div>
                        )
                    )}
                </div>
            </section>
        </div>
    );
}
