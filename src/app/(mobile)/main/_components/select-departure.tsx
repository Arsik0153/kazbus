import Topbar from '@/components/topbar';
import React, { useState } from 'react';
import ArrowLeftIcon from '../../../../../public/assets/arrow-left-icon';
import { cities } from '@/static/city';
import Input from '@/components/input';
import InputFromMain from '@/components/inputFromMain';

const SelectDeparture = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string>(''); // Указываем тип состояния

    const handleCitySelect = (cityName: string) => { // Явно указываем тип параметра
        setSelectedCity(cityName);
        setIsOpen(false);
    };

    const handleBackClick = () => {
        setSelectedCity('');
        setIsOpen(false);
    };

    if (isOpen) {
        return (
            <>
                <div className="fixed inset-0  z-30 h-full min-h-screen w-full overflow-auto bg-[var(--bg)]">
                    <Topbar className="mx-0 w-full">
                        <InputFromMain
                            iconLeft={<ArrowLeftIcon color="white" />}
                            label="Откуда вы отправляетесь?"
                        />
                        <Input
                            // label={selectedCity || 'Откуда вы отправляетесь?'}
                            label={'Откуда вы отправляетесь?'}
                            id="whereFrom"
                            onClick={() => setIsOpen(true)}
                            variant='ghost'
                            iconLeft={<ArrowLeftIcon color="white" />}
                        />
                    </Topbar>
                    <ul className="mx-5 mb-10">
                        {cities.map((city) => (
                            <li
                                key={city.id}
                                className="flex items-center justify-between border-b-[1px] border-b-[#CDCDCD] px-[10px] py-5"
                                onClick={() => handleCitySelect(city.name)}
                            >
                                <p className="font-medium tracking-[-3%] text-[var(--black)]">
                                    {city.name}
                                </p>
                                <span className="text-sm font-medium text-[#A0A0A0]">
                                    Город
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    }

    return (
        <Input
            label={selectedCity || 'Откуда'}
            id="whereFrom"
            onClick={() => setIsOpen(true)}
            variant='ghost'
            iconLeft={<ArrowLeftIcon color="white" />}
        />
    );
};

export default SelectDeparture;
