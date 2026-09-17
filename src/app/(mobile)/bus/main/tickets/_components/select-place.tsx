import React, { useState } from 'react';
import { Steps } from '../types';
import BusLayout from './bus-layout';
import Topbar from '@/components/topbar';
import { useSearchParams } from 'next/navigation';
import { dayjsExt } from '@/lib/dayjs';
import { getStringByNumber } from '@/utils/helper.';
import Button from '@/components/button';
import { SeatSelection, Ticket } from '@/data/types';

type Props = {
    setStep: (step: Steps) => void;
    ticket: Ticket | null;
    serviceDate: string;
    seats: SeatSelection[];
    setSeats: (seats: SeatSelection[]) => void;
};

const SelectPlace = (props: Props) => {
    const { setStep, serviceDate, ticket, seats, setSeats } = props;

    const searchParams = useSearchParams();

    const dateParam = searchParams.get('date');
    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;
    const from = ticket?.from_point.name;
    const to = ticket?.to_point.name;

    const handleSeatsSelect = (seats: SeatSelection[]) => {
        setSeats(seats);
    };

    return (
        <>
            <Topbar onBack={() => setStep(Steps.SelectTicket)}>
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
            <div className="p-4">
                <h1 className="mb-5 text-[32px] font-medium text-[#4A4A4A]">
                    Выберите место
                </h1>
                <BusLayout
                    key={`${ticket?.id || 0}:${serviceDate}`}
                    trip_id={ticket?.id || 0}
                    serviceDate={serviceDate}
                    onSeatsSelect={handleSeatsSelect}
                />

                {seats.length === passengerCountParam && (
                    <div className="fixed right-0 bottom-32 left-0 px-4">
                        <Button
                            onClick={() => setStep(Steps.Passengers)}
                            variant="secondary"
                        >
                            Далее
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SelectPlace;
