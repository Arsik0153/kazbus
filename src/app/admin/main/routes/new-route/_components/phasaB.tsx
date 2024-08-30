'use client';
import React, { useState } from 'react';
import InputMini from '@/components/admin/inputMini';
import Clock from '@/assets/red-clock';
import Plus from '@/assets/plus';
import Button from '@/components/button';
import Parking from './parking';
import Link from 'next/link';

const PhasaB = () => {
    const [stops, setStops] = useState<number[]>([]);

    const addStop = () => {
        const newIndex = stops.length > 0 ? stops[stops.length - 1] + 1 : 0;
        setStops([...stops, newIndex]);
    };

    const removeStop = (index: number) => {
        setStops(stops.filter((stopIndex) => stopIndex !== index));
    };

    return (
        <>
            <div className="flex flex-col mt-7">
                <p className="text-2xl font-semibold text-[#4A4A4A]">Время в пути до конечной точки</p>
                <div className="flex flex-row items-center gap-3 mt-4">
                    <InputMini
                        id="tripHour"
                        placeholder=''
                        className='max-w-20'
                        iconLeft={<Clock color="#E74949" />}
                    />
                    <p className="text-base font-medium text-[#4A4A4A]">часов</p>
                    <InputMini
                        id="tripMinutes"
                        placeholder=''
                        className='max-w-20'
                        iconLeft={<Clock color="#E74949" />}
                    />
                    <p className="text-base font-medium text-[#4A4A4A]">Минут</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
                <p className="text-2xl font-semibold text-[#4A4A4A]">Остановки</p>
                <div className="flex flex-col bg-[#F1F5F9] rounded-[10px] p-3 gap-3 ">
                    <div className="flex flex-row bg-white items-center gap-[18px] p-[6px] rounded-[5px]">
                        <div className="w-8 h-8 rounded-full bg-[#E74949] flex items-center justify-center text-white text-lg">
                            A
                        </div>
                        <p className='text-base font-medium text-[#4A4A4A]'>Алматы</p>
                    </div>

                    <div className="p-4 border-l-2 border-[#525252] border-dashed ml-[21px]">
                        <div className="flex flex-col gap-2 ">
                            {stops.map((stopIndex) => (
                                <Parking key={stopIndex} index={stopIndex} onRemove={() => removeStop(stopIndex)} />
                            ))}

                            <div className="flex flex-row mt-6 gap-[14px]">
                                <button
                                    className="flex w-fit pr-16 px-3 py-3 flex-row rounded-[10px] gap-[10px] items-center bg-[#E74949] text-sm font-medium text-[#FBFBFB] transition-all duration-150 ease-in-out active:bg-[#c63b3b]"
                                    onClick={addStop}
                                >
                                    <Plus color="#ffffff" width={16} height={16} />
                                    Добавить маршрут
                                </button>
                                <button
                                    className="flex w-fit px-3 py-3 flex-row rounded-[10px] gap-[10px] items-center border border-[#A0A0A0] text-sm font-medium text-[#4A4A4A] transition-all duration-150 ease-in-out active:bg-[#E74949] active:text-white"
                                    onClick={() => setStops([])}
                                >
                                    Без остановок
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row bg-white items-center gap-[18px] p-[6px] rounded-[5px]">
                        <div className="w-8 h-8 rounded-full bg-[#E74949] flex items-center justify-center text-white text-lg">
                            В
                        </div>
                        <p className='text-base font-medium text-[#4A4A4A]'>Бишкек</p>
                    </div>
                </div>
            </div>
            <div className="max-w-72 mt-6">
                <Link href='/admin/main/routes'>
                    <Button variant='secondary'> Сохранить маршрут</Button>
                </Link>
            </div>
        </>
    );
}

export default PhasaB;
