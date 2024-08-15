'use client';
import React, { useState } from 'react';
import Button from '@/components/button';
import Plus from '@/assets/admin/Plus';
import Edit from '@/assets/admin/Edit';
import Filter from '@/assets/admin/Filter';
import ComboBox from './_components/inputCombo';
import Table from './_components/table';
import Link from 'next/link';
import CalendarPC from '@/components/calendar/calendarPC';

const Trips = () => {
    const handleSelectionChange = (name: string, selected: any) => {
        console.log(`${name} selected:`, selected);
        // Добавьте здесь необходимую логику для обработки выбора
    };

    return (
        <div className="flex flex-col mt-6">
            <div className="flex flex-row justify-between">
                <p className="text-[42px] font-semibold text-[#4A4A4A]">Рейсы</p>
                <div className="flex flex-row gap-3">
                    <Link href="/admin/main/trips/new-trip" className="hover:bg-[#F16363] hover:text-white duration-150  flex py-[14px] px-12 flex-row rounded-[10px] gap-[10px] items-center justify-center bg-[#E32B2B] text-base font-semibold text-[#FBFBFB]">
                        <Plus color="#fff" width={20} height={20} />
                        Запустить рейс
                    </Link>
                    <Link href="" className="hover:border-[#F16363] duration-150  flex flex-row py-[14px] px-11 border rounded-[10px] gap-[10px] items-center justify-center bg-white text-base font-semibold text-[#E32B2B]">
                        <Edit color="#E32B2B" width={20} height={20} />
                        Редактировать несколько рейсов
                    </Link>
                </div>
            </div>

            <div className="flex flex-col p-6 mt-3 mb-20 rounded-[20px] bg-[#FFFFFF] border">
                <div className="flex flex-row rounded-[10px] border px-3 py-3 justify-between">
                    <div className="flex flex-row items-center gap-[5px] ml-2">
                        <Filter color="#E32B2B" width={20} height={20} />
                        <p className="text-base font-semibold text-[#E32B2B]">Фильтр</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <p className="text-base font-medium mr-3">C</p>
                        {/* <CalendarPC />
                        <p className="text-base font-medium ml-[14px] mr-3">По</p>
                        <CalendarPC/> */}
                        <div className="flex flex-row gap-2 ml-2 items-center">
                            <ComboBox
                                name="filterComboBox"
                                onSelectionChange={handleSelectionChange}
                                placeholder='Маршруты'
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
