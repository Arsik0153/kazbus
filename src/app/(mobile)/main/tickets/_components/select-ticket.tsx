'use client';
import Topbar from '@/components/topbar';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Spinner from '@/components/spinner';
import { getStringByNumber } from '@/utils/helper.';
import Ticket from '@/components/ticket';
import { dayjsExt } from '@/lib/dayjs';
import { Ticket as TicketT } from '@/data/types';
import Button from '@/components/button';
import { getTicketsAction } from '../actions';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    onTicketSelect: (ticket: TicketT) => void;
};

const SelectTicket = (props: Props) => {
    const { onTicketSelect } = props;
    const searchParams = useSearchParams();

    const dateParam = searchParams.get('date');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;

    const [selectedTicket, setSelectedTicket] = useState<TicketT | null>(null);

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
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );

    const from = tickets?.[0]?.from_point.name;
    const to = tickets?.[0]?.to_point.name;

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

    if (!isPending && tickets?.length === 0) {
        return (
            <>
                <Topbar backHref={'/main?' + searchParams.toString()}>
                    <div className="flex flex-col items-center py-6" />
                </Topbar>
                <div className="my-5 flex justify-center px-4 py-7">
                    <div className="mt-16 flex w-full flex-col items-center gap-5 text-center text-[#A0A0A0]">
                        <Image
                            src="/assets/tickets/no-tickets.svg"
                            alt="No tickets"
                            width={64}
                            height={64}
                        />

                        <h1 className="text-center text-2xl font-semibold text-black">
                            Билеты по маршруту <br /> не найдены
                        </h1>
                        <Link
                            href={'/main?' + searchParams.toString()}
                            className="w-full"
                        >
                            <Button variant="secondary">
                                Выбрать другой маршрут
                            </Button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar backHref={'/main?' + searchParams.toString()}>
                <div className="flex flex-col items-center">
                    {from} - {to}
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
                    <label className="cursor-pointer">
                        <input type="radio" name="options" value="cheap" className="sr-only peer" />
                        <p className="w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0] peer-checked:border-[#E74949] peer-checked:text-[#E74949]">
                            Самые дешевые
                        </p>
                    </label>

                    <label className="cursor-pointer">
                        <input type="radio" name="options" value="fast" className="sr-only peer" />
                        <p className="w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0]  peer-checked:border-[#E74949] peer-checked:text-[#E74949]">
                            Быстрые
                        </p>
                    </label>

                    <label className="cursor-pointer">
                        <input type="radio" name="options" value="lying" className="sr-only peer" />
                        <p className="w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0]  peer-checked:border-[#E74949] peer-checked:text-[#E74949]">
                            Лежачие
                        </p>
                    </label>
                </div>


                <div className="mt-3">
                    {tickets?.map((ticket) => (
                        <Ticket
                            key={ticket.id}
                            ticket={ticket}
                            onClick={() => setSelectedTicket(ticket)}
                            selected={selectedTicket?.id === ticket.id}
                        />
                    ))}
                </div>
            </div>

            {selectedTicket && (
                <div className="fixed bottom-32 left-0 right-0 px-4">
                    <Button
                        onClick={() => onTicketSelect(selectedTicket)}
                        variant="secondary"
                    >
                        Далее
                    </Button>
                </div>
            )}
        </>
    );
};

export default SelectTicket;
