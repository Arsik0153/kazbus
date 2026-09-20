import Link from 'next/link';
import { notFound } from 'next/navigation';
import Topbar from '@/components/topbar';
import { getSession } from '@/lib/auth';
import {
    formatSupportDate,
    supportDetailSchema,
    supportStatusLabels,
} from '@/lib/passenger-support';
import { passengerSupportFetch } from '@/lib/passenger-support-api';
import {
    PassengerLoginCard,
    PassengerReplyForm,
    RefreshSupportButton,
} from '../support-controls';

export const dynamic = 'force-dynamic';

export default async function PassengerSupportDetailPage({
    params,
}: {
    params: Promise<{ supportId: string }>;
}) {
    const session = await getSession();
    if (!session) {
        return (
            <>
                <Topbar backHref="/bus/support">Обращение</Topbar>
                <PassengerLoginCard />
            </>
        );
    }

    const supportId = Number.parseInt((await params).supportId, 10);
    if (!Number.isInteger(supportId) || supportId < 1) notFound();

    let support;
    let error = '';
    let response: Response | undefined;
    try {
        response = await passengerSupportFetch(`/books/support/${supportId}/`);
    } catch {
        error = 'Не удалось загрузить обращение.';
    }
    if (response?.status === 404) notFound();
    if (response && !response.ok) {
        error = 'Не удалось загрузить обращение.';
    } else if (response) {
        const parsed = supportDetailSchema.safeParse(await response.json());
        if (parsed.success) support = parsed.data;
        else error = 'Сервис вернул некорректный ответ.';
    }

    return (
        <>
            <Topbar backHref="/bus/support">Обращение №{supportId}</Topbar>
            <main className="min-h-full bg-[var(--gray)] px-5 py-6 text-[#4A4A4A]">
                {error || !support ? (
                    <div role="alert" className="rounded-[14px] bg-white p-5">
                        <p>{error}</p>
                        <div className="mt-4">
                            <RefreshSupportButton />
                        </div>
                    </div>
                ) : (
                    <>
                        <section className="rounded-[14px] bg-white p-5">
                            <div className="flex items-start justify-between gap-3">
                                <h1 className="text-xl font-semibold">
                                    {support.subject}
                                </h1>
                                <span className="shrink-0 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold">
                                    {supportStatusLabels[support.status]}
                                </span>
                            </div>
                            <Link
                                href={`/bus/my-tickets/${support.ticket.id}`}
                                className="mt-4 block text-sm font-semibold text-[#E23333] underline"
                            >
                                Билет №{support.ticket.id}:{' '}
                                {support.ticket.route.from} —{' '}
                                {support.ticket.route.to}
                            </Link>
                            <div className="mt-4">
                                <RefreshSupportButton />
                            </div>
                        </section>

                        <section
                            aria-label="Переписка"
                            className="mt-5 space-y-3"
                        >
                            {support.messages.map((message) => {
                                const own = message.senderRole === 'passenger';
                                return (
                                    <article
                                        key={message.id}
                                        className={`max-w-[88%] rounded-[14px] p-4 ${own ? 'ml-auto bg-[#E23333] text-white' : 'bg-white'}`}
                                    >
                                        <p className="text-xs font-semibold opacity-75">
                                            {own ? 'Вы' : message.authorName}
                                        </p>
                                        <p className="mt-2 text-base break-words whitespace-pre-wrap">
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
                        </section>

                        <section className="mt-5 rounded-[14px] bg-white p-5">
                            {support.status === 'closed' ? (
                                <p className="text-sm text-[#7C8799]">
                                    Обращение закрыто. Если появился новый
                                    вопрос, создайте новое обращение по билету.
                                </p>
                            ) : (
                                <PassengerReplyForm supportId={support.id} />
                            )}
                        </section>
                    </>
                )}
            </main>
        </>
    );
}
