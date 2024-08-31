'use client';
import React, { useState } from 'react';
import ComboBox from '@/app/admin/main/trips/_components/inputCombo';
import PhaseA from './_components/phaseA';
import PhaseB from './_components/phaseB';

// Определяем типы для городов и значений выборки
interface City {
    id: number;
    name: string;
}

const NewTrips = () => {
    // Состояния для каждого ComboBox
    const [route, setRoute] = useState<{ id: number; name: string } | null>(null);
    const [driver, setDriver] = useState<{ id: number; name: string } | null>(null);
    const [bus, setBus] = useState<{ id: number; name: string } | null>(null);

    const cities = [
        { id: 1, name: 'Алматы' },
        { id: 2, name: 'Нур-Султан' },
        { id: 3, name: 'Шымкент' },
    ];

    const handleOptionSelect = (name: string, selectedItem: { id: number; name: string } | null) => {
        if (name === 'route') {
            setRoute(selectedItem);
        } else if (name === 'driver') {
            setDriver(selectedItem);
        } else if (name === 'bus') {
            setBus(selectedItem);
        }
    };

    const handleNewItem = (newItem: string) => {
        console.log('Добавить новый элемент:', newItem);
    };
    const isPhasaBVisible = route !== null && driver !== null && bus !== null;

    return (
        <div className="flex flex-col my-6 gap-4">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Добавить рейс</p>
            <div className="flex flex-col border bg-white rounded-[20px] px-8 py-10">
                <div className="flex flex-row gap-8 items-start">
                    <div className="flex flex-col gap-4 items-start">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите маршрут</p>

                        <ComboBox
                            name="route"
                            options={cities}
                            placeholder="Маршрут"
                            onOptionSelect={handleOptionSelect}
                            onNewItem={handleNewItem}
                            onSelectionChange={(name, selected) => handleOptionSelect(name, selected)}
                        />
                    </div>
                    <div className="flex flex-col gap-4 items-start">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите водителя</p>
                        <ComboBox
                            name="driver"
                            options={cities}
                            placeholder="Водители"
                            onOptionSelect={handleOptionSelect}
                            onNewItem={handleNewItem}
                            onSelectionChange={(name, selected) => handleOptionSelect(name, selected)}

                        />
                    </div>
                </div>
                <div className="flex flex-col mt-6 gap-4 items-start">
                    <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите автобус</p>
                    <ComboBox
                        name="bus"
                        options={cities}
                        placeholder="Автобусы"
                        onOptionSelect={handleOptionSelect}
                        onNewItem={handleNewItem}
                        onSelectionChange={(name, selected) => handleOptionSelect(name, selected)}

                    />
                </div>
                {/* Отображение PhaseA и PhaseB в зависимости от выбора */}
                {isPhasaBVisible && <PhaseA />}
                {isPhasaBVisible && <PhaseB />}
            </div>
        </div>
    );
};

export default NewTrips;
