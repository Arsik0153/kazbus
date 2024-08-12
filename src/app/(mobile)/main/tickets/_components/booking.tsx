import React from 'react';
import Trip from '@/components/trip';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import Clock from '@/assets/red-clock';
import Kaspi from '@/assets/kaspi';
import { Steps } from '../page';
import { Ticket as TicketT } from '@/data/types';
import Ticket from '@/components/ticket';

type Props = {
    setStep: (step: Steps) => void;
    selectedTicket: TicketT | null;
    seats: number[];
};

const Booking = (props: Props) => {
    const { setStep, selectedTicket, seats } = props;

    if (!selectedTicket) {
        return null;
    }

    return (
        <>
            <Topbar onBack={() => setStep(Steps.Contacts)}>Оплата</Topbar>
            <div className="h-full gap-1 bg-[var(--gray)] px-5">
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
                        29:43
                    </p>
                </div>
                <Ticket ticket={selectedTicket} />
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
                        variant="secondary"
                        className="flex justify-start gap-5 bg-[#EF4836] pl-5"
                    >
                        <Kaspi /> Оплатить через Kaspi.kz
                    </Button>
                    <Button variant="ghost" className="border border-[#D21F1F]">
                        Оплатить банковской картой
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Booking;
