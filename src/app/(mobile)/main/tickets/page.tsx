import Topbar from '@/components/topbar';
import Trip from '@/components/trip';
import React from 'react';

const TicketsPage = () => {
    return (
        <>
            <Topbar backHref="/main">
                <div className="flex flex-col items-center">
                    Алматы - Кокшетау
                    <span className="text-sm font-light">
                        8 мая, 1 пассажир
                    </span>
                </div>
            </Topbar>
            <div className="my-5 px-4">
                <div className="flex flex-wrap gap-1">
                    <div className="w-fit rounded-full border border-[#E74949] px-5 py-[5px] text-sm font-semibold text-[#E74949]">
                        Самые дешевые
                    </div>
                    <div className="w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0]">
                        Быстрые
                    </div>
                    <div className="w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0]">
                        Лежачие
                    </div>
                </div>

                <div className="mt-3">
                    <Trip
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
            </div>
        </>
    );
};

export default TicketsPage;
