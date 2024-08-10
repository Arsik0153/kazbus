import React, { useState } from 'react';
import InputMini from '@/components/admin/inputMini';
import Ticket from '@/assets/admin/Ticket';
import Button from '@/components/button';
import Clock from '@/assets/admin/Clock';
import WeekButtons from '@/app/admin/main/trips/new-trip/_components/WeekButtons';
import Link from 'next/link';

const PhaseB = () => {
    const [isWeekly, setIsWeekly] = useState(false); // Состояние для определения типа рейса

    const handleButtonClick = (isWeekly: boolean) => {
        setIsWeekly(isWeekly);
    };

    return (
        <>
            {/* В - Бишкек старт */}
            <div className="p-[6px] flex flex-row w-full bg-[#EEF2F6] items-center gap-5 rounded-[5px]">
                <div className="w-8 h-8 rounded-full bg-[#E74949] flex items-center justify-center text-white text-lg">
                    В
                </div>
                <p className='text-base font-medium text-[#4A4A4A]'>Алматы</p>
                <div className="flex flex-row whitespace-nowrap ml-[20%] items-center gap-4">
                    <p className="text-base font-semibold text-[#4A4A4A] whitespace-nowrap">Цена билета от начальной точки</p>
                    <InputMini
                        id="AdminPassword"
                        placeholder='Цена'
                        className='max-w-40 bg-[#EEF2F6]'
                        iconLeft={<Ticket color="#000000" />}
                    />
                </div>
            </div>
            <div className="flex flex-row mt-14 gap-14">
                {/* Левая колона старт */}
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите время выезда</p>
                        <div className="flex flex-row items-center gap-3 mt-4">
                            <InputMini
                                id="AdminPassword"
                                placeholder=''
                                className='max-w-20'
                                iconLeft={<Clock color="#E74949" />}
                            />
                            <p className="text-base font-medium text-[#4A4A4A]">часов</p>
                            <InputMini
                                id="AdminPassword"
                                placeholder=''
                                className='max-w-20'
                                iconLeft={<Clock color="#E74949" />}
                            />
                            <p className="text-base font-medium text-[#4A4A4A]">Минут</p>
                        </div>
                    </div>
                    <div className="flex flex-col mt-8 gap-2">
                        <p className="text-2xl mt-1 font-semibold text-[#4A4A4A]">Выберите тип рейса</p>
                        <button
                            className={`w-full rounded-[10px] border text-base font-medium p-3 ${!isWeekly ? 'text-white bg-[#E74949]' : 'text-[#4A4A4A]'}`}
                            onClick={() => handleButtonClick(false)}
                        >
                            Рейс проводится каждый день
                        </button>
                        <button
                            className={`w-full rounded-[10px] border text-base font-medium p-3 ${isWeekly ? 'text-white bg-[#E74949]' : 'text-[#4A4A4A]'}`}
                            onClick={() => handleButtonClick(true)}
                        >
                            Рейс проводится несколько раз в неделю
                        </button>
                    </div>
                    <Link href="/admin/main/trips/start-trip">
                        <Button variant='secondary' className='mt-16'>Сохранить рейс</Button>
                    </Link>
                </div>
                {/* Правая колона старт */}
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Назначьте даты рейса</p>
                        <div className="flex flex-row items-center gap-3 mt-4">
                            <p className="text-base font-medium text-[#4A4A4A]">C</p>
                            <InputMini
                                id="AdminPassword"
                                placeholder=''
                                className='max-w-20'
                                iconLeft={<Clock color="#E74949" />}
                            />
                            <p className="text-base font-medium text-[#4A4A4A]">По</p>
                            <InputMini
                                id="AdminPassword"
                                placeholder=''
                                className='max-w-20'
                                iconLeft={<Clock color="#E74949" />}
                            />
                        </div>
                    </div>
                    {/* Условное отображение блока с выбором дней недели */}
                    {isWeekly && (
                        <div className="flex flex-col mt-8 gap-2">
                            <p className="text-2xl mt-1 font-semibold text-[#4A4A4A]">Выберите дни недели для выездов</p>
                            <div className="flex flex-wrap items-center justify-start max-w-2xl">
                                <WeekButtons />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PhaseB;
