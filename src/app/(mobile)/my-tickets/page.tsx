'use client';
import React from 'react';
import Button from '@/components/button';
import Link from 'next/link';
import Ticket from '@/components/ticket';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getMyTicketsAction } from './actions';
import Spinner from '@/components/spinner';
import Image from 'next/image';

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

    if (!isPending && data?.length === 0) {
        return (
            <>
                <div className="h-full bg-[var(--gray)] px-5">
                    <h1 className="pt-[75px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
                        Мои билеты
                    </h1>
                    <div className="my-5 flex justify-center px-4 py-7">
                        <div className="mt-16 flex w-full flex-col items-center gap-5 text-center text-[#A0A0A0]">
                            <Image
                                src="/assets/tickets/no-tickets.svg"
                                alt="No tickets"
                                width={64}
                                height={64}
                            />

                            <h1 className="text-center text-2xl font-semibold text-black">
                                У вас еще нет <br /> билетов
                            </h1>
                            <Link
                                href={'/main?passenger_count=1'}
                                className="w-full"
                            >
                                <Button variant="secondary">
                                    Перейти к поиску
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
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
                    <Button variant="ghost" className="mb-10 mt-5">
                        История покупки билетов
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default MyTicketsPage;
