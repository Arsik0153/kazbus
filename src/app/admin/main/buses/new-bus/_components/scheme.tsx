'use client';

import React, { useEffect, useState } from 'react';

import ChooseCol from '@/assets/admin/ChooseCol';
import ChooseRow from '@/assets/admin/ChooseRow';
import Cursor from '@/assets/admin/Cursor';
import Handlebar from '@/assets/admin/Handlebar';
import { cn } from '@/utils/cn';
import SeatConfigurator from './seatConfigurator';

export type BusSeatDraft = {
    seat_id: number;
    seat_col: number;
    seat_row: number;
    seat_type: 'driver' | 'passenger' | 'aisle';
};

type SchemeProps = {
    floorCount: 1 | 2;
    initialSeats?: BusSeatDraft[];
    onChange: (seats: BusSeatDraft[]) => void;
    errorMessage?: string;
};

type CellContent = number | 'driver' | 'aisle' | null;

const renderCellContent = (cell: CellContent) => {
    if (typeof cell === 'number') {
        return String(cell).padStart(2, '0');
    }

    if (cell === 'driver') {
        return <Handlebar color="#A0A0A0" />;
    }

    if (cell === 'aisle') {
        return '/';
    }

    return '';
};

const getPassengerSeatCount = (floors: CellContent[][][]) =>
    floors.reduce(
        (floorTotal, floor) =>
            floorTotal +
            floor.reduce(
                (rowTotal, row) =>
                    rowTotal +
                    row.filter((cell) => typeof cell === 'number').length,
                0
            ),
        0
    );

const createEmptyFloor = () =>
    Array(5)
        .fill(null)
        .map(() => Array(9).fill(null)) as CellContent[][];

const createFloorFromSeats = (seats: BusSeatDraft[]) => {
    if (seats.length === 0) {
        return createEmptyFloor();
    }

    const rowCount = Math.max(5, ...seats.map((seat) => seat.seat_row));
    const columnCount = Math.max(9, ...seats.map((seat) => seat.seat_col));
    const floor = Array(rowCount)
        .fill(null)
        .map(() => Array(columnCount).fill(null)) as CellContent[][];

    seats.forEach((seat) => {
        floor[seat.seat_row - 1][seat.seat_col - 1] =
            seat.seat_type === 'passenger'
                ? seat.seat_id
                : seat.seat_type === 'driver'
                  ? 'driver'
                  : 'aisle';
    });

    return floor;
};

const toSeatDrafts = (floors: CellContent[][][]) => {
    const result: BusSeatDraft[] = [];

    floors.forEach((floor) => {
        for (let col = 0; col < floor[0].length; col += 1) {
            for (let row = 0; row < floor.length; row += 1) {
                const cell = floor[row][col];

                if (cell !== null) {
                    result.push({
                        seat_id: typeof cell === 'number' ? cell : 0,
                        seat_col: col + 1,
                        seat_row: row + 1,
                        seat_type:
                            cell === 'driver'
                                ? 'driver'
                                : cell === 'aisle'
                                  ? 'aisle'
                                  : 'passenger',
                    });
                }
            }
        }
    });

    return result;
};

const renumberPassengerSeats = (floors: CellContent[][][]) => {
    let seatNumber = 1;

    return floors.map((floor) => {
        const updatedFloor: CellContent[][] = [];
        const columnCount = floor[0]?.length ?? 0;

        for (let col = 0; col < columnCount; col += 1) {
            const updatedColumn: CellContent[] = [];

            for (let row = 0; row < floor.length; row += 1) {
                const cell = floor[row][col];

                if (typeof cell === 'number') {
                    updatedColumn.push(seatNumber);
                    seatNumber += 1;
                } else {
                    updatedColumn.push(cell);
                }
            }

            updatedFloor.push(updatedColumn);
        }

        return updatedFloor[0].map((_, rowIndex) =>
            updatedFloor.map((column) => column[rowIndex])
        );
    });
};

const Scheme = ({
    floorCount,
    initialSeats,
    onChange,
    errorMessage,
}: SchemeProps) => {
    const [editMode, setEditMode] = useState<'seats' | 'driver' | 'aisle'>(
        'seats'
    );
    const [floors, setFloors] = useState<CellContent[][][]>([
        initialSeats ? createFloorFromSeats(initialSeats) : createEmptyFloor(),
    ]);
    const passengerSeatCount = getPassengerSeatCount(floors);

    useEffect(() => {
        setFloors((currentFloors) => {
            if (floorCount === 1) {
                return currentFloors.slice(0, 1);
            }

            if (currentFloors.length === 1) {
                return [...currentFloors, createEmptyFloor()];
            }

            return currentFloors;
        });
    }, [floorCount]);

    useEffect(() => {
        onChange(toSeatDrafts(floors));
    }, [floors, onChange]);

    const updateFloors = (
        updater: (previousFloors: CellContent[][][]) => CellContent[][][]
    ) => {
        setFloors((previousFloors) =>
            renumberPassengerSeats(updater(previousFloors))
        );
    };

    const handleCellClick = (
        floorIndex: number,
        rowIndex: number,
        colIndex: number
    ) => {
        updateFloors((previousFloors) => {
            const nextFloors = previousFloors.map((floor) =>
                floor.map((row) => [...row])
            );
            const currentCell = nextFloors[floorIndex][rowIndex][colIndex];

            if (currentCell !== null) {
                nextFloors[floorIndex][rowIndex][colIndex] = null;
                return nextFloors;
            }

            nextFloors[floorIndex][rowIndex][colIndex] =
                editMode === 'driver'
                    ? 'driver'
                    : editMode === 'aisle'
                      ? 'aisle'
                      : 1;

            return nextFloors;
        });
    };

    const addRow = (floorIndex: number) => {
        updateFloors((previousFloors) => {
            const nextFloors = [...previousFloors];
            nextFloors[floorIndex] = [
                ...nextFloors[floorIndex],
                Array(nextFloors[floorIndex][0].length).fill(null),
            ];
            return nextFloors;
        });
    };

    const addColumn = (floorIndex: number) => {
        updateFloors((previousFloors) => {
            const nextFloors = [...previousFloors];
            nextFloors[floorIndex] = nextFloors[floorIndex].map((row) => [
                ...row,
                null,
            ]);
            return nextFloors;
        });
    };

    const deleteRow = (floorIndex: number) => {
        if (floors[floorIndex].length <= 1) {
            return;
        }

        updateFloors((previousFloors) => {
            const nextFloors = [...previousFloors];
            nextFloors[floorIndex] = nextFloors[floorIndex].slice(0, -1);
            return nextFloors;
        });
    };

    const deleteColumn = (floorIndex: number) => {
        if (floors[floorIndex][0].length <= 1) {
            return;
        }

        updateFloors((previousFloors) => {
            const nextFloors = [...previousFloors];
            nextFloors[floorIndex] = nextFloors[floorIndex].map((row) =>
                row.slice(0, -1)
            );
            return nextFloors;
        });
    };

    const clearScheme = (floorIndex: number) => {
        updateFloors((previousFloors) => {
            const nextFloors = [...previousFloors];
            nextFloors[floorIndex] = Array(nextFloors[floorIndex].length)
                .fill(null)
                .map(() => Array(nextFloors[floorIndex][0].length).fill(null));
            return nextFloors;
        });
    };

    return (
        <div className="flex flex-col">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-2xl font-semibold text-[#4A4A4A]">
                    Схема автобуса
                </p>
                <div className="rounded-full bg-[#FFF2F2] px-4 py-2 text-sm font-semibold text-[#E23333]">
                    Пассажирских мест: {passengerSeatCount}
                </div>
            </div>
            <p className="mb-5 max-w-3xl text-sm font-medium text-[#A0A0A0]">
                Кликните по ячейкам, чтобы добавить пассажирские места, место
                водителя или проход. Пустые ячейки не отправляются в backend.
                Количество пассажирских мест считается автоматически по схеме.
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
                            Добавить колонку справа
                        </p>
                    </div>
                    <p className="flex flex-row items-center gap-4 text-base font-medium text-[#4A4A4A]">
                        <Cursor color="#E23333" />
                        Клик по ячейке: добавить или очистить
                    </p>
                </div>

                {floors.map((floor, floorIndex) => (
                    <div key={floorIndex} className="mt-7">
                        <div className="mb-5 flex flex-row gap-3">
                            <h3 className="text-xl font-semibold text-[#4A4A4A]">
                                Этаж {floorIndex + 1}
                            </h3>
                            <button
                                type="button"
                                className="text-sm font-semibold text-[#E23333]"
                                onClick={() => clearScheme(floorIndex)}
                            >
                                Очистить этаж
                            </button>
                        </div>
                        <div
                            className="relative grid w-fit gap-2"
                            style={{
                                gridTemplateColumns: `repeat(${floor[0].length}, 52px)`,
                            }}
                        >
                            {floor.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <button
                                        key={`${floorIndex}-${rowIndex}-${colIndex}`}
                                        type="button"
                                        className={cn(
                                            'flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border bg-white text-xl font-bold',
                                            {
                                                'border-[#E23333] text-[#E23333]':
                                                    typeof cell === 'number',
                                                'border-[#C5B7FF] text-[#C5B7FF]':
                                                    cell === 'aisle',
                                                'border-[#B8B8B8] text-[#A0A0A0]':
                                                    cell === 'driver',
                                                'border-[#B8B8B8] text-[#4A4A4A]':
                                                    cell === null,
                                            }
                                        )}
                                        onClick={() =>
                                            handleCellClick(
                                                floorIndex,
                                                rowIndex,
                                                colIndex
                                            )
                                        }
                                    >
                                        {renderCellContent(cell)}
                                    </button>
                                ))
                            )}

                            <div className="absolute -right-8 top-1/2 flex -translate-y-1/2 transform flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => addColumn(floorIndex)}
                                >
                                    <ChooseRow color="#E23333" />
                                </button>
                                {floor[0].length > 1 ? (
                                    <button
                                        type="button"
                                        className="text-lg font-bold text-[#E23333]"
                                        onClick={() => deleteColumn(floorIndex)}
                                    >
                                        -
                                    </button>
                                ) : null}
                            </div>
                            <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 transform gap-2">
                                <button
                                    type="button"
                                    onClick={() => addRow(floorIndex)}
                                >
                                    <ChooseCol color="#E23333" />
                                </button>
                                {floor.length > 1 ? (
                                    <button
                                        type="button"
                                        className="text-lg font-bold text-[#E23333]"
                                        onClick={() => deleteRow(floorIndex)}
                                    >
                                        -
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {errorMessage ? (
                <p className="text-sm font-medium text-[#E23333]">
                    {errorMessage}
                </p>
            ) : (
                <p className="text-sm font-medium text-[#A0A0A0]">
                    Схема синхронизируется с формой автоматически.
                </p>
            )}
        </div>
    );
};

export default Scheme;
