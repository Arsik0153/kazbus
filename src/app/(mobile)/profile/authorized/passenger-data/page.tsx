import React from 'react'
import PassengerDataCard from '@/components/passenger-data-card';

const PassengerDataPage = () => {
  return (
    <div className='p-5'>
      <PassengerDataCard name='Иван Иванов Иванович' birth_date='12.12.2012' document_number='1234567890'/>
      <PassengerDataCard/>
      <PassengerDataCard/>
      <PassengerDataCard/>
    </div>
  )
}

export default PassengerDataPage;