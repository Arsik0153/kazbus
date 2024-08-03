'use client';
import React, { useState } from 'react';
import Button from '@/components/button';
import Calendar from '../../../../public/assets/calendar';
import User from '../../../../public/assets/user';
import Image from 'next/image';
import { Drawer } from 'vaul';
import PassengerDrawer from './_components/passenger-drawer';
import SelectDeparture from './_components/select-departure';
import SelectArrival from './_components/select-arrival';
import Link from 'next/link';
import Input from '@/components/input';
import SelectDate from './_components/select-date';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStringByNumber } from '@/utils/helper.';
import toast from 'react-hot-toast';

const MainPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const dateParam = searchParams.get('date');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;

    const handleSearchClick = () => {
        if (!fromParam || !toParam || !dateParam || !passengerCountParam) {
            toast.error('Заполните все поля');
            return;
        }

        const updatedSearchParams = new URLSearchParams(searchParams);
        router.push('/main/tickets?' + updatedSearchParams.toString());
    };

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
                        <SelectDate />
                        <Drawer.Trigger>
                            <Input
                                label={`${passengerCountParam} ${getStringByNumber(
                                    passengerCountParam,
                                    ['пассажир', 'пассажира', 'пассажиров']
                                )}`}
                                id="passengers"
                                variant="ghost"
                                iconLeft={<User color="white" />}
                            />
                        </Drawer.Trigger>
                        <PassengerDrawer />
                        <Button onClick={handleSearchClick} className="mt-1">
                            Начать поиск
                        </Button>
                    </div>
                </div>
            </div>
        </Drawer.Root>
    );
};

export default MainPage;
