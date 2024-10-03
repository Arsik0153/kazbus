import React, { useState, useEffect } from 'react';
import Trip from '@/components/trip';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import Clock from '@/assets/red-clock';
import Kaspi from '@/assets/kaspi';
import { Steps } from '../types';
import { Ticket as TicketT } from '@/data/types';
import Ticket from '@/components/ticket';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getUserAction } from '../actions';
import { User } from './select-passengers';

type Props = {
    setStep: (step: Steps) => void;
    selectedTicket: TicketT | null;
    seats: number[];
    passengers: User[];
};

const Booking = (props: Props) => {
    const { setStep, selectedTicket, seats, passengers } = props;
    const { data: user, isPending: isUserPending } = useServerActionQuery(
        getUserAction,
        {
            input: undefined,
            queryKey: ['user'],
        }
    );

    // Set initial time for countdown (e.g., 30 minutes)
    const countdownTime = 30 * 60; // 30 minutes in seconds
    const [timeLeft, setTimeLeft] = useState(countdownTime);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    if (!selectedTicket) {
        return null;
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <>
            <Topbar>Оплата</Topbar>
            <div className="fade-in h-full gap-1 px-5">
                <div className="mt-4 flex flex-col gap-3 rounded-lg border border-[#D1D1D1] bg-none p-5">
                    <Clock color="#E74949" />
                    <div className="flex flex-col gap-1">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">
                            Ваш билет забронирован
                        </p>
                        <p className="text-sm font-normal text-[#4A4A4A]">
                            У вас есть 30 минут для оплаты билета
                        </p>
                    </div>
                    <p className="text-4xl font-semibold text-[#E74949]">
                        {formatTime(timeLeft)}
                    </p>
                </div>
                <Ticket
                    ticket={{
                        ...selectedTicket,
                        status: 'Booked',
                    }}
                />
                {passengers.map((passenger) => (
                    <div
                        key={passenger.user_id}
                        className="mb-2 flex flex-col justify-between gap-2 rounded-lg border border-[#D1D1D1] bg-none p-5"
                    >
                        <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                            Пассажир
                        </p>
                        <p className="text-base font-medium text-[#4A4A4A]">
                            {passenger?.full_name}
                        </p>
                        <p className="text-base font-medium text-[#4A4A4A]">
                            {passenger?.document_number_or_iin}
                        </p>
                    </div>
                ))}
                <div className="flex flex-row justify-between gap-3 rounded-lg border border-[#D1D1D1] bg-none p-5">
                    <p className="text-base font-normal text-[#4A4A4A]">
                        Место
                    </p>
                    <p className="text-base font-bold text-[#E74949]">
                        {seats.join(', ')}
                    </p>
                </div>

                <div className="mt-11 flex flex-col gap-2">
                    {/* <Button
                        variant="secondary"
                        className="flex justify-start gap-5 bg-[#EF4836] pl-5"
                    >
                        <Kaspi /> Оплатить через Kaspi.kz
                    </Button> */}
                    <Button
                        variant="ghost"
                        className="border border-[#D21F1F]"
                        onClick={() => setStep(Steps.Payment)}
                    >
                        Оплатить банковской картой
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Booking;
