import React from 'react';
import Handlebar from '@/assets/admin/Handlebar';

const options = [
    { label: 'Установка мест', value: 'seats', displayValue: '01' },
    {
        label: 'Установка места водителя',
        value: 'driver',
        icon: <Handlebar color="#A0A0A0" />,
    },
    { label: 'Установка прохода', value: 'aisle', displayValue: '/' },
];

type SeatConfiguratorProps = {
    selectedValue: 'seats' | 'driver' | 'aisle';
    onChange: (value: 'seats' | 'driver' | 'aisle') => void;
};

const SeatConfigurator: React.FC<SeatConfiguratorProps> = ({
    selectedValue,
    onChange,
}) => {
    return (
        <div className="flex flex-row gap-2">
            {options.map((option) => {
                const isActive = selectedValue === option.value;
                return (
                    <label
                        key={option.value || option.label}
                        className="flex items-center"
                    >
                        <input
                            type="radio"
                            name="seat-configurator"
                            value={option.value}
                            checked={isActive}
                            onChange={() =>
                                option.value &&
                                onChange(
                                    option.value as 'seats' | 'driver' | 'aisle'
                                )
                            }
                            className="hidden"
                        />
                        <div
                            className={`flex cursor-pointer flex-row items-center justify-between rounded-[10px] p-[6px] pl-4 text-sm font-semibold ${isActive ? 'border-white bg-[#E23333] text-white' : 'border border-[#E32B2B] text-[#4A4A4A]'}`}
                        >
                            <span
                                className={`mr-8 text-nowrap text-start ${isActive ? 'text-white' : 'text-[#4A4A4A]'}`}
                            >
                                {option.label}
                            </span>
                            <div
                                className={`flex items-center justify-center rounded-[10px] border text-xl font-bold ${option.icon ? 'h-12 w-24' : 'h-12 w-12'} ${isActive ? 'border-white bg-[#E23333] text-white' : 'border-[#A0A0A0] text-[#E23333]'}`}
                            >
                                {option.icon
                                    ? React.cloneElement(
                                          option.icon as React.ReactElement,
                                          {
                                              color: isActive
                                                  ? '#FFFFFF'
                                                  : '#A0A0A0',
                                          }
                                      )
                                    : option.displayValue}
                            </div>
                        </div>
                    </label>
                );
            })}
        </div>
    );
};

export default SeatConfigurator;
