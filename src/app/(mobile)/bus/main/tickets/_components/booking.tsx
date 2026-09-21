import React, { useState, useEffect } from 'react';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import Clock from '@/assets/red-clock';
import { Steps } from '../types';
import { Ticket as TicketT } from '@/data/types';
import Ticket from '@/components/ticket';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getUserAction } from '../actions';
import { User } from './select-passengers';

type Props = {
    expiresAt?: string;
    setStep: (step: Steps) => void;
    selectedTicket: TicketT | null;
    seats: number[];
    passengers: User[];
};

const Booking = (props: Props) => {
    const { setStep, selectedTicket, seats, passengers, expiresAt } = props;
    const { data: user, isPending: isUserPending } = useServerActionQuery(
        getUserAction,
        {
            input: undefined,
            queryKey: ['user'],
        }
    );

    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    useEffect(() => {
        if (!expiresAt) return;
        const expires = new Date(expiresAt).getTime();
        if (!Number.isFinite(expires)) return;
        const update = () =>
            setTimeLeft(Math.max(0, Math.ceil((expires - Date.now()) / 1000)));
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [expiresAt]);

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
                            {timeLeft === 0
                                ? 'Срок бронирования истёк'
                                : 'Ваш билет забронирован'}
                        </p>
                        <p className="text-sm font-normal text-[#4A4A4A]">
                            Бронь действует 15 минут с момента создания билета
                        </p>
                    </div>
                    <p className="text-4xl font-semibold text-[#E74949]">
                        {timeLeft === null ? '15 минут' : formatTime(timeLeft)}
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
                        <p className="text-xs font-bold text-[#A0A0A0] uppercase">
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
                    <Button
                        variant="ghost"
                        className="border border-[#D21F1F]"
                        disabled={timeLeft === 0}
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
