import Link from 'next/link';
import Topbar from '@/components/topbar';
import { getSession } from '@/lib/auth';
import {
    formatSupportDate,
    supportListSchema,
    supportStatusLabels,
    type SupportStatus,
} from '@/lib/passenger-support';
import { passengerSupportFetch } from '@/lib/passenger-support-api';
import { PassengerLoginCard, RefreshSupportButton } from './support-controls';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ status?: string; page?: string }>;

export default async function PassengerSupportPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const session = await getSession();
    if (!session) {
        return (
            <>
                <Topbar backHref="/bus/profile">Служба поддержки</Topbar>
                <PassengerLoginCard />
            </>
        );
    }

    const params = await searchParams;
    const status = ['open', 'answered', 'closed'].includes(params.status ?? '')
        ? (params.status as SupportStatus)
        : undefined;
    const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
    const query = new URLSearchParams({ page: String(page) });
    if (status) query.set('status', status);

    let data;
    let error = '';
    try {
        const response = await passengerSupportFetch(
            `/books/support/?${query.toString()}`
        );
        if (!response.ok) throw new Error();
        data = supportListSchema.parse(await response.json());
    } catch {
        error = 'Не удалось загрузить обращения. Попробуйте ещё раз.';
    }

    return (
        <>
            <Topbar backHref="/bus/profile">Служба поддержки</Topbar>
            <main className="min-h-full bg-[var(--gray)] px-5 py-6 text-[#4A4A4A]">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Мои обращения
                        </h1>
                        {data && (
                            <p className="mt-1 text-sm text-[#7C8799]">
                                Всего: {data.count}
                            </p>
                        )}
                    </div>
                    <RefreshSupportButton />
                </div>

                <Link
                    href="/bus/support/new"
                    className="mt-5 flex w-full items-center justify-center rounded-[10px] bg-[#E23333] px-4 py-4 text-base font-semibold text-white"
                >
                    Новое обращение
                </Link>

                <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
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
                                    ? `/bus/support?status=${value}`
                                    : '/bus/support'
                            }
                            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                                (status ?? '') === value
                                    ? 'bg-[#E23333] text-white'
                                    : 'border border-[#D1D1D1] bg-white'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {error ? (
                    <div
                        role="alert"
                        className="mt-6 rounded-[14px] bg-white p-5"
                    >
                        <p>{error}</p>
                        <div className="mt-4">
                            <RefreshSupportButton />
                        </div>
                    </div>
                ) : data?.results.length === 0 ? (
                    <div className="mt-6 rounded-[14px] bg-white p-8 text-center text-[#7C8799]">
                        Обращений пока нет.
                    </div>
                ) : (
                    <div className="mt-5 space-y-3">
                        {data?.results.map((support) => (
                            <Link
                                key={support.id}
                                href={`/bus/support/${support.id}`}
                                className="block rounded-[14px] bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="font-semibold">
                                        {support.subject}
                                    </h2>
                                    <span className="shrink-0 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold">
                                        {supportStatusLabels[support.status]}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm">
                                    Билет №{support.ticket.id} ·{' '}
                                    {support.ticket.route.from} —{' '}
                                    {support.ticket.route.to}
                                </p>
                                <p className="mt-2 text-xs text-[#7C8799]">
                                    Обновлено{' '}
                                    {formatSupportDate(support.updatedAt)} ·
                                    сообщений {support.messageCount}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}

                {data && (data.previous || data.next) && (
                    <nav
                        aria-label="Страницы обращений"
                        className="mt-6 flex justify-between gap-3"
                    >
                        {data.previous ? (
                            <Link
                                href={`/bus/support?page=${page - 1}${status ? `&status=${status}` : ''}`}
                                className="rounded-lg border bg-white px-4 py-3"
                            >
                                Назад
                            </Link>
                        ) : (
                            <span />
                        )}
                        {data.next && (
                            <Link
                                href={`/bus/support?page=${page + 1}${status ? `&status=${status}` : ''}`}
                                className="rounded-lg border bg-white px-4 py-3"
                            >
                                Дальше
                            </Link>
                        )}
                    </nav>
                )}
            </main>
        </>
    );
}
