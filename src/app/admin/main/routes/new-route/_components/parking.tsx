import React from 'react';
import ComboBox from '../../../trips/_components/inputCombo';
import InputMini from '@/components/admin/inputMini';
import Clock from '@/assets/red-clock';

interface ParkingProps {
    index: number;
    onRemove: () => void;
}

const Parking: React.FC<ParkingProps> = ({ index, onRemove }) => {
    return (
        <div className="flex flex-row p-4 pr-12 rounded-[5px] bg-white justify-between">
            <div className="flex flex-col items-start justify-between">
                <ComboBox name={`stop-${index}`} placeholder='Остановка' />
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
