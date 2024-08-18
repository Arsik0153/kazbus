import React from 'react';
import Trip from '@/components/trip';
import Button from '@/components/button';
import Link from 'next/link';
import Ticket from '@/components/ticket';

const MyTicketsPage = () => {
    return (
        <div className="h-full bg-[var(--gray)] px-5">
            <h1 className="pt-[75px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
                Мои билеты
            </h1>
            <div className="flex flex-col">
                <div className="flex flex-col pt-5">
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
                            taxi_park=''
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
                        taxi_park=''

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
                        taxi_park=''

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
