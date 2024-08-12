'use client';
import { Suspense, useState } from 'react';
import SelectTicket from './_components/select-ticket';
import SelectPlace from './_components/select-place';
import { Ticket } from '@/data/types';
import SelectPassengers, { User } from './_components/select-passengers';
import Contacts from './_components/contacts';
import { z } from 'zod';
import { contactsSchema } from '@/data/schemas';
import Booking from './_components/booking';

export enum Steps {
    SelectTicket = 'SelectTicket',
    SelectPlace = 'SelectPlace',
    Passengers = 'Passengers',
    Contacts = 'Contacts',
    Booking = 'Booking',
}

const TicketPageSuspended = () => {
    const [step, setStep] = useState<Steps>(Steps.SelectTicket);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [seats, setSeats] = useState<number[]>([]);
    const [passengers, setPassengers] = useState<User[]>([]);
    const [contacts, setContacts] = useState<z.output<
        typeof contactsSchema
    > | null>(null);

    const handleTicketSelect = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setStep(Steps.SelectPlace);
    };

    const handlePassengersSelect = (users: User[]) => {
        setPassengers(users);
        setStep(Steps.Contacts);
    };

    const handleContactsSubmit = (data: z.output<typeof contactsSchema>) => {
        setContacts(data);
        setStep(Steps.Booking);
    };

    return (
        <Suspense>
            {step === Steps.SelectTicket && (
                <SelectTicket onTicketSelect={handleTicketSelect} />
            )}
            {step === Steps.SelectPlace && (
                <SelectPlace
                    seats={seats}
                    setSeats={setSeats}
                    ticket={selectedTicket}
                    setStep={setStep}
                />
            )}
            {step === Steps.Passengers && (
                <SelectPassengers
                    setStep={setStep}
                    onPassengersSelect={handlePassengersSelect}
                />
            )}
            {step === Steps.Contacts && (
                <Contacts
                    onContactsSubmit={handleContactsSubmit}
                    setStep={setStep}
                />
            )}
            {step === Steps.Booking && (
                <Booking
                    seats={seats}
                    setStep={setStep}
                    selectedTicket={selectedTicket}
                />
            )}
        </Suspense>
    );
};

export default TicketPageSuspended;
