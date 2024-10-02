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
import Skeleton from '@/components/skeleton';

const MyTicketPage = ({ params }: { params: { ticketId: string } }) => {
    const { data, isLoading } = useServerActionQuery(getTicketByIdAction, {
        input: { ticket_id: Number(params.ticketId) },
        queryKey: ['ticket', params.ticketId],
    });
    console.log(data);

    if (isLoading || !data) {
        return <MyTicketPageSkeleton ticketId={params.ticketId} />;
    }

    return (
        <>
            <Topbar backHref="/my-tickets">Билет №{params.ticketId}</Topbar>
            <div className="fade-in p-5">
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

const MyTicketPageSkeleton = ({ ticketId }: { ticketId: string }) => {
    return (
        <>
            <Topbar backHref="/my-tickets">Билет №{ticketId}</Topbar>
            <div className="p-5">
                <Skeleton className="mb-2 mt-2 h-[174px] w-full rounded-lg" />{' '}
                {/* Ticket component placeholder */}
                <Skeleton className="mb-2 h-[60px] w-full rounded-lg" />{' '}
                {/* Bus number placeholder */}
                <Skeleton className="mb-2 h-[120px] w-full rounded-lg" />
                <div className="mt-8 w-full rounded-[10px] bg-[#F9F9F9] px-4 pb-1 pt-6">
                    <div className="pb-[20px] text-[20px] font-bold leading-[22px]">
                        Действия
                    </div>
                    <div className="flex flex-col">
                        <Skeleton className="mb-1 h-[50px] w-full rounded-lg" />
                        <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                        <Skeleton className="mb-1 h-[50px] w-full rounded-lg" />
                        <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                        <Skeleton className="mb-1 h-[50px] w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyTicketPage;
