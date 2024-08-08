'use client';
import React, { useState } from 'react';
import ComboBox from '@/app/admin/main/trips/_components/inputCombo';
import PhaseA from './_components/phaseA';
import PhaseB from './_components/phaseB';

const NewTrips = () => {
    const [selections, setSelections] = useState<Record<string, any | null>>({
        route: null,
        driver: null,
        bus: null,
    });

    const handleSelectionChange = (name: string, selected: any | null) => {
        setSelections((prevSelections) => ({
            ...prevSelections,
            [name]: selected,
        }));
    };

    // Проверяем, все ли значения выбраны
    const allSelected = Object.values(selections).every(value => value !== null);

    return (
        <div className="flex flex-col my-6 gap-4">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Добавить рейс</p>
            <div className="flex flex-col border bg-white rounded-[20px] px-8 py-10">
                {/* Комбобоксы старт */}
                <div className="flex flex-row gap-8 items-start">
                    <div className="flex flex-col gap-4 items-start">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите маршрут</p>
                        <ComboBox name="route" onSelectionChange={handleSelectionChange} />
                    </div>
                    <div className="flex flex-col gap-4 items-start">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите водителя</p>
                        <ComboBox name="driver" onSelectionChange={handleSelectionChange} />
                    </div>
                </div>
                <div className="flex flex-col mt-6 gap-4 items-start">
                    <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите автобус</p>
                    <ComboBox name="bus" onSelectionChange={handleSelectionChange} />
                </div>
                {/* Отображение PhaseA и PhaseB в зависимости от выбора */}
                {allSelected && <PhaseA />}
                {allSelected && <PhaseB />}
            </div>
        </div>
    );
};

export default NewTrips;
