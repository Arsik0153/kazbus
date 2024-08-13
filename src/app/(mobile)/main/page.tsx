'use client';
import React, { Suspense } from 'react';
import Button from '@/components/button';
import SelectDeparture from './_components/select-departure';
import SelectArrival from './_components/select-arrival';
import SelectDate from './_components/select-date';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import SelectPassengerCount from './_components/select-passenger-count';
import EllipseMain from '@/assets/ellipse-main';

const MainPageSuspended = () => {
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
        <div className="flex h-full flex-grow flex-col items-center justify-center bg-gradient-to-r from-[#E32828] to-[#E13535]">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="pointer-events-none absolute right-0 top-0 z-0 flex h-screen w-screen justify-end">
                    <EllipseMain />
                </div>
                <div className="mb-2 text-balance px-5 text-[32px] font-bold leading-[39.6px] tracking-[-3%] text-white">
                    Поиск дешевых билетов на автобусы между городами
                </div>
                <div className="flex w-screen flex-col gap-2 p-5">
                    <SelectDeparture />
                    <SelectArrival />
                    <SelectDate />
                    <SelectPassengerCount />
                    <Button onClick={handleSearchClick} className="mt-1">
                        Начать поиск
                    </Button>
                </div>
            </div>
        </div>
    );
};

const MainPage = () => {
    return (
        <Suspense>
            <MainPageSuspended />
        </Suspense>
    );
};

export default MainPage;
