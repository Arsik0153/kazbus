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
import { Steps } from './types';
import { useServerAction } from 'zsa-react';
import { createTicketAction } from './actions';
import toast from 'react-hot-toast';
import Payment from './_components/payment';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

const TicketFlow = () => {
    const queryClient = useQueryClient();
    const [step, setStep] = useState<Steps>(Steps.SelectTicket);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [serviceDate, setServiceDate] = useState('');
    const [seats, setSeats] = useState<number[]>([]);
    const [passengers, setPassengers] = useState<User[]>([]);
    const [contacts, setContacts] = useState<z.output<
        typeof contactsSchema
    > | null>(null);
    const [bookingTicketId, setBookingTicketId] = useState<number>(0);

    const { execute: createTicket, isPending: isTicketCreating } =
        useServerAction(createTicketAction, {
            onSuccess: (data) => {
                queryClient.invalidateQueries({
                    queryKey: ['tickets'],
                });
                queryClient.invalidateQueries({
                    queryKey: ['bus-seats'],
                });
                queryClient.invalidateQueries({
                    queryKey: ['my-tickets'],
                });
                queryClient.invalidateQueries({
                    queryKey: ['ticket', data.data.ticket_id],
                });
                setBookingTicketId(data.data.ticket_id);
                setStep(Steps.Booking);
            },
            onError: (data) => {
                toast.error(data.err.message);
            },
        });

    const handleTicketSelect = (
        ticket: Ticket,
        selectedServiceDate: string
    ) => {
        setSelectedTicket(ticket);
        setServiceDate(selectedServiceDate);
        setSeats([]);
        setPassengers([]);
        setContacts(null);
        setBookingTicketId(0);
        setStep(Steps.SelectPlace);
    };

    const handlePassengersSelect = (users: User[]) => {
        setPassengers(users);
        setStep(Steps.Contacts);
    };

    const handleContactsSubmit = async (
        data: z.output<typeof contactsSchema>
    ) => {
        if (!selectedTicket || !serviceDate) {
            toast.error('Не удалось определить дату рейса');
            return;
        }

        setContacts(data);

        await createTicket({
            direction: selectedTicket.id,
            service_date: serviceDate,
            tickets: passengers.map((passenger, i) => ({
                place_num: seats[i],
                place_floor: 1,
                passenger: passenger.user_id,
            })),
        });
    };

    return (
        <>
            {step === Steps.SelectTicket && (
                <SelectTicket onTicketSelect={handleTicketSelect} />
            )}
            {step === Steps.SelectPlace && (
                <SelectPlace
                    seats={seats}
                    setSeats={setSeats}
                    serviceDate={serviceDate}
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
                    isLoading={isTicketCreating}
                />
            )}
            {step === Steps.Booking && (
                <Booking
                    seats={seats}
                    setStep={setStep}
                    selectedTicket={selectedTicket}
                    passengers={passengers}
                />
            )}
            {step === Steps.Payment && (
                <Payment
                    ticketId={bookingTicketId}
                    onBack={() => setStep(Steps.Booking)}
                />
            )}
        </>
    );
};

const TicketPageSuspended = () => {
    const searchParams = useSearchParams();

    return <TicketFlow key={searchParams.toString()} />;
};

const TicketPage = () => (
    <Suspense>
        <TicketPageSuspended />
    </Suspense>
);

export default TicketPage;
