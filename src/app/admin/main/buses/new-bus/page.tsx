'use client';
import React, { useState, useEffect } from 'react';
import ComboBox from '../../trips/_components/inputCombo';
import MaskedInput from 'react-text-mask';
import InputMask from 'react-input-mask';
import YesOrNo from './_components/yesOrNo';
import Button from '@/components/button';
import Link from 'next/link';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getBusesAction } from '../actions';
import Floors from '@/app/admin/main/buses/new-bus/_components/floors';
import Scheme from '@/app/admin/main/buses/new-bus/_components/scheme';
import Spinner from '@/components/spinner';

const NewBus = () => {
    const { data, isPending } = useServerActionQuery(getBusesAction, {
        input: undefined,
        queryKey: ['getBuses'],
    });
    const [buses, setBuses] = useState<any[]>([]);
    
    const [busNames, setBusNames] = useState<{ id: number; name: string }[]>([]);
    const [busBrands, setBusBrands] = useState<{ id: number; name: string }[]>([]);
    const [busModels, setBusModels] = useState<{ id: number; name: string }[]>([]);

    const [selectedCity, setSelectedCity] = useState<{ id: number; name: string } | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<{ id: number; name: string } | null>(null);
    const [selectedModel, setSelectedModel] = useState<{ id: number; name: string } | null>(null);
    const [seatCount, setSeatCount] = useState<number | string>(''); 
    const [selectedFloor, setSelectedFloor] = useState<1 | 2 | 3 | null>(null);

    useEffect(() => {
        if (data) {
            setBuses(data);

            // Формируем списки с использованием уникальных id из данных
            const uniqueNames = data.map(bus => ({ id: bus.id, name: bus.model_stamp }));
            const uniqueBrands = data.map((bus, idx) => ({ id: idx, name: bus.model_stamp.split(' ')[0] }));
            const uniqueModels = data.map((bus, idx) => ({ id: idx, name: bus.model_stamp.split(' ')[1] }));

            setBusNames(uniqueNames);
            setBusBrands(uniqueBrands);
            setBusModels(uniqueModels);
        }
    }, [data]);

    const handleOptionSelect = (name: string, selectedItem: { id: number; name: string } | null) => {
        switch (name) {
            case 'city':
                setSelectedCity(selectedItem);
                break;
            case 'brand':
                setSelectedBrand(selectedItem);
                break;
            case 'model':
                setSelectedModel(selectedItem);
                break;
            default:
                break;
        }
        console.log('Выбранный элемент:', selectedItem);
    };

    const handleNewItem = (name: string, newItem: string) => {
        switch (name) {
            case 'brand':
                setBusBrands([...busBrands, { id: busBrands.length + 1, name: newItem }]);
                break;
            case 'model':
                setBusModels([...busModels, { id: busModels.length + 1, name: newItem }]);
                break;
            case 'city':
                // Добавьте логику для нового города, если нужно
                break;
            default:
                break;
        }
        console.log('Добавить новый элемент:', newItem);
    };

    if (isPending) {
        return (
            <div className="flex justify-center py-11">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col mb-96 mt-6">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Добавить автобус</p>

            <div className="flex flex-col rounded-[20px] bg-white mt-[14px] py-10 px-8">
                <p className="text-2xl font-semibold text-[#4A4A4A]">Введите название автобуса</p>
                <div className="flex flex-col gap-4 items-start mt-4">
                    <ComboBox
                        name="city"
                        options={busNames}
                        placeholder="Введите название"
                        onOptionSelect={handleOptionSelect}
                        onNewItem={(newItem) => handleNewItem('city', newItem)}
                    />
                </div>
                <p className="text-2xl font-semibold text-[#4A4A4A] mt-9">Информация о ТС</p>
                <div className="flex flex-row gap-6 mt-7">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Марка</p>
                            <ComboBox
                                name="brand"
                                options={busBrands}
                                placeholder="Введите марку"
                                onOptionSelect={handleOptionSelect}
                                onNewItem={(newItem) => handleNewItem('brand', newItem)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">VIN</p>
                            <InputMask
                                mask={[/\d/, /\d/, /\d/, ' ', /[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, ' ', /\d/, /\d/]}
                                placeholder="XXX XXX XXX XXX XXX XX"
                                className='border text-base font-medium text-[#4A4A4A]  p-5 pt-[12px] pb-[12px] w-full focus:outline-none border-[#A0A0A0] rounded-[10px]'
                                maxLength={17}
                                maskChar="_"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Модель</p>
                            <ComboBox
                                name="model"
                                options={busModels}
                                placeholder="Введите модель"
                                onOptionSelect={handleOptionSelect}
                                onNewItem={(newItem) => handleNewItem('model', newItem)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-medium text-[#4A4A4A]">Количество посадочных мест</p>
                            <InputMask
                                mask="99"
                                placeholder='Количество мест'
                                onChange={(e) => setSeatCount(e.target.value)}
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
