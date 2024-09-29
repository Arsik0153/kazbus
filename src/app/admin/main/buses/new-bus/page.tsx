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
    const [selectedFloor, setSelectedFloor] = useState<1 | 2 | 3 | null>(null);
    const [seatCount, setSeatCount] = useState<number | string>(''); // Состояние для хранения количества мест

    return (
        <div className="mb-96 mt-6 flex flex-col">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">
                Добавить автобус
            </p>

            <div className="mt-[14px] flex flex-col rounded-[20px] bg-white px-8 py-10">
                <p className="text-2xl font-semibold text-[#4A4A4A]">
                    Введите название автобуса
                </p>
                <div className="mt-4 flex flex-col items-start gap-4">
                    <ComboBox name="bus-name" placeholder="Введите название" />
                </div>
                <p className="mt-9 text-2xl font-semibold text-[#4A4A4A]">
                    Информация о ТС
                </p>
                <div className="mt-7 flex flex-row gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">
                                Марка
                            </p>
                            <ComboBox
                                name="brand"
                                placeholder="Введите марку"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">
                                VIN
                            </p>
                            <InputMask
                                mask={[
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    ' ',
                                    /[A-Za-z]/,
                                    /[A-Za-z]/,
                                    /[A-Za-z]/,
                                    ' ',
                                    /\d/,
                                    /\d/,
                                ]}
                                placeholder="XXX XXX XXX XXX XXX XX"
                                className="w-full rounded-[10px] border border-[#A0A0A0] p-5 pb-[12px] pt-[12px] text-base font-medium text-[#4A4A4A] focus:outline-none"
                                maxLength={17} // Ограничение длины ввода
                                maskChar="_" // Используем символ подчеркивания
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">
                                Модель
                            </p>
                            <ComboBox
                                name="model"
                                placeholder="Введите модель"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">
                                Количество посадочных мест
                            </p>
                            <InputMask
                                mask="99"
                                placeholder="Количество мест"
                                onChange={(e) => setSeatCount(e.target.value)} // Обновление состояния при вводе
                                className="w-full rounded-[10px] border border-[#A0A0A0] p-5 pb-[12px] pt-[12px] text-base font-medium text-[#4A4A4A] focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">
                                Гос.номер
                            </p>
                            <MaskedInput
                                mask={[
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    ' ',
                                    /[A-Za-z]/,
                                    /[A-Za-z]/,
                                    /[A-Za-z]/,
                                    ' ',
                                    /\d/,
                                    /\d/,
                                ]}
                                placeholder="XXX AAA XX"
                                className="w-full rounded-[10px] border border-[#A0A0A0] p-5 pb-[12px] pt-[12px] text-base font-medium text-[#4A4A4A] focus:outline-none"
                                guide={false}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">
                                Выберите кол-во этажей на автобусе
                            </p>
                            <Floors
                                selected={selectedFloor}
                                onSelect={setSelectedFloor}
                            />
                        </div>
                    </div>
                </div>

                <p className="mt-9 text-2xl font-semibold text-[#4A4A4A]">
                    Свойства автобуса
                </p>
                <div className="mt-7 flex flex-row gap-8">
                    <div className="mb-[42px] flex flex-col gap-3">
                        <p className="text-base font-medium text-[#4A4A4A]">
                            Есть ли Wi-Fi?
                        </p>
                        <YesOrNo />
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-base font-medium text-[#4A4A4A]">
                            Есть ли био-туалет?
                        </p>
                        <YesOrNo />
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-base font-medium text-[#4A4A4A]">
                            Автобус с лежачими местами?
                        </p>
                        <YesOrNo />
                    </div>
                </div>
                <Scheme seatCount={Number(seatCount)} />
            </div>
        </div>
    );
};

export default NewBus;
