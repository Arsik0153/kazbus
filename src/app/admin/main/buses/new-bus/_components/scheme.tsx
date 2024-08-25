'use client';
import React from 'react';
import Link from 'next/link';
import Button from '@/components/button';
import Divan from '@/assets/admin/Divan';
import SeatSchemeBuilder from './seatSchemeBuilder'; // Исправлено название

type SchemeProps = {
    selectedFloor: 'first' | 'second' | 'third' | null;
    seatCount: number;
};

const Scheme: React.FC<SchemeProps> = ({ selectedFloor, seatCount }) => {
    return (
        <div className="flex flex-col ">
            <p className="text-2xl mb-5 font-semibold text-[#4A4A4A]">Задать схему автобуса</p>
            {selectedFloor && seatCount ? (
                <SeatSchemeBuilder selectedFloor={selectedFloor} seatCount={seatCount} /> // Исправлено
            ) : (
                <div className=" flex w-3/4 flex-col gap-4 py-[60px] px-11 rounded-[10px] bg-[#F1F5F9] my-5">
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
