'use client';
import React from 'react';
import FullPageSelector from '@/components/fullpageselector';
import ArrowLeftIcon from '../../../../public/assets/arrow-left-icon';
import Button from '@/components/button';
import ArrowRightIcon from '../../../../public/assets/arrow-right-icon';
import Calendar from '../../../../public/assets/calendar';
import User from '../../../../public/assets/user';
import Image from 'next/image';
import { Drawer } from 'vaul';
import PassengerDrawer from './_components/passenger-drawer';
import SelectDeparture from './_components/select-departure';
import SelectArrival from './_components/select-arrival';
import Link from 'next/link';

const MainPage = () => {
    return (
        <Drawer.Root setBackgroundColorOnScale={false}>
            <div className="flex h-full flex-grow flex-col items-center justify-center bg-gradient-to-r from-[#E32828] to-[#E13535]">
                <div className="flex flex-col items-center justify-center text-center">
                    <Image
                        src={'/assets/main/Ellipse-1.png'}
                        width={622}
                        height={750.49}
                        alt={''}
                        className="pointer-events-none absolute h-screen w-screen"
                    />
                    <Image
                        src={'/assets/main/Ellipse-2.png'}
                        width={622}
                        height={750.49}
                        alt={''}
                        className="pointer-events-none absolute bottom-0 left-0"
                    />
                    <div className="mb-10 px-5 text-[36px] font-medium leading-[39.6px] tracking-[-3%] text-white">
                        Поиск дешевых билетов на автобусы между городами
                    </div>
                    <div className="flex w-screen flex-col gap-2 p-5">
                        <SelectDeparture />
                        <SelectArrival />
                        <FullPageSelector
                            icon={<Calendar color="white" />}
                            text={'Дата отправления'}
                        />
                        <Drawer.Trigger>
                            <FullPageSelector
                                icon={<User color="white" />}
                                text={'1 пассажир'}
                            />
                        </Drawer.Trigger>
                        <PassengerDrawer />
                        <Link href="/main/tickets">
                            <Button>Начать поиск</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Drawer.Root>
    );
};

export default MainPage;
