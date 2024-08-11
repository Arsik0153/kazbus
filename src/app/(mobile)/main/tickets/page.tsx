'use client';
import Topbar from '@/components/topbar';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { getTicketsAction } from './actions';
import Spinner from '@/components/spinner';
import { getStringByNumber } from '@/utils/helper.';
import Ticket from '@/components/ticket';
import { dayjsExt } from '@/lib/dayjs';

const TicketsPage = () => {
    const searchParams = useSearchParams();

    const dateParam = searchParams.get('date');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;
    console.log(dateParam, passengerCountParam);
    const { data: tickets, isPending } = useServerActionQuery(
        getTicketsAction,
        {
            input: {
                date: dateParam || '',
                from_point: Number(fromParam) || 0,
                to_point: Number(toParam) || 0,
                passenger_count: passengerCountParam,
            },
            queryKey: [
                'tickets',
                dateParam,
                fromParam,
                toParam,
                passengerCountParam,
            ],
        }
    );

    if (isPending) {
        return (
            <>
                <Topbar backHref="/main">
                    <div className="flex flex-col items-center py-6" />
                </Topbar>
                <div className="my-5 flex justify-center px-4 py-7">
                    <Spinner size="md" />
                </div>
            </>
        );
    }

    if (!isPending && !tickets) {
        return (
            <>
                <Topbar backHref="/main">
                    <div className="flex flex-col items-center py-6" />
                </Topbar>
                <div className="my-5 flex justify-center px-4 py-7">
                    <div className="text-center text-[#A0A0A0]">
                        Нет доступных билетов
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar backHref={'/main?' + searchParams.toString()}>
                <div className="flex flex-col items-center">
                    Алматы - Кокшетау
                    <span className="text-sm font-light">
                        {dayjsExt(dateParam).format('D MMMM')},{' '}
                        {passengerCountParam}{' '}
                        {getStringByNumber(passengerCountParam, [
                            'пассажир',
                            'пассажира',
                            'пассажиров',
                        ])}
                    </span>
                </div>
            </Topbar>
            <div className="my-5 px-4">
                <div className="flex flex-wrap gap-1">
                    <div className="w-fit rounded-full border border-[#E74949] px-5 py-[5px] text-sm font-semibold text-[#E74949]">
                        Самые дешевые
                    </div>
                    <div className="w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0]">
                        Быстрые
                    </div>
                    <div className="w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0]">
                        Лежачие
                    </div>
                </div>

                <div className="mt-3">
                    {tickets?.map((ticket) => (
                        <Ticket key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            </div>
        </>
    );
};

const TicketPageSuspended = () => {
    <Suspense>
        <TicketsPage />
    </Suspense>;
};

export default TicketPageSuspended;
