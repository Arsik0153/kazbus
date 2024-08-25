'use client';
import React, { useState } from 'react';
import Divan from '@/assets/admin/Divan';
import SeatConfigurator from './seatConfigurator';
import Handlebar from '@/assets/admin/Handlebar';
import ChooseRow from '@/assets/admin/ChooseRow';
import ChooseCol from '@/assets/admin/ChooseCol';
import Cursor from '@/assets/admin/Cursor';

type SeatSchemeBuilderProps = {
    selectedFloor: 'first' | 'second' | 'third' | null;
    seatCount: number;
};

const SeatSchemeBuilder: React.FC<SeatSchemeBuilderProps> = ({ selectedFloor, seatCount }) => {
    const [selectedSeat, setSelectedSeat] = useState<string>('A');

    const options = [
        { label: 'Установка мест', value: '01' },
        { label: 'Установка места водителя', value: 'handlebar', icon: <Handlebar color='#A0A0A0' /> },
        { label: 'Установка прохода', value: '/' },
    ];

    return (
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

            </div>
        </>
    );
};

export default SeatSchemeBuilder;
