'use client';
import { Suspense, useState } from 'react';
import SelectTicket from './_components/select-ticket';
import SelectPlace from './_components/select-place';
import { Ticket } from '@/data/types';

export enum Steps {
    SelectTicket = 'SelectTicket',
    SelectPlace = 'SelectPlace',
}

const TicketPageSuspended = () => {
    const [step, setStep] = useState<Steps>(Steps.SelectTicket);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    console.log(selectedTicket);

    const handleTicketSelect = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setStep(Steps.SelectPlace);
    };

    return (
        <Suspense fallback={<div>Loading ...</div>}>
            {/* {step === Steps.SelectTicket && (
                <SelectTicket onTicketSelect={handleTicketSelect} />
            )} */}
            {step === Steps.SelectTicket && <SelectPlace setStep={setStep} />}
        </Suspense>
    );
};

export default TicketPageSuspended;
