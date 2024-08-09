import React from 'react'
import Trip from '@/components/trip';
import Button from '@/components/button';
import Link from 'next/link';

const StartTrip = () => {
    return (
        <div className='flex flex-col my-6'>
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Запуск рейса</p>
            <div className="flex flex-wrap gap-5 mt-6 mb-11">
                <Trip
                    status="none"
                    town_one="Алматы"
                    town_two="Кокшетау"
                    departure="12:00"
                    arrive="16:40"
                    departure_date="8 мая"
                    tickets={112}
                    arriving_date={'9 мая'}
                    passenger_amount={5}
                    ticket_amount={12450}
                />
            </div>
            <div className="flex flex-row gap-2 items-center w-1/2">
                <Link href='/admin/main/trips'>
                    <Button variant='secondary'>Запустить рейс в продажу</Button>
                </Link>
                <Link href='/admin/main/trips'>
                    <Button variant='primary'>Просто сохранить рейс</Button>
                </Link>

            </div>
        </div>
    )
}

export default StartTrip;