import React from 'react'
import Trip from '@/components/trip';
import Bus from '../../../../public/assets/bus';
import Button from '@/components/button';

const MyTicketsPage = () => {
    return (
        <div className='p-5'>
            <div className='font-semibold text-[42px] leading-[46.2px] tracking-[-3%]'>
                Мои билеты
            </div>
            <div className='flex flex-col '>
                <div className='pt-5 flex flex-col'>
                    <Trip status='paid'
                        town_one='Алматы'
                        town_two='Кокшетау'
                        departure='12:00'
                        arrive='16:40'
                        departure_date='8 мая'
                        tickets={112}
                        arriving_date={'9 мая'}
                        passenger_amount={1}
                        ticket_amount={12450} /> 
                    <Trip status='booked'
                        town_one='Алматы'
                        town_two='Кокшетау'
                        departure='12:00'
                        arrive='16:40'
                        departure_date='8 мая'
                        tickets={112}
                        arriving_date={'9 мая'}
                        passenger_amount={1}
                        ticket_amount={12450} /> 
                    <Trip status='expired'
                        town_one='Алматы'
                        town_two='Кокшетау'
                        departure='12:00'
                        arrive='16:40'
                        departure_date='8 мая'
                        tickets={112}
                        arriving_date={'9 мая'}
                        passenger_amount={1}
                        ticket_amount={12450} /> 
                </div>
                <div className='pt-5'>
                    <Button variant='ghost'>История покупки билетов</Button>
                </div>
            </div>
        </div>
    )
}

export default MyTicketsPage;