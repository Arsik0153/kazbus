import React, { useState } from 'react';
import ComboBox from '../../../trips/_components/inputCombo';
import InputMini from '@/components/admin/inputMini';
import Clock from '@/assets/red-clock';

interface Item {
    id: number;
    name: string;
}

interface ParkingProps {
    index: number;
    onRemove: () => void;
}

const Parking: React.FC<ParkingProps> = ({ index, onRemove }) => {
    const [selectedStop, setSelectedStop] = useState<Item | null>(null);

    // Пример данных для ComboBox (список остановок)
    const stops: Item[] = [
        { id: 1, name: 'Остановка 1' },
        { id: 2, name: 'Остановка 2' },
        { id: 3, name: 'Остановка 3' },
    ];

    // Функция для обработки выбора элемента в ComboBox
    const handleOptionSelect = (name: string, selectedItem: Item | null) => {
        setSelectedStop(selectedItem);
        console.log('Выбранный элемент:', selectedItem);
    };

    // Функция для добавления нового элемента (можно оставить пустой или удалить, если не нужно)
    const handleNewItem = (newItem: string) => {
        console.log('Добавить новый элемент:', newItem);
    };

    // Функция для обработки изменения выбора (можно оставить пустой или удалить, если не нужно)
    const handleSelectionChange = (name: string, selected: Item | null) => {
        console.log('Изменение выбора:', name, selected);
    };

    return (
        <div className="flex flex-row p-4 pr-12 rounded-[5px] bg-white justify-between">
            <div className="flex flex-col items-start justify-between">
                <ComboBox
                    name={`stop-${index}`}
                    options={stops}
                    placeholder='Остановка'
                    onOptionSelect={handleOptionSelect}
                    onNewItem={handleNewItem}
                    onSelectionChange={handleSelectionChange}
                />
                <button
                    onClick={onRemove}
                    className='text-sm font-semibold text-[#A0A0A0] pb-5 pl-[10px] underline active:text-[#E23333] duration-75'
                >
                    Убрать остановку
                </button>
            </div>
            <div className="flex flex-col gap-3 w-3/5">
                <div className="w-full flex flex-row items-center justify-between ">
                    <p className="text-base font-semibold text-[#4A4A4A]">Время в пути до конечной точки</p>
                    <div className="flex flex-row items-center gap-3">
                        <InputMini
                            id={`TravelTimeDestinationHours-${index}`}
                            placeholder=''
                            className='max-w-20'
                            iconLeft={<Clock color="#E74949" />}
                        />
                        <p className="text-base font-medium text-[#4A4A4A]">часов</p>
                        <InputMini
                            id={`TravelTimeDestinationMinuts-${index}`}
                            placeholder=''
                            className='max-w-20'
                            iconLeft={<Clock color="#E74949" />}
                        />
                        <p className="text-base font-medium text-[#4A4A4A]">Минут</p>
                    </div>
                </div>

                <div className="w-full h-0 border"></div>
                <div className="w-full flex flex-row items-center justify-between ">
                    <p className="text-base font-semibold text-[#4A4A4A]">Время на остановку</p>
                    <div className="flex flex-row items-center gap-3">
                        <InputMini
                            id={`TimeToStopHours-${index}`}
                            placeholder=''
                            className='max-w-20'
                            iconLeft={<Clock color="#E74949" />}
                        />
                        <p className="text-base font-medium text-[#4A4A4A]">часов</p>
                        <InputMini
                            id={`TimeToStopMinutes-${index}`}
                            placeholder=''
                            className='max-w-20'
                            iconLeft={<Clock color="#E74949" />}
                        />
                        <p className="text-base font-medium text-[#4A4A4A]">Минут</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Parking;
