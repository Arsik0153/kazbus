import React from 'react';
import Trip from '@/components/trip';
import Topbar from '@/components/topbar';

const HistoryTicketsPage = () => {
    return (
        <>
            <Topbar backHref="/my-tickets">История покупки билетов</Topbar>
            <div className="bg-[#F8F8F8] p-5">
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
                />
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
                />
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
                />
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
                />
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
                />
            </div>
        </>
    );
};

export default HistoryTicketsPage;
