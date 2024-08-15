'use client';
import React, { useState } from 'react';
import ToiletPaper from '../assets/toilet-paper';
import HotelBed from '../assets/hotel-bed';
import Wifi from '../assets/wifi';
import BusMini from '../assets/bus-mini';

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

    if (status === 'none') {
        return (
            <div className="font-medium "></div>
        );
    }

    return null;
};

const Trip = ({
    status,
    town_one,
    town_two,
    tickets,
    departure,
    arrive,
    departure_date,
    arriving_date,
    passenger_amount,
    ticket_amount,
    taxi_park,
}: {
    status?: string;
    town_one: string;
    town_two: string;
    tickets: number;
    departure: string;
    arrive: string;
    departure_date: string;
    arriving_date: string;
    passenger_amount: number;
    ticket_amount: number;
    taxi_park: string;
}) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        setIsSelected(prevState => !prevState);
    };

    return (
        <div className="py-2">
            <div
                className={`flex w-full flex-col gap-3 rounded-[10px] border border-[#D1D1D1] p-5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#E23333] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#4A4A4A]'
                }`}
                onClick={handleClick}
            >
                <div className="flex flex-row items-start justify-between">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center gap-2">
                                    <BusMini color={isSelected ? "#FFFFFF" : "#E74949"} />
                                    <div className="text-[16px] font-semibold leading-[17.6px]">
                                        {town_one} - {town_two}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row gap-3 mt-[14px] text-[24px] font-bold leading-[26.4px]">
                                {ticket_amount} ₸
                                <div className="pt-1 text-xs font-normal leading-[15.4px]">
                                    {passenger_amount} пассажир
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
                                <div className="text-[14px] font-semibold leading-[15.4px]">
                                    Выезд
                                </div>
                                <div className="text-sm font-normal leading-[17.6px]">
                                    {departure_date}
                                </div>
                            </div>

                            <div className="text-[24px] font-medium leading-[30.8px]">
                                {departure}
                            </div>
                        </div>

                        <div className="flex flex-row gap-3">
                            <div className="flex flex-col">
                                <div className="text-[14px] font-semibold leading-[15.4px]">
                                    Прибытие
                                </div>
                                <div className="text-sm font-normal leading-[17.6px]">
                                    {arriving_date}
                                </div>
                            </div>

                            <div className="text-[24px] font-medium leading-[30.8px]">
                                {arrive}
                            </div>
                        </div>
                    </div>
                </div>

                <p className={`text-xs font-medium ${isSelected ? "text-[#FFFFFF] opacity-100" : "text-[#E23333] opacity-50"}`}>{taxi_park}</p>
            </div>
        </div>
    );
};

export default Trip;
