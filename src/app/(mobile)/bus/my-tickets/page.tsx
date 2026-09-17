'use client';
import React from 'react';
import Button from '@/components/button';
import Link from 'next/link';
import Ticket from '@/components/ticket';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getMyTicketsAction } from './actions';
import Image from 'next/image';
import Skeleton from '@/components/skeleton';
import { partitionTickets } from '@/utils/ticket-list';

const MyTicketsPage = () => {
    const { data, isPending, isError, refetch } = useServerActionQuery(getMyTicketsAction, {
        input: undefined,
        queryKey: ['my-tickets'],
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retryOnMount: true,
        refetchInterval: 1000 * 30,
    });
    const { current, history } = partitionTickets(data ?? []);

    if (isPending) {
        return <MyTicketsPageSkeleton />;
    }

    if (isError) {
        return <div className="min-h-screen bg-[var(--gray)] px-5 pt-24">
            <h1 className="text-3xl font-semibold">Мои билеты</h1>
            <p role="alert" className="my-5">Не удалось загрузить билеты. Проверьте соединение или войдите в аккаунт.</p>
            <Button onClick={() => refetch()}>Повторить</Button>
            <Link className="mt-4 block text-center underline" href="/bus/profile/login">Войти</Link>
        </div>;
    }

    if (!isPending && data?.length === 0) {
        return (
            <>
                <div className="h-full bg-[var(--gray)] px-5">
                    <h1 className="pt-[75px] text-[42px] leading-[46.2px] font-semibold tracking-[-3%] text-[var(--black)]">
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
                                href={'/bus/main?passenger_count=1'}
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
            <h1 className="pt-[75px] text-[42px] leading-[46.2px] font-semibold tracking-[-3%] text-[var(--black)]">
                Мои билеты
            </h1>
            <div className="fade-in flex flex-col">
                <div className="flex flex-col pt-5">
                    {current.map((ticket) => (
                        <Link
                            href={`/bus/my-tickets/${ticket.id}`}
                            key={ticket.id}
                        >
                            <Ticket ticket={ticket} />
                        </Link>
                    ))}
                    {current.length === 0 && (
                        <p className="py-12 text-center text-xl font-semibold text-[#A0A0A0]">
                            Предстоящих поездок пока нет
                        </p>
                    )}
                </div>

                <Link href="/bus/my-tickets/history-tickets">
                    <Button variant="ghost" className="mt-5 mb-10">
                        История поездок
                        {history.length > 0 ? ` (${history.length})` : ''}
                    </Button>
                </Link>
            </div>
        </div>
    );
};

const MyTicketsPageSkeleton = () => {
    return (
        <div className="h-full bg-[var(--gray)] px-5">
            <h1 className="pt-[75px] text-[42px] leading-[46.2px] font-semibold tracking-[-3%] text-[var(--black)]">
                Мои билеты
            </h1>
            <div className="flex flex-col">
                <div className="flex flex-col pt-5">
                    {[...Array(3)].map((_, index) => (
                        <Skeleton
                            key={index}
                            className="mb-3 h-[157px] w-full rounded-lg"
                        />
                    ))}
                </div>

                <Skeleton className="mt-5 mb-10 h-[70px] w-full rounded-[10px]" />
            </div>
        </div>
    );
};

export default MyTicketsPage;
