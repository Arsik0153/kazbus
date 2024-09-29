import React, { useState } from 'react';
import BusMini from '@/assets/bus-mini';
import { TicketDetailed } from '@/data/types';
import { dayjsExt } from '@/lib/dayjs';
import { getStringByNumber } from '@/utils/helper.';

const StatusBadge = ({ status }: { status?: string }) => {
    if (status === 'Payed') {
        return (
            <div className="rounded-[30px] bg-[#7CC71C] px-2 py-1 text-[14px] font-medium leading-[15.4px] text-[#FFFFFF]">
                Оплачен
            </div>
        );
    }

    if (status === 'Booked') {
        return (
            <div className="rounded-[30px] bg-[#FF2D2D] px-2 py-1 text-[14px] font-medium leading-[15.4px] text-[#FFFFFF]">
                Забронирован
            </div>
        );
    }

    if (status === 'Expired') {
        return (
            <div className="rounded-[30px] bg-[#AEAEAE] px-2 py-1 text-[14px] font-medium leading-[15.4px] text-[#FFFFFF]">
                Просрочен
            </div>
        );
    }
    if (status === 'none') {
        return (
            <div className="rounded-[30px] bg-none px-2 py-1 text-[14px] font-medium leading-[15.4px] text-[#FFFFFF]"></div>
        );
    }

    return null;
};

type TicketProps = React.HTMLAttributes<HTMLDivElement> & {
    ticket: TicketDetailed;
    selected?: boolean;
    status?: string;
};

const Ticket = ({ ticket, selected = false, ...rest }: TicketProps) => {
    const borderColor = selected ? 'border-[#E23333]' : 'border-[#D1D1D1]';
    const bgColor = selected ? 'bg-[#E23333]' : 'bg-[#FFFFFF]';
    const textColor = selected ? 'text-white' : 'text-[#4A4A4A]';

    return (
        <div className="py-2" {...rest}>
            <div
                className={`flex w-full flex-col gap-3 rounded-[10px] border ${borderColor} ${bgColor} cursor-pointer p-5`}
            >
                <div className="flex flex-row items-start justify-between">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center gap-2">
                                    <BusMini
                                        color={selected ? '#FFFFFF' : '#E74949'}
                                    />
                                    <div
                                        className={`text-[16px] font-semibold leading-[17.6px] ${textColor}`}
                                    >
                                        {ticket.direction.from_city} -{' '}
                                        {ticket.direction.to_city}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`mt-[14px] flex items-end gap-3 ${textColor} text-[24px] font-bold leading-[26.4px]`}
                            >
                                {Number(
                                    parseFloat(
                                        ticket.direction.ticket_price
                                    ).toFixed(0)
                                ) * ticket.passengers.length}{' '}
                                ₸
                                <div className="pt-1 text-xs font-normal leading-[15.4px] text-[#4A4A4A] opacity-50">
                                    {ticket.passengers.length}{' '}
                                    {getStringByNumber(
                                        ticket.passengers.length,
                                        ['пассажир', 'пассажира', 'пассажиров']
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pb-4">
                        <StatusBadge status={ticket.status} />
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-row gap-3">
                            <div className="flex flex-col">
                                <div
                                    className={`text-[14px] font-semibold leading-[15.4px] ${textColor}`}
                                >
                                    Выезд
                                </div>
                                <div
                                    className={`text-sm font-normal leading-[17.6px] ${textColor} opacity-50`}
                                >
                                    {dayjsExt(
                                        ticket.direction.start_date
                                    ).format('D MMMM')}
                                </div>
                            </div>
                            <div
                                className={`text-[24px] font-medium leading-[30.8px] ${textColor}`}
                            >
                                {ticket.direction.departure_time.slice(0, 5)}
                            </div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="flex flex-col">
                                <div
                                    className={`text-[14px] font-semibold leading-[15.4px] ${textColor}`}
                                >
                                    Прибытие
                                </div>
                                <div
                                    className={`text-sm font-normal leading-[17.6px] ${textColor} opacity-50`}
                                >
                                    {dayjsExt(ticket.direction.end_date).format(
                                        'D MMMM'
                                    )}
                                </div>
                            </div>
                            <div
                                className={`text-[24px] font-medium leading-[30.8px] ${textColor}`}
                            >
                                {ticket.direction.departure_time.slice(0, 5)}
                            </div>
                        </div>
                    </div>
                </div>
                <p
                    className={`text-xs font-medium ${selected ? 'text-white' : 'text-[#E23333]'} opacity-50`}
                >
                    asdfasd
                </p>
            </div>
        </div>
    );
};

export default Ticket;
