import React from 'react';

type SeatOption = {
    label: string;
    value?: string;
    icon?: React.ReactNode;
};

type SeatConfiguratorProps = {
    options: SeatOption[];
    selectedValue: string;
    onChange: (value: string) => void;
};

const SeatConfigurator: React.FC<SeatConfiguratorProps> = ({ options, selectedValue, onChange }) => {
    return (
        <div className="flex flex-row gap-2">
            {options.map((option) => {
                const isActive = selectedValue === option.value;
                return (
                    <label key={option.value || option.label} className="flex items-center">
                        <input
                            type="radio"
                            name="seat-configurator"
                            value={option.value}
                            checked={isActive}
                            onChange={() => option.value && onChange(option.value)}
                            className="hidden"
                        />
                        <div className={`text-sm font-semibold flex flex-row justify-between p-[6px] pl-4 items-center rounded-[10px] cursor-pointer 
                                ${isActive ? 'bg-[#E23333] text-white border-white' : 'border border-[#E32B2B] text-[#4A4A4A]'}`}>
                            <span className={`mr-8 text-start text-nowrap ${isActive ? 'text-white' : 'text-[#4A4A4A]'}`}>
                                {option.label}
                            </span>
                            <div className={`text-xl font-bold border flex justify-center items-center rounded-[10px]
                            ${option.icon ? 'h-12 w-24 ' : 'h-12 w-12'}
                                ${isActive ? 'bg-[#E23333] text-white border-white' : 'text-[#E23333] border-[#A0A0A0]'}`}>
                                {option.icon ?  React.cloneElement(option.icon as React.ReactElement, { color: isActive ? '#FFFFFF' : '#A0A0A0' }) : option.value}
                            </div>
                        </div>
                    </label>
                );
            })}
        </div>
    );
};

export default SeatConfigurator;
