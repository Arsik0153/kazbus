import React from 'react';
import Trip from '@/components/trip';

const HistoryTicketsPage = () => {
  return (
    <div className='p-5'>
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
    </div>
  )
}

export default HistoryTicketsPage;