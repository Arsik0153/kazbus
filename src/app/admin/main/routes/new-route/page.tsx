'use client';
import React, { useState } from 'react';
import ComboBox from '../../trips/_components/inputCombo';
import PhasaB from './_components/phasaB';

const NewRoute = () => {
    const [routeSelected, setRouteSelected] = useState(false);
    const [driverSelected, setDriverSelected] = useState(false);

    const handleSelectionChange = (name: string, selected: any) => {
        if (name === 'route') {
            setRouteSelected(!!selected); // true если выбран маршрут, иначе false
        } else if (name === 'driver') {
            setDriverSelected(!!selected); // true если выбран водитель, иначе false
        }
    };

    const isPhasaBVisible = routeSelected && driverSelected;

    return (
        <div className="flex flex-col mt-6">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Маршруты</p>

            <div className="flex flex-col rounded-[20px] bg-white mt-[14px] py-10 px-8">
                <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите маршрут</p>
                <div className="flex flex-row gap-[18px] items-center mt-4">
                    <div className="flex flex-col gap-4 items-start">
                        <ComboBox name="route" onSelectionChange={handleSelectionChange} />
                    </div>
                    <p className="text-[#4A4A4A] text-2xl font-semibold">-</p>
                    <div className="flex flex-col gap-4 items-start">
                        <ComboBox name="driver" onSelectionChange={handleSelectionChange} />
                    </div>
                </div>

                {/* Render PhasaB only if both ComboBox selections are made */}
                {isPhasaBVisible && <PhasaB />}
            </div>
        </div>
    );
};

export default NewRoute;
