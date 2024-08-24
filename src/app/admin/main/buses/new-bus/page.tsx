'use client';
import React, { useState } from 'react';
import ComboBox from '../../trips/_components/inputCombo';
import MaskedInput from 'react-text-mask';
import InputMask from 'react-input-mask';
import YesOrNo from './_components/yesOrNo';
import Button from '@/components/button';
import Link from 'next/link';
import Floors from '@/app/admin/main/buses/new-bus/_components/floors';
import Scheme from '@/app/admin/main/buses/new-bus/_components/scheme';

const NewBus = () => {
    const [selectedFloor, setSelectedFloor] = useState<'first' | 'second' | 'third' | null>(null);
    const [seatCount, setSeatCount] = useState<string>(''); // Состояние для хранения количества мест

    return (
        <div className="flex flex-col mb-96 mt-6">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Добавить автобус</p>

            <div className="flex flex-col rounded-[20px] bg-white mt-[14px] py-10 px-8">
                <p className="text-2xl font-semibold text-[#4A4A4A]">Введите название автобуса</p>
                <div className="flex flex-col gap-4 items-start mt-4">
                    <ComboBox name="bus-name" placeholder='Введите название' />
                </div>
                <p className="text-2xl font-semibold text-[#4A4A4A] mt-9">Информация о ТС</p>
                <div className="flex flex-row gap-6 mt-7">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Марка</p>
                            <ComboBox name="brand" placeholder='Введите марку' />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">VIN</p>
                            <InputMask
                                mask={[/\d/, /\d/, /\d/, ' ', /[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, ' ', /\d/, /\d/]}
                                placeholder="XXX XXX XXX XXX XXX XX"
                                className='border text-base font-medium text-[#4A4A4A]  p-5 pt-[12px] pb-[12px] w-full focus:outline-none border-[#A0A0A0] rounded-[10px]'
                                maxLength={17} // Ограничение длины ввода
                                maskChar="_" // Используем символ подчеркивания

                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Модель</p>
                            <ComboBox name="model" placeholder='Введите модель' />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Количество посадочных мест</p>
                            <InputMask
                                mask="99"
                                placeholder='Количество мест'
                                onChange={(e) => setSeatCount(e.target.value)} // Обновление состояния при вводе
                                className='border text-base font-medium text-[#4A4A4A] p-5 pt-[12px] pb-[12px] w-full focus:outline-none border-[#A0A0A0] rounded-[10px]'
                            />
                        </div>

                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Гос.номер</p>
                            <MaskedInput
                                mask={[/\d/, /\d/, /\d/, ' ', /[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, ' ', /\d/, /\d/]}
                                placeholder="XXX AAA XX"
                                className='border text-base font-medium text-[#4A4A4A] p-5 pt-[12px] pb-[12px] w-full focus:outline-none border-[#A0A0A0] rounded-[10px]'
                                guide={false}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Выберите кол-во этажей на автобусе</p>
                            <Floors selected={selectedFloor} onSelect={setSelectedFloor} />
                        </div>
                    </div>
                </div>

                <p className="text-2xl font-semibold text-[#4A4A4A] mt-9">Свойства автобуса</p>
                <div className="flex flex-row gap-8 mt-7">
                    <div className="flex flex-col gap-3 mb-[42px]">
                        <p className="text-base font-medium text-[#4A4A4A] ">Есть ли Wi-Fi?</p>
                        <YesOrNo />
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-base font-medium text-[#4A4A4A] ">Есть ли био-туалет?</p>
                        <YesOrNo />
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-base font-medium text-[#4A4A4A] ">Автобус с лежачими местами?</p>
                        <YesOrNo />
                    </div>
                </div>
                <Scheme selectedFloor={selectedFloor} seatCount={Number(seatCount)} />

            </div>
        </div>
    );
};

export default NewBus;
