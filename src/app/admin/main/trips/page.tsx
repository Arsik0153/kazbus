'use client';
import React, { useState } from 'react';
import Button from '@/components/button';
import Plus from '@/assets/admin/Plus';
import Edit from '@/assets/admin/Edit';
import Filter from '@/assets/admin/Filter';
import Pulse from '@/components/admin/pulse';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';

interface Person {
    id: number;
    name: string;
}

const people: Person[] = [
    { id: 1, name: 'Durward Reynolds' },
    { id: 2, name: 'Kenton Towne' },
    { id: 3, name: 'Therese Wunsch' },
    { id: 4, name: 'Benedict Kessler' },
    { id: 5, name: 'Katelyn Rohan' },
];

const Trips = () => {
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(people[0]);
    const [query, setQuery] = useState('');

    const filteredPeople = query === ''
        ? people
        : people.filter((person) => person.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="flex flex-col mt-6">
            <div className="flex flex-row justify-between">
                <p className="text-[42px] font-semibold text-[#4A4A4A]">Рейсы</p>
                <div className="flex flex-row gap-3">
                    <a href="" className="flex py-[14px] px-12 flex-row rounded-[10px] gap-[10px] items-center justify-center bg-[#E32B2B] text-base font-semibold text-[#FBFBFB]">
                        <Plus color="#fff" width={20} height={20} />
                        Запустить рейс
                    </a>
                    <a href="" className="flex flex-row py-[14px] px-11 border rounded-[10px] gap-[10px] items-center justify-center bg-white text-base font-semibold text-[#E32B2B]">
                        <Edit color="#E32B2B" width={20} height={20} />
                        Редактировать несколько рейсов
                    </a>
                </div>
            </div>

            <div className="flex flex-col p-6 mt-3 rounded-[20px] bg-[#FFFFFF] border">
                <div className="flex flex-row rounded-[10px] border px-3 py-2 justify-between">
                    <div className="flex flex-row items-center gap-[5px]">
                        <Filter color="#E32B2B" width={20} height={20} />
                        <p className="text-base font-semibold text-[#E32B2B]">Фильтр</p>
                    </div>
                    <div className="flex flex-row items-center">
                        {/* TODO: Компоненты календарей сюда */}
                        <p className="text-base font-medium mr-3">C</p>
                        <div className="border">Компоненту <br /> сюда</div>
                        <p className="text-base font-medium ml-[14px] mr-3">По</p>
                        <div className="border mr-2">Компоненту <br /> сюда</div>
                        {/* <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
                            <div className="relative">
                                <ComboboxInput
                                    aria-label="Assignee"
                                    className="px-[11px] py-[26px] bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    displayValue={(person: Person) => person?.name}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l3-3m0 0l3 3m-3-3v12" />
                                    </svg>
                                </Combobox.Button>
                            </div>
                            <ComboboxOptions className="border empty:invisible">
                                {filteredPeople.map((person) => (
                                    <ComboboxOption key={person.id} value={person} className="data-[focus]:bg-blue-100">
                                        {person.name}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox> */}
                        <Button variant="ultrared">Применить</Button>
                    </div>
                </div>

                <table className="w-full mt-6">
                    <tbody>
                        <tr className="w-full py-[10px]">
                            <th className="py-5 px-6 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                                Время
                            </th>
                            <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                                маршрут
                            </th>
                            <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                                проводится
                            </th>
                            <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                                Дни
                            </th>
                            <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                                остановка
                            </th>
                            <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                                статус
                            </th>
                        </tr>

                        <tr className="bg-[#F1F5F9] px-6">
                            <td className="px-6 rounded-l-[10px] text-base font-bold text-[#E74949]">
                                12:00
                            </td>
                            <td className="text-base font-bold text-[#E74949]">
                                Алматы/Сайран - Кызылорда/СК
                            </td>
                            <td className="text-base font-medium">
                                до 12.09.2024
                            </td>
                            <td className="text-base font-medium">
                                Пн, Вт, Ср, Чт, Пт, Сб
                            </td>
                            <td className="text-base font-medium">
                                3 остановки
                            </td>
                            <td className="rounded-r-[10px] py-4 flex flex-row items-start gap-2 text-base font-semibold text-[#4A4A4A]">
                                <div className="mt-[6px]"><Pulse color="#21C01E" pulseRadius={5} /></div>
                                Рейс активен, <br /> идут продажи
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Trips;
