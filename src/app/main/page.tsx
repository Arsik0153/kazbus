import React from 'react'
import FullPageSelector from '@/components/fullpageselector';
import ArrowLeftIcon from '../../../public/assets/arrow-left-icon';
import Button from '@/components/button';
import NavBar from '@/components/nav-bar';
import ArrowRightIcon from '../../../public/assets/arrow-right-icon';
import Calendar from '../../../public/assets/calendar';
import User from '../../../public/assets/user';
import Image from 'next/image';

const MainPage = () => {
  return (
    <div className='bg-gradient-to-r from-[#E32828] to-[#E13535] flex justify-center items-center flex-col h-screen'>
      <div className='text-center flex items-center justify-center flex-col p-5'>
        <Image
          src={'/assets/main/Ellipse-1.png'}
          width={622}
          height={750.49}
          alt={''}
          className="absolute h-screen w-screen"
        />
        <Image
          src={'/assets/main/Ellipse-2.png'}
          width={622}
          height={750.49}
          alt={''}
          className="absolute bottom-0 left-0"
        />
        <div className='text-white text-[36px] font-medium tracking-[-3%] leading-[39.6px] mb-10 z-50'>
          Поиск дешевых билетов на автобусы между городами
        </div>
        <div className='flex flex-col gap-2 z-50'>
          <div>
            <FullPageSelector
              icon={<ArrowLeftIcon color="white" />}
              text={'Откуда вы направляетесь?'}
            />
          </div>
          <div>
            <FullPageSelector
              icon={<ArrowRightIcon color="white" />}
              text={'Куда вы направляетесь?'}
            />
          </div>
          <div>
            <FullPageSelector
              icon={<Calendar color="white" />}
              text={'Дата отправления'}
            />
          </div>
          <div>
            <FullPageSelector
              icon={<User color="white" />}
              text={'1 пассажир'}
            />
          </div>
          <div>
            <Button>Начать поиск</Button>
          </div>
        </div>
        <div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}

export default MainPage;