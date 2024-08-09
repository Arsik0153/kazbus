import React from 'react'
import Bus from '../assets/bus';
import RouteFill from '../assets/route-fill';
import ToiletPaper from '../assets/toilet-paper';
import HotelBed from '../assets/hotel-bed';
import Wifi from '../assets/wifi';
import BusMini from '../assets/bus-mini';
import Image from 'next/image';

const StatusBadge = ({ status }: { status?: string }) => {
    if (status === 'paid') {
        return <div className="bg-[#7CC71C] rounded-[30px] text-[#FFFFFF] text-[14px] leading-[15.4px] font-medium py-1 px-2">Оплачен</div>;
    }

    if (status === 'booked') {
        return <div className="bg-[#FF2D2D] rounded-[30px] text-[#FFFFFF] text-[14px] leading-[15.4px] font-medium py-1 px-2">Забронирован</div>;
    }

    if (status === 'expired') {
        return <div className="bg-[#AEAEAE] rounded-[30px] text-[#FFFFFF] text-[14px] leading-[15.4px] font-medium py-1 px-2">Просрочен</div>;
    }

    return null;
};

type Props = {
    town_one: string;
    town_two: string;
    tickets: number;
    departure: string;
    arrive: string;
    departure_date: string;
    arriving_date: string;
    passenger_amount: number;
    ticket_amount: number;
}

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
    ticket_amount

}: {
    status?: string,
    town_one: string,
    town_two: string,
    tickets: number,
    departure: string,
    arrive: string,
    departure_date: string,
    arriving_date: string,
    passenger_amount: number,
    ticket_amount: number
}) => {
    return (
        <div className='py-2'>
            <div className='border border-[#D1D1D1] rounded-[10px] w-full bg-[#FFFFFF] p-5 gap-5 flex flex-col'>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center justify-between'>
                                <div className='flex flex-row gap-2 items-center'>
                                    <BusMini color='#E74949' />
                                    <div className='font-semibold text-[16px] leading-[17.6px] text-[#4A4A4A]'>
                                        {town_one} - {town_two}
                                    </div>
                                </div>
                            </div>
                            <div className='font-semibold text-[14px] leading-[15.4px] text-[#C7C7C7] pt-1'>
                                Осталось {tickets} билетов
                            </div>
                        </div>
                    </div>
                    <div className='pb-4'>
                        <StatusBadge status={status} />
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center py-5'>
                    <div>
                        <Image
                            src={'/assets/tickets/qr.png'}
                            alt={''}
                            width={210}
                            height={210}
                        />
                    </div>
                    <div className='font-normal text-[16px] leading-[17.6px] pt-5'>Место - 06</div>
                </div>
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-5'>
                        <div className='flex flex-col gap-1'>
                            <div className='font-normal text-[14px] leading-[15.4px] text-[#4A4A4A]'>Отправление</div>
                            <div className='font-medium text-[28px] leading-[30.8px] text-[#4A4A4A]'>{departure}</div>
                            <div className='font-normal text-[16px] leading-[17.6px] text-[#C8C8C8]'>{departure_date}</div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='font-normal text-[14px] leading-[15.4px] text-[#4A4A4A]'>Прибытие</div>
                            <div className='font-medium text-[28px] leading-[30.8px] text-[#4A4A4A]'>{arrive}</div>
                            <div className='font-normal text-[16px] leading-[17.6px] text-[#C8C8C8]'>{arriving_date}</div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='gap-2 flex flex-row place-content-end'>
                            <ToiletPaper />
                            <HotelBed />
                            <Wifi />
                        </div>
                        <div className='text-right'>
                            <div className='font-normal text-[12px] leading-[13.2px] text-[#A0A0A0]'>{passenger_amount} пассажир</div>
                            <div className='font-medium text-[24px] leading-[26.4px] text-[#4A4A4A]'>{ticket_amount}₸</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trip;