import React from 'react'
import Image from 'next/image';
import Button from '@/components/button';
import Pulse from '@/components/admin/pulse';
import Download from '@/assets/admin/Download';
import Pie from '@/components/admin/pie-chart';
import Link from 'next/link';

const AdminMain = () => {
  return (
    <div className='flex flex-col gap-5'>

      {/* TODO: пофиксите картинку плез, автобус слишком большой, нужно поменбше */}
      <div className='flex flex-col py-14 px-9 rounded-[20px] overflow-hidden bg-no-repeat' style={{ backgroundImage: "url('/assets/admin/red-bus-card.png')" }}>
        <p className="text-4xl font-semibold text-white">Давайте начнем<br /> работу вместе с joool</p>
        <p className="text-base font-medium text-white mt-3">посмотрите краткий видеоролик, о том <br /> как пользоваться платформой</p>
        {/* TODO: Добавить ролик для пользователей */}
        <Button variant='primary' className='max-w-64 mt-6'>Посмотреть ролик</Button>
      </div>


      <div className="flex flex-row gap-5">
        <div className="flex flex-col bg-white rounded-[20px] p-[30px] border w-[44%]">
          <p className="text-base font-extrabold text-[#A0A0A0] uppercase">Следующий рейс</p>
          <div className="flex flex-row items-start gap-5 mt-[10px]">
            <p className="font-bold text-base text-[#E74949]">12:00</p>
            <div className="flex flex-col">
              <p className="text-base font-bold text-[#E74949]">Алматы/Сайран - Кызылорда/СК</p>
              <div className="text-sm font-semibold text-[##44A4A] flex flex-row items-center gap-1">
                <Pulse color="#21C01E" pulseRadius={5} />
                Рейс активен, идут продажи
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-2 mt-4">
            <div className="flex flex-row py-3 px-4 bg-[#F1F5F9] border gap-5 rounded-[10px] w-[53%] items-center relative">
              {/* <Pie/> */}
              {/* <div className="">75%</div>

              {/* TODO: тут нужен пирожок с процентами (pie)  */}
              <p className="text-sm font-medium text-start">Заполняемость автобуса</p>
            </div>
            <div className="flex flex-row py-[18px] px-[22px] gap-[18px] bg-[#E74949] rounded-[10px] w-[47%]">
              <p className="text-4xl  font-bold text-white">114</p>
              <p className="text-sm font-medium text-white">Билетов <br /> продано</p>
            </div>
          </div>
          {/* TODO: добавить файл для скачивания */}
          <a href="" className="mt-8 flex flex-row items-center text-[#E74949] text-base font-medium gap-4"> <Download color='#E74949' /> <span className=' underline'>Скачать список пассажиров</span> </a>
        </div>

        <div className="flex flex-col bg-[white] rounded-[20px] p-[30px] border w-[56%]">
          <p className="text-base font-extrabold text-[#A0A0A0] uppercase">Следующий рейс</p>
          <div className="flex flex-col gap-3 items-start mt-4">
            <div className="font-bold text-base text-[#E74949] flex flex-row">12:00 <span className='ml-11'>Алматы/Сайран - Кызылорда/СК</span> </div>
            <div className="font-bold text-base text-[#E74949] flex flex-row">13:40 <span className='ml-11'>Алматы - Бишкек</span> </div>
            <div className="font-bold text-base text-[#E74949] flex flex-row">14:00 <span className='ml-11'>Астана - Алматы</span> </div>
            <div className="font-bold text-base text-[#E74949] flex flex-row">15:30 <span className='ml-11'>Астана - Кокшетау</span> </div>
            <div className="font-bold text-base text-[#E74949] flex flex-row">16:00 <span className='ml-11'>Астана - Караганды</span> </div>
          </div>
          <Link href='/admin/main/trips' className="mt-8 flex flex-row items-center text-[#E74949] text-base font-medium gap-4 underline">
            Все рейсы
          </Link>
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-[20px] py-8 mb-32 px-[38px] border">
        <div className="flex flex-row justify-between pb-4">
          <p className="text-xl font-semibold">Доход за сегодня</p>
          <p className="text-xl font-bold text-[#E74949]">112.145.345₸</p>
        </div>
        <div className="w-full h-0 border"></div>
        <div className="flex flex-row justify-between py-4">
          <p className="text-xl font-semibold">Продано билетов</p>
          <p className="text-xl font-bold text-[#E74949]">124756</p>
        </div>
        <div className="w-full h-0 border"></div>
        <div className="flex flex-row justify-between pt-4">
          <p className="text-xl font-semibold">Самый продаваемый рейс</p>
          <p className="text-xl font-bold text-[#E74949]">Астана-Алматы</p>
        </div>
      </div>



    </div>
  )
}

export default AdminMain;
