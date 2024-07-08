import React from 'react';
import FullPageSelector from '@/components/fullpageselector';
import ArrowLeftIcon from '../../../../public/assets/arrow-left-icon';
import Button from '@/components/button';
import ArrowRightIcon from '../../../../public/assets/arrow-right-icon';
import Calendar from '../../../../public/assets/calendar';
import User from '../../../../public/assets/user';
import Image from 'next/image';

const MainPage = () => {
    return (
        <div className="flex h-full flex-grow flex-col items-center justify-center bg-gradient-to-r from-[#E32828] to-[#E13535]">
            <div className="flex flex-col items-center justify-center text-center">
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
                <div className="z-10 mb-10 px-5 text-[36px] font-medium leading-[39.6px] tracking-[-3%] text-white">
                    Поиск дешевых билетов на автобусы между городами
                </div>
                <div className="z-10 flex w-screen flex-col gap-2 p-5">
                    <FullPageSelector
                        icon={<ArrowLeftIcon color="white" />}
                        text={'Откуда вы направляетесь?'}
                    />
                    <FullPageSelector
                        icon={<ArrowRightIcon color="white" />}
                        text={'Куда вы направляетесь?'}
                    />
                    <FullPageSelector
                        icon={<Calendar color="white" />}
                        text={'Дата отправления'}
                    />
                    <FullPageSelector
                        icon={<User color="white" />}
                        text={'1 пассажир'}
                    />
                    <Button>Начать поиск</Button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
