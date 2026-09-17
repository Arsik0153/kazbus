'use client';

import Link from 'next/link';

import Skeleton from '@/components/skeleton';
import Ticket from '@/components/ticket';
import Topbar from '@/components/topbar';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { partitionTickets } from '@/utils/ticket-list';
import { getMyTicketsAction } from '../actions';

const TicketHistoryPage = () => {
    const { data, isPending } = useServerActionQuery(getMyTicketsAction, {
        input: undefined,
        queryKey: ['my-tickets'],
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
    const history = partitionTickets(data ?? []).history;

    return (
        <>
            <Topbar backHref="/bus/my-tickets">История поездок</Topbar>
            <div className="min-h-full bg-[var(--gray)] px-5 pt-5 pb-10">
                {isPending ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(3)].map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-[157px] w-full rounded-lg"
                            />
                        ))}
                    </div>
                ) : history.length > 0 ? (
                    <div className="fade-in flex flex-col">
                        {history.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={`/bus/my-tickets/${ticket.id}`}
                            >
                                <Ticket ticket={ticket} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[50vh] items-center justify-center text-center">
                        <p className="text-xl font-semibold text-[#A0A0A0]">
                            Завершенных и возвращенных поездок пока нет
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default TicketHistoryPage;
