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
    const [columns, setColumns] = useState(Math.ceil(seatCount / 5) + 7); // Изначально столько колонок + 2 для свободного места
    const [rows, setRows] = useState(5); // Изначально 5 строк

    const options = [
        { label: 'Установка мест', value: '01' },
        { label: 'Установка места водителя', value: 'handlebar', icon: <Handlebar color='#A0A0A0' /> },
        { label: 'Установка прохода', value: '/' },
    ];

    const addRow = () => setRows((prevRows) => prevRows + 1);
    const removeRow = () => setRows((prevRows) => (prevRows > 1 ? prevRows - 1 : prevRows));
    const addColumn = () => setColumns((prevColumns) => prevColumns + 1);
    const removeColumn = () => setColumns((prevColumns) => (prevColumns > 1 ? prevColumns - 1 : prevColumns));

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
                            <div className="flex flex-row items-center gap-4">
                                <button onClick={addColumn} className="flex items-center gap-2">
                                    <ChooseRow color='#4A4A4A' />
                                    Добавить колонку сбоку
                                </button>
                                <button onClick={addRow} className="border-none bg-none flex items-center gap-2">
                                    <ChooseCol color='#4A4A4A' />
                                    Добавить ряд снизу
                                </button>
                                <button onClick={removeColumn} className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border border-[#E23333] flex items-center justify-center">
                                        <div className="w-[10px] h-[3px] bg-[#E23333] rounded-[4px]"></div>
                                    </div>
                                    Удалить колонку сбоку
                                </button>
                                <button onClick={removeRow} className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border border-[#E23333] flex items-center justify-center">
                                        <div className="w-[10px] h-[3px] bg-[#E23333] rounded-[4px]"></div>
                                    </div>
                                    Удалить ряд снизу
                                </button>
                            </div>
                            <p className="flex flex-row gap-4 items-center text-base font-medium text-[#4A4A4A]">
                                <Cursor color='#E23333' />
                                Два клика - удалить
                            </p>
                        </div>
                        <SeatSchemeBuilder
                            selectedFloor={selectedFloor}
                            seatCount={seatCount}
                            selectedSeat={selectedSeat}
                            columns={columns}
                            rows={rows}
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
