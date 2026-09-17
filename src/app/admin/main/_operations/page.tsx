import Link from 'next/link';
import { ZodError } from 'zod';
import { logoutAction } from '../../action';
import { normalizeOperationsQuery, type OperationsQuery } from './query';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';
import { operationsSchema } from './schema';
import { RefreshOperations, ResolutionForm } from './controls';

export type OperationsParams = Promise<OperationsQuery>;
type Mode = 'analytics' | 'monitoring' | 'support';
const titles: Record<Mode, string> = {
    analytics: 'Операционная аналитика',
    monitoring: 'Мониторинг рейсов',
    support: 'Обращения водителей',
};
const statuses: Record<string, string> = {
    bus_arrival: 'Ожидает посадки',
    boarding: 'Посадка',
    departure: 'Отправление',
    enroute: 'В пути',
    arrival: 'Завершён',
    cancelled: 'Отменён',
    not_on_sale: 'Продажи закрыты',
    active: 'В продаже',
    scheduled: 'По расписанию',
};
const metrics = {
    scheduledTrips: 'Рейсов на дату',
    completedTrips: 'Завершено рейсов',
    paidPassengers: 'Пассажиров с оплатой',
    bookedPassengers: 'Действующих броней мест',
    boardedPassengers: 'Отмечено на посадке',
    openIncidents: 'Открытых обращений',
} as const;

export default async function OperationsPage({
    mode,
    searchParams,
}: {
    mode: Mode;
    searchParams: OperationsParams;
}) {
    const params = normalizeOperationsQuery(await searchParams);
    const date =
        params.date ||
        new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Almaty',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());
    let data;
    let error = '';
    let needsLogin = false;
    try {
        const response = await adminFetch(
            `/trip/operations/?date=${encodeURIComponent(date)}`
        );
        needsLogin = response.status === 401;
        if (!response.ok)
            throw new Error(
                await getAdminApiError(response, 'Не удалось загрузить данные.')
            );
        data = operationsSchema.parse(await response.json());
    } catch (cause) {
        error =
            cause instanceof ZodError
                ? 'Сервер вернул некорректные данные.'
                : cause instanceof Error
                  ? cause.message
                  : 'Не удалось загрузить данные.';
    }
    const query = (params.q || '').trim().toLocaleLowerCase('ru');
    const trips =
        data?.trips.filter((t) =>
            `${t.route} ${t.bus} ${t.driver}`
                .toLocaleLowerCase('ru')
                .includes(query)
        ) ?? [];
    const incidents =
        data?.incidents.filter(
            (i) =>
                (!params.status ||
                    params.status === 'all' ||
                    (params.status === 'closed'
                        ? Boolean(i.resolvedAt)
                        : !i.resolvedAt)) &&
                `${i.title} ${i.comment} ${i.driverName}`
                    .toLocaleLowerCase('ru')
                    .includes(query)
        ) ?? [];
    return (
        <main className="space-y-6 pb-8 text-[#4A4A4A]">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">{titles[mode]}</h1>
                <RefreshOperations />
            </header>
            <nav className="flex flex-wrap gap-4">
                {Object.entries(titles).map(([key, title]) => (
                    <Link
                        aria-current={key === mode ? 'page' : undefined}
                        className="underline aria-[current=page]:font-bold"
                        key={key}
                        href={`/admin/main/${key}?date=${date}`}
                    >
                        {title}
                    </Link>
                ))}
            </nav>
            <form
                method="get"
                className="flex flex-wrap items-end gap-3 rounded-xl bg-white p-5"
            >
                <label>
                    Дата рейса
                    <input
                        className="mt-1 block rounded-lg border p-2"
                        name="date"
                        type="date"
                        defaultValue={date}
                        required
                    />
                </label>
                {mode !== 'analytics' && (
                    <label className="min-w-48 flex-1">
                        Поиск
                        <input
                            className="mt-1 block w-full rounded-lg border p-2"
                            name="q"
                            defaultValue={params.q}
                            placeholder={
                                mode === 'support'
                                    ? 'Тема или водитель'
                                    : 'Маршрут, автобус или водитель'
                            }
                        />
                    </label>
                )}
                {mode === 'support' && (
                    <label>
                        Обращения
                        <select
                            name="status"
                            defaultValue={params.status || 'all'}
                            className="mt-1 block rounded-lg border p-2"
                        >
                            <option value="all">Все</option>
                            <option value="open">Открытые</option>
                            <option value="closed">Закрытые</option>
                        </select>
                    </label>
                )}
                <button className="rounded-lg bg-[#E23333] px-5 py-2 text-white">
                    Показать
                </button>
            </form>
            <p className="text-sm text-[#64748B]">
                Данные на выбранную дату рейса. Автоматическое обновление каждые
                30 секунд.
            </p>
            {needsLogin && (
                <form action={logoutAction}>
                    <button className="rounded-lg bg-[#E23333] px-5 py-2 text-white">
                        Войти снова
                    </button>
                </form>
            )}
            {error ? (
                <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-white p-5"
                >
                    {needsLogin
                        ? 'Сессия истекла. Войдите в кабинет снова.'
                        : `${error} Нажмите «Обновить», чтобы повторить.`}
                </p>
            ) : (
                data && (
                    <>
                        {mode !== 'support' && (
                            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {Object.entries(metrics).map(([key, label]) => (
                                    <div
                                        key={key}
                                        className="rounded-xl bg-white p-5"
                                    >
                                        <p className="text-sm">{label}</p>
                                        <p className="mt-2 text-3xl font-bold">
                                            {
                                                data.summary[
                                                    key as keyof typeof metrics
                                                ]
                                            }
                                        </p>
                                    </div>
                                ))}
                            </section>
                        )}
                        {mode === 'analytics' && (
                            <p className="rounded-xl bg-white p-5">
                                Учитываются действующие брони и оплаченные
                                пассажиры рейсов выбранного дня. Финансовые
                                показатели появятся после подключения оплаты.
                            </p>
                        )}
                        {mode === 'monitoring' && (
                            <div className="overflow-x-auto rounded-xl bg-white">
                                <table className="w-full text-left text-sm">
                                    <caption className="p-4 text-left font-semibold">
                                        Состояние рейсов
                                    </caption>
                                    <thead>
                                        <tr>
                                            {[
                                                'Рейс',
                                                'Транспорт и водитель',
                                                'Статус',
                                                'Пассажиры',
                                                '',
                                            ].map((label, i) => (
                                                <th className="p-4" key={i}>
                                                    {label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trips.map((trip) => (
                                            <tr
                                                className="border-t"
                                                key={trip.id}
                                            >
                                                <td className="p-4 font-semibold">
                                                    {trip.route}
                                                    <p className="mt-1 font-normal">
                                                        {trip.departureTime}
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    {trip.bus}
                                                    <p className="mt-1">
                                                        {trip.driver}
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    {trip.saleStatus ===
                                                    'cancelled'
                                                        ? 'Отменён'
                                                        : trip.runStatus
                                                          ? statuses[
                                                                trip.runStatus
                                                            ] || trip.runStatus
                                                          : 'Ещё не начат'}
                                                    <p className="mt-1 text-xs">
                                                        {statuses[
                                                            trip.saleStatus
                                                        ] || trip.saleStatus}
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    На посадке{' '}
                                                    {trip.boardedPassengers} ·
                                                    оплачено{' '}
                                                    {trip.paidPassengers}
                                                    <p className="mt-1">
                                                        Броней:{' '}
                                                        {trip.bookedPassengers}
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    <Link
                                                        className="underline"
                                                        href={`/admin/main/trips/${trip.id}/passengers?date=${date}`}
                                                    >
                                                        Ведомость
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {!trips.length && (
                                    <p className="p-5">
                                        Рейсов по выбранным условиям нет.
                                    </p>
                                )}
                            </div>
                        )}
                        {mode === 'support' && (
                            <section className="space-y-4">
                                {incidents.map((incident) => (
                                    <article
                                        className="rounded-xl bg-white p-5"
                                        key={incident.id}
                                    >
                                        <div className="flex flex-wrap justify-between gap-3">
                                            <h2 className="text-lg font-semibold">
                                                {incident.title}
                                            </h2>
                                            <span>
                                                {incident.resolvedAt
                                                    ? 'Закрыто'
                                                    : 'Открыто'}
                                            </span>
                                        </div>
                                        <p className="mt-2 whitespace-pre-wrap">
                                            {incident.comment}
                                        </p>
                                        <p className="mt-3 text-sm">
                                            {incident.driverName} ·{' '}
                                            {new Intl.DateTimeFormat('ru-RU', {
                                                timeZone: 'Asia/Almaty',
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            }).format(
                                                new Date(incident.createdAt)
                                            )}
                                        </p>
                                        <Link
                                            className="mt-2 inline-block underline"
                                            href={`/admin/main/trips/${incident.tripId}/passengers?date=${incident.date}`}
                                        >
                                            Рейс №{incident.tripId}
                                        </Link>
                                        {incident.resolvedAt ? (
                                            <p className="mt-4 rounded-lg bg-slate-50 p-3 whitespace-pre-wrap">
                                                {incident.resolution}
                                            </p>
                                        ) : (
                                            <ResolutionForm id={incident.id} />
                                        )}
                                    </article>
                                ))}
                                {!incidents.length && (
                                    <p className="rounded-xl bg-white p-5">
                                        Обращений по выбранным условиям нет.
                                    </p>
                                )}
                            </section>
                        )}
                    </>
                )
            )}
        </main>
    );
}
