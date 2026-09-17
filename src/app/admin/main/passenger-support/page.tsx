import Link from 'next/link';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';
import {
    formatSupportDate,
    supportListSchema,
    supportStatusLabels,
    type SupportStatus,
} from '@/lib/passenger-support';
import { AdminSupportRefresh } from './controls';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ status?: string; page?: string }>;

export default async function AdminPassengerSupportPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;
    const status = ['open', 'answered', 'closed'].includes(params.status ?? '')
        ? (params.status as SupportStatus)
        : undefined;
    const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
    const query = new URLSearchParams({ page: String(page) });
    if (status) query.set('status', status);

    let data;
    let error = '';
    let needsLogin = false;
    try {
        const response = await adminFetch(
            `/books/admin/support/?${query.toString()}`
        );
        needsLogin = response.status === 401;
        if (!response.ok) {
            error = await getAdminApiError(
                response,
                'Не удалось загрузить обращения пассажиров.'
            );
        } else {
            data = supportListSchema.parse(await response.json());
        }
    } catch {
        error = 'Сервер недоступен. Попробуйте ещё раз.';
    }

    return (
        <main className="mt-6 pb-10 text-[#4A4A4A]">
            <section className="rounded-[20px] bg-white px-5 py-7 md:px-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                        <h1 className="text-3xl font-semibold md:text-[42px]">
                            Обращения пассажиров
                        </h1>
                        <p className="mt-3 max-w-3xl text-[#7C8799]">
                            Вопросы по билетам на маршруты вашей компании.
                            Ответьте пассажиру или закройте решённое обращение.
                        </p>
                    </div>
                    <AdminSupportRefresh />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                    {[
                        ['', 'Все'],
                        ['open', 'Ждут ответа'],
                        ['answered', 'С ответом'],
                        ['closed', 'Закрытые'],
                    ].map(([value, label]) => (
                        <Link
                            key={value}
                            href={
                                value
                                    ? `/admin/main/passenger-support?status=${value}`
                                    : '/admin/main/passenger-support'
                            }
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                (status ?? '') === value
                                    ? 'bg-[#E23333] text-white'
                                    : 'border border-[#D1D5DB] bg-white'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </section>

            {error ? (
                <section
                    role="alert"
                    className="mt-5 rounded-[20px] bg-white p-6"
                >
                    <p>{error}</p>
                    {needsLogin ? (
                        <Link
                            href="/admin"
                            className="mt-4 inline-block font-semibold text-[#E23333] underline"
                        >
                            Войти снова
                        </Link>
                    ) : (
                        <div className="mt-4">
                            <AdminSupportRefresh />
                        </div>
                    )}
                </section>
            ) : data?.results.length === 0 ? (
                <section className="mt-5 rounded-[20px] bg-white p-10 text-center text-[#7C8799]">
                    Обращений с таким статусом пока нет.
                </section>
            ) : (
                <section className="mt-5 overflow-hidden rounded-[20px] bg-white">
                    <div className="divide-y divide-[#E5E7EB]">
                        {data?.results.map((support) => (
                            <Link
                                key={support.id}
                                href={`/admin/main/passenger-support/${support.id}`}
                                className="grid gap-3 p-5 transition-colors hover:bg-[#F8FAFC] md:grid-cols-[minmax(220px,1.5fr)_minmax(190px,1fr)_auto] md:items-center md:px-8"
                            >
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-semibold">
                                            {support.subject}
                                        </h2>
                                        <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold">
                                            {
                                                supportStatusLabels[
                                                    support.status
                                                ]
                                            }
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-[#7C8799]">
                                        {support.passenger.name} · сообщений{' '}
                                        {support.messageCount}
                                    </p>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">
                                        Билет №{support.ticket.id}
                                    </p>
                                    <p className="mt-1 text-[#7C8799]">
                                        {support.ticket.route.from} —{' '}
                                        {support.ticket.route.to}
                                    </p>
                                </div>
                                <p className="text-sm text-[#7C8799]">
                                    {formatSupportDate(support.updatedAt)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {data && (data.previous || data.next) && (
                <nav
                    aria-label="Страницы обращений"
                    className="mt-5 flex justify-between gap-3"
                >
                    {data.previous ? (
                        <Link
                            href={`/admin/main/passenger-support?page=${page - 1}${status ? `&status=${status}` : ''}`}
                            className="rounded-lg border bg-white px-4 py-3 font-semibold"
                        >
                            Назад
                        </Link>
                    ) : (
                        <span />
                    )}
                    {data.next && (
                        <Link
                            href={`/admin/main/passenger-support?page=${page + 1}${status ? `&status=${status}` : ''}`}
                            className="rounded-lg border bg-white px-4 py-3 font-semibold"
                        >
                            Дальше
                        </Link>
                    )}
                </nav>
            )}
        </main>
    );
}
