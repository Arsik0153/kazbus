import Link from 'next/link';
import { notFound } from 'next/navigation';
import { adminFetch, getAdminApiError } from '@/lib/admin-api';
import {
    formatSupportDate,
    supportDetailSchema,
    supportStatusLabels,
} from '@/lib/passenger-support';
import {
    AdminSupportRefresh,
    AdminSupportReply,
    CloseSupportButton,
} from '../controls';

export const dynamic = 'force-dynamic';

export default async function AdminPassengerSupportDetailPage({
    params,
}: {
    params: Promise<{ supportId: string }>;
}) {
    const supportId = Number.parseInt((await params).supportId, 10);
    if (!Number.isInteger(supportId) || supportId < 1) notFound();

    let support;
    let error = '';
    let needsLogin = false;
    let response: Response | undefined;
    try {
        response = await adminFetch(`/books/admin/support/${supportId}/`);
    } catch {
        error = 'Сервер недоступен. Попробуйте ещё раз.';
    }
    if (response?.status === 404) notFound();
    if (response) {
        needsLogin = response.status === 401;
        if (!response.ok) {
            error = await getAdminApiError(
                response,
                'Не удалось загрузить обращение.'
            );
        } else {
            const parsed = supportDetailSchema.safeParse(await response.json());
            if (parsed.success) support = parsed.data;
            else error = 'Сервис вернул некорректный ответ.';
        }
    }

    return (
        <main className="mt-6 pb-10 text-[#4A4A4A]">
            <Link
                href="/admin/main/passenger-support"
                className="font-semibold text-white underline"
            >
                ← К обращениям пассажиров
            </Link>
            {error || !support ? (
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
            ) : (
                <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
                    <section className="rounded-[20px] bg-white p-5 md:p-8">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div>
                                <h1 className="text-2xl font-semibold md:text-3xl">
                                    {support.subject}
                                </h1>
                                <p className="mt-2 text-sm text-[#7C8799]">
                                    Обращение №{support.id} ·{' '}
                                    {support.passenger.name}
                                </p>
                            </div>
                            <span className="w-fit rounded-full bg-[#F3F4F6] px-3 py-1 text-sm font-semibold">
                                {supportStatusLabels[support.status]}
                            </span>
                        </div>

                        <div className="mt-6 space-y-3">
                            {support.messages.map((message) => {
                                const company =
                                    message.senderRole === 'company';
                                return (
                                    <article
                                        key={message.id}
                                        className={`max-w-[88%] rounded-xl p-4 ${company ? 'ml-auto bg-[#E23333] text-white' : 'bg-[#F1F5F9]'}`}
                                    >
                                        <p className="text-xs font-semibold opacity-75">
                                            {company
                                                ? 'Компания'
                                                : message.authorName}
                                        </p>
                                        <p className="mt-2 break-words whitespace-pre-wrap">
                                            {message.text}
                                        </p>
                                        <p className="mt-2 text-xs opacity-70">
                                            {formatSupportDate(
                                                message.createdAt
                                            )}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <aside className="space-y-5">
                        <section className="rounded-[20px] bg-white p-5">
                            <h2 className="font-semibold">Поездка</h2>
                            <p className="mt-3">Билет №{support.ticket.id}</p>
                            <p className="mt-1 text-sm text-[#7C8799]">
                                {support.ticket.route.from} —{' '}
                                {support.ticket.route.to}
                            </p>
                            {support.ticket.serviceDate && (
                                <p className="mt-1 text-sm text-[#7C8799]">
                                    Дата: {support.ticket.serviceDate}
                                </p>
                            )}
                        </section>
                        <section className="rounded-[20px] bg-white p-5">
                            {support.status === 'closed' ? (
                                <p className="text-sm text-[#7C8799]">
                                    Обращение закрыто{' '}
                                    {support.closedAt
                                        ? formatSupportDate(support.closedAt)
                                        : ''}
                                    .
                                </p>
                            ) : (
                                <div className="space-y-5">
                                    <AdminSupportReply supportId={support.id} />
                                    <CloseSupportButton
                                        supportId={support.id}
                                    />
                                </div>
                            )}
                        </section>
                    </aside>
                </div>
            )}
        </main>
    );
}
