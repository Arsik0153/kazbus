import React, { useState } from 'react';

interface SeatConfiguratorProps {
    label: string;    // Текст, который будет отображаться слева
    value: string;    // Значение, которое будет отображаться в круге
    onClick?: () => void; // Функция для обработки кликов
}

const SeatConfigurator: React.FC<SeatConfiguratorProps> = ({ label, value, onClick }) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleClick = () => {
        setIsActive(!isActive);
        if (onClick) {
            onClick();
        }
    };

    return (
        <button
            className={`text-sm font-semibold flex flex-row justify-between p-[6px] pl-4 items-center rounded-[10px] 
                ${isActive ? 'bg-[#E23333] text-white border-white' : 'border border-[#E32B2B] text-[#4A4A4A]'}`}
            onClick={handleClick}
        >
            <span className={`mr-8 text-start text-nowrap ${isActive ? 'text-white' : 'text-[#4A4A4A]'}`}>
                {label}
            </span>
            <p className={`text-xl font-bold h-12 w-12 border flex justify-center items-center rounded-[10px]
                ${isActive ? 'bg-[#E23333] text-white border-white' : 'text-[#E23333] border-[#E23333]'}`}>
                {value}
            </p>
        </button>
    );
};

export default SeatConfigurator;
