import React from 'react';
import ToiletPaper from '../../public/assets/toilet-paper';
import HotelBed from '../../public/assets/hotel-bed';
import Wifi from '../../public/assets/wifi';
import BusMini from '../../public/assets/bus-mini';

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
}) => {
    return (
        <div className="py-2">
            <div className="flex w-full flex-col gap-5 rounded-[10px] border border-[#D1D1D1] bg-[#FFFFFF] p-5">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center gap-2">
                                    <BusMini color="#E74949" />
                                    <div className="text-[16px] font-semibold leading-[17.6px] text-[#4A4A4A]">
                                        {town_one} - {town_two}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-1 text-[14px] font-semibold leading-[15.4px] text-[#C7C7C7]">
                                Осталось {tickets} билетов
                            </div>
                        </div>
                    </div>
                    <div className="pb-4">
                        <StatusBadge status={status} />
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col gap-1">
                            <div className="text-[14px] font-normal leading-[15.4px] text-[#4A4A4A]">
                                Отправление
                            </div>
                            <div className="text-[28px] font-medium leading-[30.8px] text-[#4A4A4A]">
                                {departure}
                            </div>
                            <div className="text-[16px] font-normal leading-[17.6px] text-[#C8C8C8]">
                                {departure_date}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-[14px] font-normal leading-[15.4px] text-[#4A4A4A]">
                                Прибытие
                            </div>
                            <div className="text-[28px] font-medium leading-[30.8px] text-[#4A4A4A]">
                                {arrive}
                            </div>
                            <div className="text-[16px] font-normal leading-[17.6px] text-[#C8C8C8]">
                                {arriving_date}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row place-content-end gap-2">
                            <ToiletPaper />
                            <HotelBed />
                            <Wifi />
                        </div>
                        <div className="text-right">
                            <div className="text-[12px] font-normal leading-[13.2px] text-[#A0A0A0]">
                                {passenger_amount} пассажир
                            </div>
                            <div className="text-[24px] font-medium leading-[26.4px] text-[#4A4A4A]">
                                {ticket_amount}₸
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trip;
