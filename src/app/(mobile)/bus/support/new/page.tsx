import Topbar from '@/components/topbar';
import { getSession } from '@/lib/auth';
import { passengerSupportFetch } from '@/lib/passenger-support-api';
import { z } from 'zod';
import { CreateSupportForm, PassengerLoginCard } from '../support-controls';

const ticketsSchema = z.array(
    z.object({
        id: z.number().int().positive(),
        from_date: z.string().nullable(),
        from_point: z.object({ name: z.string() }),
        to_point: z.object({ name: z.string() }),
    })
);

type SearchParams = Promise<{ ticketId?: string }>;

export default async function NewSupportPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const session = await getSession();
    if (!session) {
        return (
            <>
                <Topbar backHref="/bus/support">Новое обращение</Topbar>
                <PassengerLoginCard />
            </>
        );
    }

    const params = await searchParams;
    const initialTicketId = Number.parseInt(params.ticketId ?? '', 10);
    let tickets: z.infer<typeof ticketsSchema> = [];
    let error = '';
    try {
        const response = await passengerSupportFetch('/accounts/my-tickets/');
        if (!response.ok) throw new Error();
        tickets = ticketsSchema.parse(await response.json());
    } catch {
        error = 'Не удалось загрузить ваши билеты.';
    }

    const options = tickets.map((ticket) => ({
        id: ticket.id,
        label: `№${ticket.id} · ${ticket.from_point.name} — ${ticket.to_point.name}${ticket.from_date ? ` · ${ticket.from_date}` : ''}`,
    }));

    return (
        <>
            <Topbar backHref="/bus/support">Новое обращение</Topbar>
            <main className="min-h-full bg-[var(--gray)] px-5 py-6 text-[#4A4A4A]">
                <h1 className="text-2xl font-semibold">Вопрос по билету</h1>
                <p className="mt-2 text-sm text-[#7C8799]">
                    Выберите поездку и опишите, с чем нужна помощь.
                </p>
                {error ? (
                    <p
                        role="alert"
                        className="mt-6 rounded-[14px] bg-white p-5"
                    >
                        {error}
                    </p>
                ) : options.length === 0 ? (
                    <p className="mt-6 rounded-[14px] bg-white p-5">
                        В аккаунте пока нет билетов, по которым можно создать
                        обращение.
                    </p>
                ) : (
                    <div className="mt-6 rounded-[14px] bg-white p-5">
                        <CreateSupportForm
                            tickets={options}
                            initialTicketId={
                                options.some(
                                    (ticket) => ticket.id === initialTicketId
                                )
                                    ? initialTicketId
                                    : undefined
                            }
                        />
                    </div>
                )}
            </main>
        </>
    );
}
