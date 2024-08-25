'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/button';
import Divan from '@/assets/admin/Divan';
import SeatConfigurator from './seatConfigurator';

interface SchemeProps {
    selectedFloor: 'first' | 'second' | 'third' | null;
    seatCount: number;
}


const Scheme: React.FC<SchemeProps> = ({ selectedFloor, seatCount }) => {
    return (
        <div className="flex flex-col w-3/4">
            <p className="text-2xl font-semibold text-[#4A4A4A]">Задать схему автобуса</p>
            {selectedFloor && seatCount ? (
                <>
                    <div className="flex flex-row mt-5 gap-3 items-start w-full">
                        <SeatConfigurator
                            label="Установка мест"
                            value="01"
                            // isActive={activeButton === '01'}
                            // onClick={() => handleButtonClick('01')}
                        />
                        <SeatConfigurator
                            label="Установка места водителя"
                            value="02"
                            // isActive={activeButton === '02'}
                            // onClick={() => handleButtonClick('02')}
                        />
                        <SeatConfigurator
                            label="Установка прохода"
                            value="03"
                            // isActive={activeButton === '03'}
                            // onClick={() => handleButtonClick('03')}
                        />
                    </div>


                    <div className="w-full flex flex-col gap-4 py-[60px] px-11 rounded-[10px] bg-[#F1F5F9] my-5">
                        <Divan color='#E23333' />
                        <p className="text-2xl font-semibold text-[#4A4A4A]">
                            Вы выбрали {selectedFloor}/null этаж и указали {seatCount}/number посадочных мест.
                        </p>
                    </div>
                </>

            ) : (
                <div className="w-full flex flex-col gap-4 py-[60px] px-11 rounded-[10px] bg-[#F1F5F9] my-5">
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
