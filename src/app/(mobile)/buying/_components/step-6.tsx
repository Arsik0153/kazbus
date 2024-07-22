import React from 'react';
import Trip from '@/components/trip';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import Clock from '../../../../../public/assets/red-clock';
import Kaspi from '../../../../../public/assets/kaspi';
// Buying step 3 from figma 

const StepFive = () => {
    return (
        <>

            {/* change route!!! IMPORTANT */}
            <Topbar backHref="/directions">Оплата</Topbar>
            {/* change route!!! IMPORTANT */}


            <div className="h-full bg-[var(--gray)] px-5 gap-1">
                <div className="flex flex-col gap-3 p-5 border border-[#D1D1D1] rounded-lg mt-4 bg-none">
                    <Clock color='#E74949' />
                    <div className="flex flex-col gap-1">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Ваш билет забронирован</p>
                        <p className="text-sm font-normal text-[#4A4A4A]">У вас есть 30 минут для оплаты билета</p>
                    </div>
                    <p className="font-semibold text-4xl text-[#E74949]">29:43</p>
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
                />
                <div className="flex flex-row justify-between gap-3 p-5 border border-[#D1D1D1] rounded-lg bg-none">
                    <p className="font-normal text-base text-[#4A4A4A]">Место</p>
                    <p className="font-bold text-base text-[#E74949]">06</p>
                </div>

                <div className="flex flex-col gap-2 mt-11">
                    <Button variant='secondary' className='flex pl-5 justify-start gap-5 bg-[#EF4836]'><Kaspi />  Оплатить через Kaspi.kz</Button>
                    <Button variant='ghost' className='border border-[#D21F1F]'>Оплатить банковской картой</Button>

                </div>
            </div>

        </>

    );
};

export default StepFive;
