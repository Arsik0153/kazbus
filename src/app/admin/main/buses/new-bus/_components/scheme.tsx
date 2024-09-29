import React, { useState } from 'react';
import Button from '@/components/button';
import SeatConfigurator from './seatConfigurator';
import ChooseRow from '@/assets/admin/ChooseRow';
import ChooseCol from '@/assets/admin/ChooseCol';
import Cursor from '@/assets/admin/Cursor';
import { toast } from 'react-hot-toast';

type SchemeProps = {
    seatCount: number;
};

type CellContent = number | 'driver' | 'aisle' | null;

type SeatScheme = {
    seatId: number;
    seatCol: number;
    seatRow: number;
    seatType: 'driver' | 'passenger' | 'aisle';
};

const Scheme: React.FC<SchemeProps> = ({ seatCount }) => {
    const [editMode, setEditMode] = useState<'seats' | 'driver' | 'aisle'>(
        'seats'
    );
    const [floors, setFloors] = useState<CellContent[][][]>([
        Array(5)
            .fill(null)
            .map(() => Array(9).fill(null)),
    ]);

    const updateSeatNumbers = (newFloors: CellContent[][][]) => {
        let seatNumber = 1;
        const columnCount = newFloors[0][0].length;

        return newFloors.map((floor) => {
            const updatedFloor: CellContent[][] = [];
            for (let col = 0; col < columnCount; col++) {
                const updatedColumn: CellContent[] = [];
                for (let row = 0; row < floor.length; row++) {
                    const cell = floor[row][col];
                    if (typeof cell === 'number') {
                        updatedColumn.push(seatNumber++);
                    } else {
                        updatedColumn.push(cell);
                    }
                }
                updatedFloor.push(updatedColumn);
            }
            return updatedFloor[0].map((_, rowIndex) =>
                updatedFloor.map((col) => col[rowIndex])
            );
        });
    };

    const handleCellClick = (
        floorIndex: number,
        rowIndex: number,
        colIndex: number
    ) => {
        setFloors((prevFloors) => {
            const newFloors = prevFloors.map((floor) =>
                floor.map((row) => [...row])
            );
            const currentCell = newFloors[floorIndex][rowIndex][colIndex];

            if (currentCell !== null) {
                newFloors[floorIndex][rowIndex][colIndex] = null;
            } else {
                switch (editMode) {
                    case 'seats':
                        newFloors[floorIndex][rowIndex][colIndex] = 1;
                        break;
                    case 'driver':
                        newFloors[floorIndex][rowIndex][colIndex] = 'driver';
                        break;
                    case 'aisle':
                        newFloors[floorIndex][rowIndex][colIndex] = 'aisle';
                        break;
                }
            }

            return updateSeatNumbers(newFloors);
        });
    };

    const addRow = (floorIndex: number) => {
        setFloors((prevFloors) => {
            const newFloors = [...prevFloors];
            newFloors[floorIndex] = [
                ...newFloors[floorIndex],
                Array(newFloors[floorIndex][0].length).fill(null),
            ];
            return updateSeatNumbers(newFloors);
        });
    };

    const addColumn = (floorIndex: number) => {
        setFloors((prevFloors) => {
            const newFloors = [...prevFloors];
            newFloors[floorIndex] = newFloors[floorIndex].map((row) => [
                ...row,
                null,
            ]);
            return updateSeatNumbers(newFloors);
        });
    };

    const deleteRow = (floorIndex: number) => {
        if (floors[floorIndex].length > 1) {
            setFloors((prevFloors) => {
                const newFloors = [...prevFloors];
                newFloors[floorIndex] = newFloors[floorIndex].slice(0, -1);
                return updateSeatNumbers(newFloors);
            });
        }
    };

    const deleteColumn = (floorIndex: number) => {
        if (floors[floorIndex][0].length > 1) {
            setFloors((prevFloors) => {
                const newFloors = [...prevFloors];
                newFloors[floorIndex] = newFloors[floorIndex].map((row) =>
                    row.slice(0, -1)
                );
                return updateSeatNumbers(newFloors);
            });
        }
    };

    const clearScheme = (floorIndex: number) => {
        setFloors((prevFloors) => {
            const newFloors = [...prevFloors];
            newFloors[floorIndex] = Array(newFloors[floorIndex].length)
                .fill(null)
                .map(() => Array(newFloors[floorIndex][0].length).fill(null));
            return updateSeatNumbers(newFloors);
        });
    };

    const addFloor = () => {
        if (floors.length < 2) {
            setFloors((prevFloors) => [
                ...prevFloors,
                Array(5)
                    .fill(null)
                    .map(() => Array(9).fill(null)),
            ]);
        }
    };

    const handleSubmit = () => {
        const hasEmptyCells = floors.some((floor) =>
            floor.some((row) => row.some((cell) => cell === null))
        );

        if (hasEmptyCells) {
            toast.error(
                'Пожалуйста, заполните все ячейки схемы на всех этажах.'
            );
            return;
        }

        const scheme: SeatScheme[][] = floors.map((floor) => {
            const floorScheme: SeatScheme[] = [];
            let seatId = 1;

            for (let col = 0; col < floor[0].length; col++) {
                for (let row = 0; row < floor.length; row++) {
                    const cell = floor[row][col];
                    if (cell !== null) {
                        floorScheme.push({
                            seatId: seatId++,
                            seatCol: col + 1,
                            seatRow: row + 1,
                            seatType:
                                cell === 'driver'
                                    ? 'driver'
                                    : cell === 'aisle'
                                      ? 'aisle'
                                      : 'passenger',
                        });
                    }
                }
            }

            return floorScheme;
        });

        console.log(scheme);
        toast.success('Схема успешно сохранена!');
    };

    return (
        <div className="flex flex-col">
            <p className="mb-5 text-2xl font-semibold text-[#4A4A4A]">
                Задать схему автобуса
            </p>
            <SeatConfigurator selectedValue={editMode} onChange={setEditMode} />
            <div className="my-5 flex w-full flex-col gap-4 rounded-[10px] bg-[#F1F5F9] px-6 pb-4 pt-6">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center gap-9">
                        <p className="flex flex-row items-center gap-4 text-base font-medium text-[#4A4A4A]">
                            <ChooseCol color="#4A4A4A" />
                            Добавить ряд снизу
                        </p>
                        <p className="flex flex-row items-center gap-4 text-base font-medium text-[#4A4A4A]">
                            <ChooseRow color="#4A4A4A" />
                            Добавить ряд сбоку
                        </p>
                    </div>
                    <p className="flex flex-row items-center gap-4 text-base font-medium text-[#4A4A4A]">
                        <Cursor color="#E23333" />
                        Клик - изменить/очистить ячейку
                    </p>
                </div>

                {floors.map((floor, floorIndex) => (
                    <div key={floorIndex} className="mt-7">
                        <div className="mb-5 flex flex-row gap-3">
                            <h3 className="text-xl font-semibold">
                                Этаж {floorIndex + 1}
                            </h3>
                            <button
                                className="text-red-500"
                                onClick={() => clearScheme(floorIndex)}
                            >
                                Очистить схему этажа
                            </button>
                        </div>
                        <div className="">
                            <div
                                className="relative grid w-fit gap-2"
                                style={{
                                    gridTemplateColumns: `repeat(${floor[0].length}, 52px)`,
                                }}
                            >
                                {floor.map((row, rowIndex) =>
                                    row.map((cell, colIndex) => (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={`flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-[10px] border border-[#B8B8B8] ${
                                                cell === 'driver'
                                                    ? 'bg-blue-200'
                                                    : cell === 'aisle'
                                                      ? 'bg-gray-200'
                                                      : typeof cell === 'number'
                                                        ? 'bg-green-200'
                                                        : ''
                                            }`}
                                            onClick={() =>
                                                handleCellClick(
                                                    floorIndex,
                                                    rowIndex,
                                                    colIndex
                                                )
                                            }
                                        >
                                            {typeof cell === 'number'
                                                ? cell
                                                : cell === 'driver'
                                                  ? 'D'
                                                  : cell === 'aisle'
                                                    ? 'A'
                                                    : ''}
                                        </div>
                                    ))
                                )}

                                <div className="absolute -right-8 top-1/2 flex -translate-y-1/2 transform flex-col gap-2">
                                    <button
                                        onClick={() => addColumn(floorIndex)}
                                    >
                                        <ChooseRow color="#E23333" />
                                    </button>
                                    {floor[0].length > 9 && (
                                        <button
                                            onClick={() =>
                                                deleteColumn(floorIndex)
                                            }
                                        >
                                            -
                                        </button>
                                    )}
                                </div>
                                <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 transform gap-2">
                                    <button onClick={() => addRow(floorIndex)}>
                                        <ChooseCol color="#E23333" />
                                    </button>
                                    {floor.length > 5 && (
                                        <button
                                            onClick={() =>
                                                deleteRow(floorIndex)
                                            }
                                        >
                                            -
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {floors.length < 2 && (
                <Button variant="secondary" onClick={addFloor}>
                    Добавить этаж
                </Button>
            )}
            <div className="mt-4 max-w-72">
                <Button variant="secondary" onClick={handleSubmit}>
                    Сохранить рейс
                </Button>
            </div>
        </div>
    );
};

export default Scheme;
