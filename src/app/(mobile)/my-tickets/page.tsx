import React from 'react';
import Trip from '@/components/trip';
import Button from '@/components/button';
import Link from 'next/link';
import Ticket from '@/components/ticket';
import { Ticket as TicketType } from '@/data/types';

const ticket: Ticket = {
    id: 1,
    from_point: {
        id: 100,
        name: "City A",
    },
    from_bus_station: {
        id: 200,
        name: "Station A",
    },
    from_date: "2024-08-16T12:00:00Z",
    from_time: "12:00",
    to_point: {
        id: 101,
        name: "City B",
    },
    to_bus_station: {
        id: 201,
        name: "Station B",
    },
    to_date: "2024-08-16T14:00:00Z",
    to_time: "14:00",
    price: "1500",
    free_places_count: 10,
    bus: {
        have_toilet: true,
        have_wifi: true,
        is_recumbent: false,
    },
    taxi_park: "Таксопарк “ТОО ЖОЛЫМБЕТ ПЕРЕВОЗКИ”",
};

const MyTicketsPage = () => {
    return (
        <div className="h-full bg-[var(--gray)] px-5">
            <h1 className="pt-[75px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
                Мои билеты
            </h1>
            <div className="flex flex-col">
                <div className="flex flex-col pt-5">
                    <Ticket ticket={ticket} status="paid" />

                    <Link href="/my-tickets/qr-tickets">
                        <Trip
                            status="paid"
                            town_one="Алматы"
                            town_two="Кокшетау"
                            departure="12:00"
                            arrive="16:40"
                            departure_date="8 мая"
                            tickets={112}
                            arriving_date={'9 мая'}
                            passenger_amount={1}
                            ticket_amount={12450}
                            taxi_park='Таксопарк “ТОО ЖОЛЫМБЕТ ПЕРЕВОЗКИ”'
                        />
                    </Link>
                    <Trip
                        status="booked"
                        town_one="Алматы"
                        town_two="Кокшетау"
                        departure="12:00"
                        arrive="16:40"
                        departure_date="8 мая"
                        tickets={112}
                        arriving_date={'9 мая'}
                        passenger_amount={1}
                        ticket_amount={12450}
                        taxi_park='Таксопарк “ТОО ЖОЛЫМБЕТ ПЕРЕВОЗКИ”'

                    />
                    <Trip
                        status="expired"
                        town_one="Алматы"
                        town_two="Кокшетау"
                        departure="12:00"
                        arrive="16:40"
                        departure_date="8 мая"
                        tickets={112}
                        arriving_date={'9 мая'}
                        passenger_amount={1}
                        ticket_amount={12450}
                        taxi_park='Таксопарк “ТОО ЖОЛЫМБЕТ ПЕРЕВОЗКИ”'

                    />

                </div>

                <Link href="/my-tickets/history-tickets">
                    <Button variant="ghost" className="my-5">
                        История покупки билетов
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default MyTicketsPage;
