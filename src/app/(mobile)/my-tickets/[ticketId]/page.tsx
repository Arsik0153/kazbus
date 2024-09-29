'use client';
import React from 'react';
import Button from '@/components/button';
import Download from '../../../../assets/download';
import Topbar from '@/components/topbar';
import { getTicketByIdAction } from './actions';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import Ticket from './ticket';
import Spinner from '@/components/spinner';
import Menu from '@/components/menu';

const MyTicketPage = ({ params }: { params: { ticketId: string } }) => {
    const { data, isLoading } = useServerActionQuery(getTicketByIdAction, {
        input: { ticket_id: Number(params.ticketId) },
        queryKey: ['ticket', params.ticketId],
    });
    console.log(data);

    if (isLoading || !data) {
        return (
            <>
                <Topbar backHref="/my-tickets">Билет №{params.ticketId}</Topbar>
                <div className="p-5">
                    <div className="mt-3 flex flex-wrap justify-center gap-1 py-5">
                        <Spinner size="md" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar backHref="/my-tickets">Билет №{params.ticketId}</Topbar>
            <div className="p-5">
                <Ticket ticket={data} />
                <div className="mb-2 flex flex-row justify-between gap-3 rounded-lg border border-[#D1D1D1] bg-none p-5">
                    <p className="text-base font-normal text-[#4A4A4A]">
                        Гос. номер транспорта
                    </p>
                    <p className="text-base font-bold text-[#E74949]">
                        {data.direction.bus.state_number}
                    </p>
                </div>
                {data.passengers.map((passenger) => (
                    <div
                        key={passenger.passenger}
                        className="mb-2 flex flex-col justify-between gap-2 rounded-lg border border-[#D1D1D1] bg-none p-5"
                    >
                        <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                            Пассажир
                        </p>
                        <p className="text-base font-medium text-[#4A4A4A]">
                            {passenger.passenger}
                        </p>
                        <div className="flex flex-row justify-between gap-3">
                            <p className="text-base font-normal text-[#4A4A4A]">
                                Место
                            </p>
                            <p className="text-base font-bold text-[#E74949]">
                                {passenger.place_num}
                            </p>
                        </div>
                    </div>
                ))}
                <div className="mt-8 w-full rounded-[10px] bg-[#F9F9F9] px-4 pb-1 pt-6">
                    <div className="pb-[20px] text-[20px] font-bold leading-[22px]">
                        Действия
                    </div>
                    <div className="flex flex-col">
                        <Menu link="#" text="Скачать билет" />
                        <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                        <Menu link="#" text="Оформить возврат" />
                        <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                        <Menu link="#" text="Изменить данные пассажира" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyTicketPage;
