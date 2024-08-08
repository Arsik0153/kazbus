'use client';
import React, { useState } from 'react';
import Button from '@/components/button';
import Plus from '@/assets/admin/Plus';
import Edit from '@/assets/admin/Edit';
import Filter from '@/assets/admin/Filter';
import ComboBox from '@/app/admin/main/trips/_components/inputCombo';
import InputMini from '@/components/admin/inputMini';
import Ticket from '@/assets/admin/Ticket';
import Clock from '@/assets/admin/Clock';


const Trips = () => {

    return (
        <div className="flex flex-col my-6 gap-4 ">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Добавить рейс</p>
            <div className="flex flex-col border bg-white rounded-[20px] px-8 py-10">
                <div className="flex flex-row gap-8 items-start">
                    <div className="flex flex-col gap-4 items-start">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите маршрут</p>
                        <ComboBox />
                    </div>
                    <div className="flex flex-col gap-4 items-start">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите водителя</p>
                        <ComboBox />
                    </div>
                </div>
                <div className="flex flex-col mt-6 gap-4 items-start">
                    <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите автобус</p>
                    <ComboBox />
                </div>


                <div className="p-[6px] flex flex-row w-full bg-[#EEF2F6] items-center gap-5 rounded-[5px] mt-11">
                    <div className="w-8 h-8 rounded-full bg-[#E74949] flex items-center justify-center text-white text-lg">
                        A
                    </div>
                    <p className='text-base font-medium text-[#4A4A4A]'>Алматы</p>
                </div>
                <div className="flex flex-col my-[22px] gap-[22px] max-w-72">
                    <p className="text-base font-medium text-[#4A4A4A] border border-[#A0A0A0] rounded-[10px] p-3">Каскелен</p>
                    <p className="text-base font-medium text-[#4A4A4A] border border-[#A0A0A0] rounded-[10px] p-3">Каскелен</p>
                    <p className="text-base font-medium text-[#4A4A4A] border border-[#A0A0A0] rounded-[10px] p-3">Каскелен</p>
                    <p className="text-base font-medium text-[#4A4A4A] border border-[#A0A0A0] rounded-[10px] p-3">Каскелен</p>
                </div>

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
                            className=' max-w-40 bg-[#EEF2F6]'
                            iconLeft={< Ticket color="#000000" />}
                        />
                    </div>
                </div>

                <div className="flex flex-row mt-14 gap-14">

                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите время выезда</p>
                            <div className="flex flex-row items-center gap-3 mt-4">
                                <InputMini
                                    id="AdminPassword"
                                    placeholder=''
                                    className=' max-w-20 '
                                    iconLeft={< Clock color="#E74949" />}
                                />
                                <p className="text-base font-medium text-[#4A4A4A]">часов</p>
                                <InputMini
                                    id="AdminPassword"
                                    placeholder=''
                                    className=' max-w-20 '
                                    iconLeft={< Clock color="#E74949" />}
                                />
                                <p className="text-base font-medium text-[#4A4A4A]">Минут</p>
                            </div>
                        </div>
                        <div className="flex flex-col mt-8 gap-2 ">
                            <p className="text-2xl mt-1 font-semibold text-[#4A4A4A]">Выберите время выезда</p>
                            <button className='w-full rounded-[10px] border text-base font-medium text-[#4A4A4A] p-3' >Рейс проводится каждый день</button>
                            <button className='w-full rounded-[10px] border text-base font-medium text-white p-3 bg-[#E74949]' >Рейс проводится несколько раз в неделю</button>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите время выезда</p>
                            <div className="flex flex-row items-center gap-3 mt-4">
                                <p className="text-base font-medium text-[#4A4A4A]">C</p>
                                <InputMini
                                    id="AdminPassword"
                                    placeholder=''
                                    className=' max-w-20 '
                                    iconLeft={< Clock color="#E74949" />}
                                />
                                <p className="text-base font-medium text-[#4A4A4A]">По</p>
                                <InputMini
                                    id="AdminPassword"
                                    placeholder=''
                                    className=' max-w-20 '
                                    iconLeft={< Clock color="#E74949" />}
                                />

                            </div>
                        </div>
                        <div className="flex flex-col mt-8 gap-2 ">
                            <p className="text-2xl mt-1 font-semibold text-[#4A4A4A]">Выберите время выезда</p>
                            <button className='w-full rounded-[10px] border text-base font-medium text-[#4A4A4A] p-3' >Рейс проводится каждый день</button>
                            <button className='w-full rounded-[10px] border text-base font-medium text-white p-3 bg-[#E74949]' >Рейс проводится несколько раз в неделю</button>
                        </div>
                    </div>

                </div>



            </div>
        </div>
    );
};

export default Trips;
