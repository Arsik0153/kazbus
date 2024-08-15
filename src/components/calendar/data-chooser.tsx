'use client';
import { dayjsExt } from '@/lib/dayjs';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { Dayjs } from 'dayjs';
import React from 'react';
import { getDatesAction } from '@/app/(mobile)/main/actions';
import { AvailableDate } from '@/data/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import './scrollbar-hide.css'; 

const generateMonths = () => {
    const today = dayjsExt();
    return [today, today.add(1, 'month'), today.add(2, 'month')];
};

const renderDays = (
    month: Dayjs,
    handleDayClick: (day: Dayjs) => void,
    data: AvailableDate[]
) => {
    const today = dayjsExt();
    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');
    const startDayOfWeek = startOfMonth.day() === 0 ? 7 : startOfMonth.day();
    const days = [];

    for (let i = 1; i < startDayOfWeek; i++) {
        days.push(
            <div
                key={`empty-${i}`}
                className="flex h-14 items-center justify-center"
            ></div>
        );
    }

    for (
        let date = startOfMonth;
        date.isBefore(endOfMonth) || date.isSame(endOfMonth, 'day');
        date = date.add(1, 'day')
    ) {
        const isPast = date.isBefore(today, 'day');
        const price = getPriceForDate(date, data);
        days.push(
            <div
                key={date.format('YYYY-MM-DD')}
                className="flex h-14 items-start justify-center"
                onClick={() => handleDayClick(date)}
            >
                <div
                    className={`flex flex-col items-center ${isPast ? 'opacity-50' : ''}`}
                >
                    <div
                        className={`text-[22px] font-medium ${isPast ? 'opacity-50' : 'text-[var(--black)]'}`}
                    >
                        {date.date()}
                    </div>
                    <div className="text-xs text-[#E74949]">
                        {price !== null && `${price}`}
                    </div>
                </div>
            </div>
        );
    }

    return days;
};

const renderMonth = (
    month: Dayjs,
    handleDayClick: (day: Dayjs) => void,
    data: AvailableDate[]
) => (
    <div key={month.format('YYYY-MM')} className="mb-5">
        <div className="my-4 flex items-center justify-center text-2xl font-bold capitalize text-[#E74949]">
            {month.format('MMMM')}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
            {renderDays(month, handleDayClick, data)}
        </div>
    </div>
);

const getPriceForDate = (date: Dayjs, data: AvailableDate[]) => {
    const dateString = date.format('YYYY-MM-DD');
    const dateData = data?.find((item) => item.date === dateString);
    return dateData ? dateData.price : null;
};

type Props = {
    handleSelectDate: (date: string) => void;
};

const DatePicker = (props: Props) => {
    const { handleSelectDate } = props;
    const months = generateMonths();
    const { data } = useServerActionQuery(getDatesAction, {
        input: undefined,
        queryKey: ['getDates'],
    });
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleDayClick = (day: Dayjs) => {
        handleSelectDate(day.format('DD.MM.YYYY'));
    };

    return (
        <div className='absolute z-30 mt-[12px] w-[320px] h-[350px] bg-[var(--bg)] rounded-[10px] px-5 border overflow-y-scroll scrollbar-hide'>
            <div className="sticky top-0 grid w-full grid-cols-7 border-b border-[#dbdbdb] py-3 text-center text-base font-medium text-[var(--black)] bg-[var(--bg)] z-10">
                <div className='text-base font-medium'>Пн</div>
                <div className='text-base font-medium'>Вт</div>
                <div className='text-base font-medium'>Ср</div>
                <div className='text-base font-medium'>Чт</div>
                <div className='text-base font-medium'>Пт</div>
                <div className='text-base font-medium'>Сб</div>
                <div className='text-base font-medium'>Вс</div>
            </div>
            <div className="h-full">
                {months.map((month) =>
                    renderMonth(month, handleDayClick, data || [])
                )}
            </div>
        </div>
    );
};

export default DatePicker;
