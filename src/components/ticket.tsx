'use client';
import React, { useState } from 'react';
import ToiletPaper from '@/assets//toilet-paper';
import HotelBed from '@/assets//hotel-bed';
import Wifi from '@/assets/wifi';
import BusMini from '@/assets/bus-mini';
import { type Ticket } from '@/data/types';
import { dayjsExt } from '@/lib/dayjs';

const StatusBadge = ({ status }: { status?: string }) => {
    if (status === 'paid') {
        return (
            <div className="rounded-[30px] bg-[#7CC71C] px-2 py-1 text-[14px] font-medium leading-[15.4px] text-[#FFFFFF]">
                Оплачен
            </div>
        );
    }

    if (status === 'booked') {
        return (
            <div className="rounded-[30px] bg-[#FF2D2D] px-2 py-1 text-[14px] font-medium leading-[15.4px] text-[#FFFFFF]">
                Забронирован
            </div>
        );
    }

    if (status === 'expired') {
        return (
            <div className="rounded-[30px] bg-[#AEAEAE] px-2 py-1 text-[14px] font-medium leading-[15.4px] text-[#FFFFFF]">
                Просрочен
            </div>
        );
    }

    return null;
};

type TicketProps = React.HTMLAttributes<HTMLDivElement> & {
    ticket: Ticket;
    selected?: boolean;
    status?: string;
};

const Ticket = ({ ticket, status, selected = false, ...rest }: TicketProps) => {
    const [isSelected, setIsSelected] = useState(selected);

    const handleClick = () => {
        setIsSelected(!isSelected);
        console.log(`Компонент был ${!isSelected ? 'выбран' : 'отменен'}:`, ticket);
    };

    const borderColor = isSelected ? 'border-[#E23333]' : 'border-[#D1D1D1]';
    const bgColor = isSelected ? 'bg-[#E23333]' : 'bg-[#FFFFFF]';
    const textColor = isSelected ? 'text-white' : 'text-[#4A4A4A]';

    return (
        <div className="py-2" onClick={handleClick} {...rest}>
            <div
                className={`flex w-full flex-col gap-3 rounded-[10px] border ${borderColor} ${bgColor} p-5 cursor-pointer`}
            >
                <div className="flex flex-row items-start justify-between">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center gap-2">
                                    <BusMini color={isSelected ? '#FFFFFF' : '#E74949'} />
                                    <div className={`text-[16px] font-semibold leading-[17.6px] ${textColor}`}>
                                        {ticket.from_point.name} - {ticket.to_point.name}
                                    </div>
                                </div>
                            </div>
                            <div className={`flex flex-row gap-3 mt-[14px] ${textColor} text-[24px] font-bold leading-[26.4px]`}>
                                {parseFloat(ticket.price).toFixed(0)} ₸
                                <div className="pt-1 text-xs font-normal leading-[15.4px]">
                                    {ticket.free_places_count} пассажир
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pb-4">
                        <StatusBadge status={status} />
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-5">
                        <div className="flex flex-row gap-3">
                            <div className="flex flex-col">
                                <div className={`text-[14px] font-semibold leading-[15.4px] ${textColor}`}>
                                    Выезд
                                </div>
                                <div className={`text-sm font-normal leading-[17.6px] ${textColor}`}>
                                    {dayjsExt(ticket.from_date).format('D MMMM')}
                                </div>
                            </div>
                            <div className={`text-[24px] font-medium leading-[30.8px] ${textColor}`}>
                                {ticket.from_time}
                            </div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="flex flex-col">
                                <div className={`text-[14px] font-semibold leading-[15.4px] ${textColor}`}>
                                    Прибытие
                                </div>
                                <div className={`text-sm font-normal leading-[17.6px] ${textColor}`}>
                                    {dayjsExt(ticket.to_date).format('D MMMM')}
                                </div>
                            </div>
                            <div className={`text-[24px] font-medium leading-[30.8px] ${textColor}`}>
                                {ticket.to_time}
                            </div>
                        </div>
                    </div>
                </div>
                <p className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-[#E23333]'} opacity-50`}>{ticket.taxi_park}</p>
            </div>
        </div>
    );
};

export default Ticket;
