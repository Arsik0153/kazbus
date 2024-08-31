'use client';
import React from 'react';
import Handlebar from '@/assets/admin/Handlebar';

type SeatSchemeBuilderProps = {
    selectedFloor: 1 | 2 | 3 | null; // Изменен тип на числа
    seatCount: number;
    selectedSeat: string; // Принимаем selectedSeat как пропс
};

const SeatSchemeBuilder: React.FC<SeatSchemeBuilderProps> = ({ selectedFloor, seatCount, selectedSeat }) => {
    
    return (
        <div>
            <p>Установить место: {selectedSeat}</p>
            <p>Этажей: {selectedFloor}</p>
            <p>Посадочных мест: {seatCount}</p>
            {/* Остальной код для построения схемы */}
        </div>
    );
};

export default SeatSchemeBuilder;
