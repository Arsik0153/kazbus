import Topbar from '@/components/topbar';
import React, { useState } from 'react';
import ArrowLeftIcon from '../../../../../public/assets/arrow-left-icon';
import { cities } from '@/static/city';
import ArrowRightIcon from '../../../../../public/assets/arrow-right-icon';
import Input from '@/components/input';

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
                <div className="fixed inset-0 z-30 h-full min-h-screen w-full overflow-auto bg-[var(--bg)]">
                    <Topbar className="mx-0 w-full">
                        <div 
                            onClick={handleBackClick}
                            className="flex max-h-[80px] w-full flex-row items-center gap-4 rounded-[10px] border border-[#AAAAAA] bg-[#FFFFFF29] px-[20px] py-[30px]"
                        >
                            <div>
                                <ArrowRightIcon color="white" />
                            </div>
                            <div className="text-left text-[16px] font-medium leading-[17.6px] text-white">
                                Куда вы направляетесь?
                            </div>
                        </div>
                    </Topbar>
                    <ul className="mx-5 mb-10">
                        {cities.map((city) => (
                            <li
                                key={city.id}
                                className="flex items-center justify-between border-b-[1px] border-b-[#CDCDCD] px-[10px] py-5"
                                onClick={() => handleCitySelect(city.name)} // Изменено здесь
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
            label={selectedCity || 'Куда'}
            id="where"
            onClick={() => setIsOpen(true)}
            variant='ghost'
            iconLeft={<ArrowRightIcon color="white" />}
        />
    );
};

export default SelectDeparture;
