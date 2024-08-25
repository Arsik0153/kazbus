'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/button';
import Divan from '@/assets/admin/Divan';
import SeatSchemeBuilder from './seatSchemeBuilder';
import SeatConfigurator from './seatConfigurator';
import Handlebar from '@/assets/admin/Handlebar';
import ChooseRow from '@/assets/admin/ChooseRow';
import ChooseCol from '@/assets/admin/ChooseCol';
import Cursor from '@/assets/admin/Cursor';

type SchemeProps = {
    selectedFloor: 1 | 2 | 3 | null;
    seatCount: number;
};

const Scheme: React.FC<SchemeProps> = ({ selectedFloor, seatCount }) => {
    const [selectedSeat, setSelectedSeat] = useState<string>('A');

    const options = [
        { label: 'Установка мест', value: '01' },
        { label: 'Установка места водителя', value: 'handlebar', icon: <Handlebar color='#A0A0A0' /> },
        { label: 'Установка прохода', value: '/' },
    ];

    return (
        <div className="flex flex-col">
            <p className="text-2xl mb-5 font-semibold text-[#4A4A4A]">Задать схему автобуса</p>
            {selectedFloor && seatCount ? (
                <>
                    <SeatConfigurator
                        options={options}
                        selectedValue={selectedSeat}
                        onChange={setSelectedSeat}
                    />
                    <div className="w-full flex flex-col gap-4 px-6 pt-6 pb-12 rounded-[10px] bg-[#F1F5F9] my-5">
                        <div className="flex flex-row justify-between mb-8">
                            <div className="flex flex-row items-center gap-9">
                                <p className="flex flex-row gap-4 items-center text-base font-medium text-[#4A4A4A]">
                                    <ChooseCol color='#4A4A4A' />
                                    Добавить ряд снизу
                                </p>
                                <p className="flex flex-row gap-4 items-center text-base font-medium text-[#4A4A4A]">
                                    <ChooseRow color='#4A4A4A' />
                                    Добавить ряд сбоку
                                </p>
                            </div>
                            <p className="flex flex-row gap-4 items-center text-base font-medium text-[#4A4A4A]">
                                <Cursor color='#E23333' />
                                Два клика - удалить
                            </p>
                        </div>
                        <SeatSchemeBuilder 
                            selectedFloor={selectedFloor} 
                            seatCount={seatCount} 
                            selectedSeat={selectedSeat} // Передаем selectedSeat
                        /> 
                    </div>
                </>
            ) : (
                <div className="flex w-3/4 flex-col gap-4 py-[60px] px-11 rounded-[10px] bg-[#F1F5F9] my-5">
                    <Divan color='#E23333' />
                    <p className="text-2xl font-semibold text-[#4A4A4A]">
                        Укажите количество посадочных мест для создания схемы
                    </p>
                </div>
            )}
            <Link href='/admin/main/buses' className='max-w-72'>
                <Button variant='secondary'>Сохранить рейс</Button>
            </Link>
        </div>
    );
};

export default Scheme;
