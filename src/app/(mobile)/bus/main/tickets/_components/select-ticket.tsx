'use client';
import Topbar from '@/components/topbar';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import Spinner from '@/components/spinner';
import { getStringByNumber } from '@/utils/helper.';
import Ticket from '@/components/ticket';
import { dayjsExt } from '@/lib/dayjs';
import { Ticket as TicketT } from '@/data/types';
import Button from '@/components/button';
import { getTicketsAction } from '../actions';
import Image from 'next/image';
import Link from 'next/link';
import { SelectTicketSkeleton } from './skeleton';
import { filterTickets, type TicketFilter } from '@/utils/ticket-list';

type Props = {
    onTicketSelect: (ticket: TicketT, serviceDate: string) => void;
};

const ticketFilters: { value: TicketFilter; label: string }[] = [
    { value: 'default', label: 'Все' },
    { value: 'cheap', label: 'Самые дешевые' },
    { value: 'fast', label: 'Быстрые' },
    { value: 'recumbent', label: 'Лежачие' },
];

const SelectTicket = (props: Props) => {
    const { onTicketSelect } = props;
    const searchParams = useSearchParams();

    const dateParam = searchParams.get('date');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;

    const [selectedTicket, setSelectedTicket] = useState<TicketT | null>(null);
    const [filter, setFilter] = useState<TicketFilter>('default');

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
    const visibleTickets = useMemo(
        () => filterTickets(tickets ?? [], filter),
        [filter, tickets]
    );

    const from = tickets?.[0]?.from_point.name;
    const to = tickets?.[0]?.to_point.name;

    if (isPending) {
        return <SelectTicketSkeleton />;
    }

    if (!isPending && tickets?.length === 0) {
        return (
            <>
                <Topbar backHref={'/bus/main?' + searchParams.toString()}>
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
                            href={'/bus/main?' + searchParams.toString()}
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
            <Topbar backHref={'/bus/main?' + searchParams.toString()}>
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
                <div className="fade-in flex flex-wrap gap-1">
                    {ticketFilters.map((option) => (
                        <label key={option.value} className="cursor-pointer">
                            <input
                                type="radio"
                                name="ticket-filter"
                                value={option.value}
                                checked={filter === option.value}
                                onChange={() => setFilter(option.value)}
                                className="peer sr-only"
                            />
                            <span className="block w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0] peer-checked:border-[#E74949] peer-checked:text-[#E74949]">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>

                <div className="mt-3">
                    {visibleTickets.map((ticket) => (
                        <Ticket
                            key={ticket.id}
                            ticket={ticket}
                            onClick={() => setSelectedTicket(ticket)}
                            selected={selectedTicket?.id === ticket.id}
                            className="fade-in"
                        />
                    ))}
                    {visibleTickets.length === 0 && (
                        <p className="py-12 text-center text-sm font-medium text-[#A0A0A0]">
                            Рейсы с выбранными параметрами не найдены
                        </p>
                    )}
                </div>
            </div>

            {selectedTicket &&
                visibleTickets.some(
                    (ticket) => ticket.id === selectedTicket.id
                ) && (
                    <div className="fixed right-0 bottom-32 left-0 px-4">
                        <Button
                            onClick={() =>
                                onTicketSelect(selectedTicket, dateParam || '')
                            }
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
