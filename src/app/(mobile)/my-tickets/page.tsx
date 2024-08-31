'use client';
import React from 'react';
import Button from '@/components/button';
import Link from 'next/link';
import Ticket from '@/components/ticket';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getMyTicketsAction } from './actions';
import Spinner from '@/components/spinner';

const MyTicketsPage = () => {
    const { data, isPending } = useServerActionQuery(getMyTicketsAction, {
        input: undefined,
        queryKey: ['my-tickets'],
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retryOnMount: true,
        refetchInterval: 1000 * 30,
    });

    if (isPending) {
        return (
            <div className="h-full bg-[var(--gray)] px-5">
                <h1 className="pt-[75px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
                    Мои билеты
                </h1>
                <div className="mt-3 flex flex-wrap justify-center gap-1 py-5">
                    <Spinner size="md" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-[var(--gray)] px-5">
            <h1 className="pt-[75px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
                Мои билеты
            </h1>
            <div className="flex flex-col">
                <div className="flex flex-col pt-5">
                    {data?.map((ticket) => (
                        <Link href="/my-tickets/qr-tickets" key={ticket.id}>
                            <Ticket ticket={ticket} />
                        </Link>
                    ))}
                </div>

                <Link href="/my-tickets/history-tickets">
                    <Button variant="ghost" className="my-5">
                        История покупки билетов
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default MyTicketsPage;
