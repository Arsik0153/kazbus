'use client';
import React, { useState } from 'react';
import ComboBox from '../../trips/_components/inputCombo';
import MaskedInput from 'react-text-mask';
import InputMask from 'react-input-mask';
import YesOrNo from './_components/yesOrNo';
import Button from '@/components/button';
import Link from 'next/link';

const NewBus = () => {

    return (
        <div className="flex flex-col mt-6">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Добавить автобус</p>

            <div className="flex flex-col rounded-[20px] bg-white mt-[14px] py-10 px-8">
                <p className="text-2xl font-semibold text-[#4A4A4A]">Введите название автобуса</p>
                <div className="flex flex-col gap-4 items-start mt-4">
                    <ComboBox name="bus-name" />
                </div>
                <p className="text-2xl font-semibold text-[#4A4A4A] mt-9">Информация о ТС</p>
                <div className="flex flex-row gap-6 mt-7">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Марка</p>
                            <ComboBox name="brand" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">VIN</p>
                            <InputMask
                                mask="999 999 999 999 999 99"
                                placeholder="XXX XXX XXX XXX XXX XX"
                                className='border text-base font-medium text-[#4A4A4A] p-5 pt-[12px] pb-[12px] w-full focus:outline-none border-[#A0A0A0] rounded-[10px]'
                            />

                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Модель</p>
                            <ComboBox name="model" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Количество посадочных мест</p>
                            <input
                                type="text"
                                placeholder='Количество мест'
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
                <p className="text-2xl font-semibold text-[#4A4A4A]">Свойства автобуса</p>
                <div className="w-full h-60 bg-slate-500 my-5"></div>
                <Link href='/admin/main/buses' className='max-w-72'>
                    <Button variant='secondary' >Сохранить рейс</Button>
                </Link>
            </div>
        </div>
    );
};

export default NewBus;
