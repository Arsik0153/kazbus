'use client';
import React, { useState } from 'react';
import Handlebar from '@/assets/admin/Handlebar';

type SeatSchemeBuilderProps = {
    selectedFloor: 1 | 2 | 3 | null;
    seatCount: number;
    selectedSeat: string;
    columns: number;
    rows: number;
};

const SeatSchemeBuilder: React.FC<SeatSchemeBuilderProps> = ({ selectedFloor, seatCount, selectedSeat, columns, rows }) => {
    // Структура хранения мест для каждого этажа
    const [seats, setSeats] = useState({
        1: Array(rows * columns).fill(''),
        2: Array(rows * columns).fill(''),
        3: Array(rows * columns).fill(''),
    });

    const handleSeatClick = (index: number) => {
        if (selectedFloor === null) return; // Если этаж не выбран, выходим

        setSeats((prevSeats) => {
            const newSeats = { ...prevSeats };
            const floorSeats = [...newSeats[selectedFloor]];
            const seatValue = floorSeats[index];

            if (seatValue) {
                if (seatValue.match(/^\d+$/)) {
                    // Удаление номера пассажира и пересчет последующих номеров
                    const updatedSeats = floorSeats.map((seat, i) => {
                        if (i > index && seat.match(/^\d+$/)) {
                            return (parseInt(seat) - 1).toString().padStart(2, '0');
                        }
                        return seat;
                    });
                    updatedSeats[index] = ''; // Очистить место
                    newSeats[selectedFloor] = updatedSeats;
                    return newSeats;
                } else {
                    // Удаление любых других значений
                    floorSeats[index] = '';
                    newSeats[selectedFloor] = floorSeats;
                    return newSeats;
                }
            } else {
                // Если ячейка пустая, добавляем новое значение
                if (selectedSeat === '01') {
                    // Найти максимальный номер и добавить следующий
                    const maxSeatNumber = Math.max(
                        ...floorSeats.map((seat) => (seat.match(/^\d+$/) ? parseInt(seat) : 0))
                    );
                    floorSeats[index] = (maxSeatNumber + 1).toString().padStart(2, '0');
                } else if (selectedSeat === 'handlebar') {
                    floorSeats[index] = 'handlebar'; // Устанавливаем специальный идентификатор
                } else if (selectedSeat === '/') {
                    floorSeats[index] = '/'; // Устанавливаем специальный идентификатор
                }
                newSeats[selectedFloor] = floorSeats;
                return newSeats;
            }
        });
    };

    const clearAllSeats = () => {
        if (selectedFloor !== null) {
            setSeats((prevSeats) => ({
                ...prevSeats,
                [selectedFloor]: Array(rows * columns).fill(''),
            }));
        }
    };

    const renderGridCells = () => {
        if (selectedFloor === null) return null; // Если этаж не выбран, ничего не рендерим

        return Array(rows * columns)
            .fill('')
            .map((_, i) => {
                const seatValue = seats[selectedFloor][i];
                let content = null;
                let cellStyle = 'bg-none border-[#B8B8B8]';

                if (seatValue === 'handlebar') {
                    content = <Handlebar color='#A0A0A0' />;
                    cellStyle = 'border-[#B8B8B8]';
                } else if (seatValue === '/') {
                    content = '/';
                    cellStyle = 'border-[#B8B8B8] text-xl font-bold border flex justify-center items-center rounded-[10px] h-12 w-12'; // Например, другой фон
                } else if (seatValue) {
                    content = seatValue;
                    cellStyle = 'border-[#E32B2B] text-[#E32B2B]';
                }

                return (
                    <div
                        key={i}
                        className={`w-[52px] h-[52px] flex items-center justify-center text-center border rounded-[10px] text-base font-semibold ${cellStyle}`}
                        onClick={() => handleSeatClick(i)}
                    >
                        {content}
                    </div>
                );
            });
    };

    return (
        <div>
            <div className="flex flex-row items-center gap-3">
                <p>Выбранное действие: {selectedSeat}/</p>
                <p>Этаж: {selectedFloor}/</p>
                <p>Посадочных мест: {seatCount}</p>
                <button
                    onClick={clearAllSeats}
                    className="bg-red-500 text-white py-2 px-4 rounded mt-4"
                >
                    Стереть все
                </button>
            </div>

            <div
                className="grid w-fit gap-2 mt-4"
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                }}
            >
                {renderGridCells()}
            </div>
        </div>
    );
};

export default SeatSchemeBuilder;
