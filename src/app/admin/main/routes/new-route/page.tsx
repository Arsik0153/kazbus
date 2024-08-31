'use client';
import React, { useState } from 'react';
import ComboBox from '../../trips/_components/inputCombo';
import PhasaB from './_components/phasaB';

const NewRoute = () => {
    // Состояния для каждого ComboBox
    const [startCity, setStartCity] = useState<{ id: number; name: string } | null>(null);
    const [endCity, setEndCity] = useState<{ id: number; name: string } | null>(null);

    const cities = [
        { id: 1, name: 'Алматы' },
        { id: 2, name: 'Нур-Султан' },
        { id: 3, name: 'Шымкент' },
    ];

    // Обработчик выбора опции
    const handleOptionSelect = (name: string, selectedItem: { id: number; name: string } | null) => {
        if (name === 'startCity') {
            setStartCity(selectedItem);
        } else if (name === 'endCity') {
            setEndCity(selectedItem);
        }
    };

    // Обработчик добавления нового элемента
    const handleNewItem = (newItem: string) => {
        console.log('Добавить новый элемент:', newItem);
    };

    // Определяем, виден ли PhasaB
    const isPhasaBVisible = startCity !== null && endCity !== null;

    return (
        <div className="flex flex-col mt-6">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Маршруты</p>

            <div className="flex flex-col rounded-[20px] bg-white mt-[14px] py-10 px-8">
                <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите маршрут</p>
                <div className="flex flex-row gap-[18px] items-center mt-4">
                    <div className="flex flex-col gap-4 items-start">
                        <ComboBox
                            name="startCity"
                            options={cities}
                            placeholder="Начальный город"
                            onOptionSelect={handleOptionSelect}
                            onNewItem={handleNewItem}
                            onSelectionChange={(name, selected) => handleOptionSelect(name, selected)}
                        />
                    </div>
                    <p className="text-[#4A4A4A] text-2xl font-semibold">-</p>
                    <div className="flex flex-col gap-4 items-start">
                        <ComboBox
                            name="endCity"
                            options={cities}
                            placeholder="Конечный город"
                            onOptionSelect={handleOptionSelect}
                            onNewItem={handleNewItem}
                            onSelectionChange={(name, selected) => handleOptionSelect(name, selected)}
                        />
                    </div>
                </div>

                {/* Render PhasaB only if both ComboBox selections are made */}
                {isPhasaBVisible && <PhasaB />}
            </div>
        </div>
    );
};

export default NewRoute;
