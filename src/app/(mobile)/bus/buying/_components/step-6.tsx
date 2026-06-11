import React from 'react';
import Trip from '@/components/trip';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import Clock from '@/assets/red-clock';
import Kaspi from '@/assets/kaspi';
// Buying step 3 from figma

const StepFive = () => {
    return (
        <>
            {/* change route!!! IMPORTANT */}
            <Topbar backHref="/bus/directions">Оплата</Topbar>
            {/* change route!!! IMPORTANT */}

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
                    taxi_park="wdwedqw"
                />
                <div className="flex flex-row justify-between gap-3 rounded-lg border border-[#D1D1D1] bg-none p-5">
                    <p className="text-base font-normal text-[#4A4A4A]">
                        Место
                    </p>
                    <p className="text-base font-bold text-[#E74949]">06</p>
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

export default StepFive;
