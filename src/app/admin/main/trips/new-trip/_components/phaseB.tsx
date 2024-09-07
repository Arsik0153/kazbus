import React, {Suspense, useState } from 'react';
import InputMini from '@/components/admin/inputMini';
import Ticket from '@/assets/admin/Ticket';
import Button from '@/components/button';
import Clock from '@/assets/admin/Clock';
import WeekButtons from '@/app/admin/main/trips/new-trip/_components/WeekButtons';
import Link from 'next/link';
import { Trips } from '@/data/types';
import CalendarPC from '@/components/calendar/select-date';
import dayjs from 'dayjs';
import { timeToReadable } from '@/utils/helper.';

interface PhaseBProps {
    selectedTrip: Trips;
    // onDateChange: (fromDate: string | null, toDate: string | null) => void;

}

const PhaseB: React.FC<PhaseBProps> = ({ selectedTrip }) => {
    const [RouteFrom, setRouteFrom] = useState<string | null>(null);
    const [Routeto, setRouteto] = useState<string | null>(null);
    // console.log("Прилетели данные с: ", { selectedTrip });
    const [isWeekly, setIsWeekly] = useState(false);

    const handleButtonClick = (isWeekly: boolean) => {
        setIsWeekly(isWeekly);
    };


    const handleRouteFromChange = (date: Date | null) => {
        const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
        setRouteFrom(formattedDate);
        // setValue('date_of_birth', formattedDate);
        console.log('Дата изменена');

    };

    const handleRouteToChange = (date: Date | null) => {
        const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
        setRouteto(formattedDate);
        // setValue('license_issue_date', formattedDate);
    };

    return (
        <>
            <div className="p-[6px] flex flex-row w-full bg-[#EEF2F6] items-center gap-5 rounded-[5px] mt-11">
                <div className="w-8 h-8 rounded-full bg-[#E74949] flex items-center justify-center text-white text-lg">
                    A
                </div>
                <p className="text-base font-medium text-[#4A4A4A]">{selectedTrip.from_city}</p>
            </div>

            <div className="flex flex-col my-[22px] gap-[22px] max-w-72">
                {selectedTrip.route.stops.map((stop) => (
                    <p
                        key={stop.id}
                        className="flex flex-row items-center justify-between text-base font-medium text-[#4A4A4A] border border-[#A0A0A0] rounded-[10px] p-3"
                    >
                        <p>{stop.name} </p>
                        {/* <p>{timeToReadable(stop.stop_time)} минут</p> */}
                        <p>{stop.stop_time} минут</p>
                    </p>
                ))}
            </div>

            <div className="flex w-full flex-row items-center gap-5 rounded-[5px] bg-[#EEF2F6] p-[6px]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E74949] text-lg text-white">
                    В
                </div>
                <p className="text-base font-medium text-[#4A4A4A]">{selectedTrip.to_city}</p>
                {/* <p className="text-base font-medium text-[#4A4A4A]">{selectedTrip.from_city}</p> */}

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
                            className={`w-full text-nowrap rounded-[10px] border p-3 text-base font-medium ${!isWeekly ? 'bg-[#E74949] text-white' : 'text-[#4A4A4A]'}`}
                            onClick={() => handleButtonClick(false)}
                        >
                            Рейс проводится каждый день
                        </button>
                        <button
                            className={`w-full text-nowrap rounded-[10px] border p-3 text-base font-medium ${isWeekly ? 'bg-[#E74949] text-white' : 'text-[#4A4A4A]'}`}
                            onClick={() => handleButtonClick(true)}
                        >
                            Рейс проводится несколько раз в неделю
                        </button>
                    </div>
                    {/* <Link href="/admin/main/trips/start-trip"> */}
                        <Button variant="secondary" className="mt-16">
                            Сохранить рейс
                        </Button>
                    {/* </Link> */}
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
                                    value={RouteFrom ? new Date(RouteFrom) : null}
                                    onChange={handleRouteFromChange}
                                />
                            </Suspense>

                            <p className="text-base font-medium text-[#4A4A4A]">
                                По
                            </p>
                            <Suspense>
                                <CalendarPC
                                    value={Routeto ? new Date(Routeto) : null}
                                    onChange={handleRouteToChange}
                                    
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
