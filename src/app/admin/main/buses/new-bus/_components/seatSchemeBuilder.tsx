'use client';
import React, { useState } from 'react';
import Handlebar from '@/assets/admin/Handlebar';
import ChooseRow from '@/assets/admin/ChooseRow';
import ChooseCol from '@/assets/admin/ChooseCol';

type SeatSchemeBuilderProps = {
    selectedFloor: 1 | 2 | 3 | null;
    seatCount: number;
    selectedSeat: string;
    columns: number;
    rows: number;
};

const SeatSchemeBuilder: React.FC<SeatSchemeBuilderProps> = ({ selectedFloor, seatCount, selectedSeat, columns: initialColumns, rows: initialRows }) => {
    const [columns, setColumns] = useState(initialColumns);
    const [rows, setRows] = useState(initialRows);

    // Структура хранения мест для каждого этажа
    const [seats, setSeats] = useState({
        1: Array(initialRows * initialColumns).fill(''),
        2: Array(initialRows * initialColumns).fill(''),
        3: Array(initialRows * initialColumns).fill(''),
    });

    // Функции добавления и удаления колонок
    const addColumn = () => {
        setColumns((prevColumns) => prevColumns + 1);
        if (selectedFloor !== null) {
            setSeats((prevSeats) => ({
                ...prevSeats,
                [selectedFloor]: [...prevSeats[selectedFloor], ...Array(rows).fill('')],
            }));
        }
    };

    const removeColumn = () => {
        if (columns > 1 && selectedFloor !== null) {
            setColumns((prevColumns) => prevColumns - 1);
            setSeats((prevSeats) => ({
                ...prevSeats,
                [selectedFloor]: prevSeats[selectedFloor].slice(0, rows * (columns - 1)),
            }));
        }
    };

    // Функции добавления и удаления строк
    const addRow = () => {
        setRows((prevRows) => prevRows + 1);
        if (selectedFloor !== null) {
            setSeats((prevSeats) => ({
                ...prevSeats,
                [selectedFloor]: [...prevSeats[selectedFloor], ...Array(columns).fill('')],
            }));
        }
    };

    const removeRow = () => {
        if (rows > 1 && selectedFloor !== null) {
            setRows((prevRows) => prevRows - 1);
            setSeats((prevSeats) => ({
                ...prevSeats,
                [selectedFloor]: prevSeats[selectedFloor].slice(0, (rows - 1) * columns),
            }));
        }
    };

    const handleSeatClick = (index: number) => {
        if (selectedFloor === null) return; // Если этаж не выбран, выходим

        setSeats((prevSeats) => {
            const newSeats = { ...prevSeats };
            const floorSeats = [...newSeats[selectedFloor as 1 | 2 | 3]]; // Убедитесь, что selectedFloor - это число
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
                } else if (selectedSeat === '///') {
                    floorSeats[index] = '///'; // Устанавливаем специальный идентификатор
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
                const seatValue = seats[selectedFloor as 1 | 2 | 3][i]; // Приводим selectedFloor к типу number
                let content = null;
                let cellStyle = 'bg-none border-[#B8B8B8]';

                if (seatValue === 'handlebar') {
                    content = <Handlebar color='#A0A0A0' />;
                    cellStyle = 'border-[#B8B8B8]';
                } else if (seatValue === '/') {
                    content = '/';
                    cellStyle = 'border-[#B8B8B8] text-xl text-[#A0A0A0] font-bold border flex justify-center items-center rounded-[10px] h-12 w-12';
                } else if (seatValue === '///') {
                    content = '///';
                    cellStyle = 'border-[#B8B8B8] text-xl text-[#A0A0A0] font-bold border flex justify-center items-center rounded-[10px] h-12 w-12';
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
            <div className="flex flex-col items-center mt-4 gap-6">
                <div className="flex flex-row items-center gap-3">

                    <div
                        className="grid w-fit gap-2"
                        style={{
                            gridTemplateColumns: `repeat(${columns}, 1fr)`,
                            gridTemplateRows: `repeat(${rows}, 1fr)`,
                        }}
                    >
                        {renderGridCells()}
                    </div>


                    <div className="flex flex-col items-center gap-3">
                        <button onClick={addColumn} className='w-9 h-9 rounded-full bg-[#E23333] flex items-center justify-center'>
                            <ChooseRow color='#FFFFFF' />
                        </button>
                        <button onClick={removeColumn} className="w-9 h-9 rounded-full border border-[#E23333] flex items-center justify-center">
                            <div className="w-[10px] h-[3px] bg-[#E23333] rounded-[4px]"></div>
                        </button>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-3">
                    <button onClick={addRow} className='w-9 h-9 rounded-full bg-[#E23333] flex items-center justify-center'>
                        <ChooseCol color='#FFFFFF' />
                    </button>
                    <button onClick={removeRow} className="w-9 h-9 rounded-full border border-[#E23333] flex items-center justify-center">
                        <div className="w-[10px] h-[3px] bg-[#E23333] rounded-[4px]"></div>
                    </button>
                </div>
            </div>
            <button onClick={clearAllSeats}>clear</button>
        </div>
    );
};

export default SeatSchemeBuilder;
