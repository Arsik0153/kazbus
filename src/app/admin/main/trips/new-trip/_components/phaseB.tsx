import React, { Suspense, useState } from 'react';
import InputMini from '@/components/admin/inputMini';
import Ticket from '@/assets/admin/Ticket';
import Button from '@/components/button';
import Clock from '@/assets/admin/Clock';
import WeekButtons from '@/app/admin/main/trips/new-trip/_components/WeekButtons';
import Link from 'next/link';
import Calendar from '@/assets/calendar';
import CalendarPC from '@/components/calendar/select-date';

const PhaseB = () => {
    const [isWeekly, setIsWeekly] = useState(false); // Состояние для определения типа рейса

    const handleButtonClick = (isWeekly: boolean) => {
        setIsWeekly(isWeekly);
    };
    const handleBirthDateChange = () => {
        console.log('ewfw');
    };

    return (
        <>
            {/* В - Бишкек старт */}
            <div className="flex w-full flex-row items-center gap-5 rounded-[5px] bg-[#EEF2F6] p-[6px]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E74949] text-lg text-white">
                    В
                </div>
                <p className="text-base font-medium text-[#4A4A4A]">Алматы</p>
                <div className="ml-[20%] flex flex-row items-center gap-4 whitespace-nowrap">
                    <p className="whitespace-nowrap text-base font-semibold text-[#4A4A4A]">
                        Цена билета от начальной точки
                    </p>
                    <InputMini
                        id="AdminPassword"
                        placeholder="Цена"
                        className="max-w-40 bg-[#EEF2F6]"
                        iconLeft={<Ticket color="#000000" />}
                    />
                </div>
            </div>
            <div className="mt-14 flex flex-row gap-14">
                {/* Левая колона старт */}
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">
                            Выберите время выезда
                        </p>
                        <div className="mt-4 flex flex-row items-center gap-3">
                            <InputMini
                                id="AdminPassword"
                                placeholder="___"
                                className="max-w-20"
                                iconLeft={<Clock color="#E74949" />}
                            />
                            <p className="text-base font-medium text-[#4A4A4A]">
                                часов
                            </p>
                            <InputMini
                                id="AdminPassword"
                                placeholder="___"
                                className="max-w-20"
                                iconLeft={<Clock color="#E74949" />}
                            />
                            <p className="text-base font-medium text-[#4A4A4A]">
                                Минут
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col gap-2">
                        <p className="mt-1 text-2xl font-semibold text-[#4A4A4A]">
                            Выберите тип рейса
                        </p>
                        <button
                            className={`w-full rounded-[10px] border p-3 text-base font-medium ${!isWeekly ? 'bg-[#E74949] text-white' : 'text-[#4A4A4A]'}`}
                            onClick={() => handleButtonClick(false)}
                        >
                            Рейс проводится каждый день
                        </button>
                        <button
                            className={`w-full rounded-[10px] border p-3 text-base font-medium ${isWeekly ? 'bg-[#E74949] text-white' : 'text-[#4A4A4A]'}`}
                            onClick={() => handleButtonClick(true)}
                        >
                            Рейс проводится несколько раз в неделю
                        </button>
                    </div>
                    <Link href="/admin/main/trips/start-trip">
                        <Button variant="secondary" className="mt-16">
                            Сохранить рейс
                        </Button>
                    </Link>
                </div>
                {/* Правая колона старт */}
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">
                            Назначьте даты рейса
                        </p>
                        <div className="mt-4 flex flex-row items-center gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">
                                C
                            </p>
                            <Suspense>
                                <CalendarPC
                                    value={null}
                                    onChange={handleBirthDateChange}
                                />
                            </Suspense>

                            <p className="text-base font-medium text-[#4A4A4A]">
                                По
                            </p>
                            <Suspense>
                                <CalendarPC
                                    value={null}
                                    onChange={handleBirthDateChange}
                                />
                            </Suspense>
                        </div>
                    </div>
                    {/* Условное отображение блока с выбором дней недели */}
                    {isWeekly && (
                        <div className="mt-8 flex flex-col gap-2">
                            <p className="mt-1 text-2xl font-semibold text-[#4A4A4A]">
                                Выберите дни недели для выездов
                            </p>
                            <div className="flex max-w-2xl flex-wrap items-center justify-start">
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
