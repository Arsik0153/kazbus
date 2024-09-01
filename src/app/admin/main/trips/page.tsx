'use client';
import React, { Suspense, useState } from 'react';
import Button from '@/components/button';
import Plus from '@/assets/admin/Plus';
import Edit from '@/assets/admin/Edit';
import Filter from '@/assets/admin/Filter';
import ComboBox from './_components/inputCombo';
import Table from './_components/table';
import Link from 'next/link';
import CalendarPC from '@/components/calendar/select-date';

// Пример опций для ComboBox
const options = [
    { id: 1, name: 'Маршрут 1' },
    { id: 2, name: 'Маршрут 2' },
    { id: 3, name: 'Маршрут 3' }
];

const Trips = () => {
    // Хук состояния для хранения выбранного элемента в ComboBox
    const [selectedOption, setSelectedOption] = useState<any>(null);

    const handleSelectionChange = (name: string, selected: any) => {
        console.log(`${name} selected:`, selected);
        setSelectedOption(selected);
    };

    const handleNewItem = (name: string) => {
        console.log(`Добавление нового элемента: ${name}`);
    };

    const handleBirthDateChange = () => {
        console.log('Дата изменена');
    };

    return (
        <div className="mt-6 flex flex-col">
            <div className="flex flex-row justify-between">
                <p className="text-[42px] font-semibold text-[#4A4A4A]">
                    Рейсы
                </p>
                <div className="flex flex-row gap-3">
                    <Link
                        href="/admin/main/trips/new-trip"
                        className="flex flex-row items-center justify-center gap-[10px] rounded-[10px] bg-[#E32B2B] px-12 py-[14px] text-base font-semibold text-[#FBFBFB] duration-150 hover:bg-[#F16363] hover:text-white"
                    >
                        <Plus color="#fff" width={20} height={20} />
                        Запустить рейс
                    </Link>
                    <Link
                        href=""
                        className="flex flex-row items-center justify-center gap-[10px] rounded-[10px] border bg-white px-11 py-[14px] text-base font-semibold text-[#E32B2B] duration-150 hover:border-[#F16363]"
                    >
                        <Edit color="#E32B2B" width={20} height={20} />
                        Редактировать несколько рейсов
                    </Link>
                </div>
            </div>

            <div className="mb-20 mt-3 flex flex-col rounded-[20px] border bg-[#FFFFFF] p-6">
                <div className="flex flex-row justify-between rounded-[10px] border px-3 py-3">
                    <div className="ml-2 flex flex-row items-center gap-[5px]">
                        <Filter color="#E32B2B" width={20} height={20} />
                        <p className="text-base font-semibold text-[#E32B2B]">
                            Фильтр
                        </p>
                    </div>
                    <div className="flex flex-row items-center">
                        <p className="mr-3 text-base font-medium">C</p>
                        <Suspense fallback={<div>Loading...</div>}>
                            <CalendarPC
                                value={null}
                                onChange={handleBirthDateChange}
                            />
                        </Suspense>
                        <p className="ml-[14px] mr-3 text-base font-medium">
                            По
                        </p>
                        <Suspense fallback={<div>Loading...</div>}>
                            <CalendarPC
                                value={null}
                                onChange={handleBirthDateChange}
                            />
                        </Suspense>
                        <div className="ml-2 flex flex-row items-center gap-2">
                            <ComboBox
                                name="filterComboBox"
                                options={options} // Передаем список опций
                                placeholder="Маршруты"
                                onOptionSelect={handleSelectionChange}
                                onNewItem={handleNewItem}
                            />
                            <Button variant="ultrared">Применить</Button>
                        </div>
                    </div>
                </div>

                <Table />
            </div>
        </div>
    );
};

export default Trips;
