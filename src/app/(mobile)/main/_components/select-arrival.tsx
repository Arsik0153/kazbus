import Topbar from '@/components/topbar';
import React, { useState } from 'react';
import ArrowLeftIcon from '../../../../../public/assets/arrow-left-icon';
import { cities } from '@/static/city';
import ArrowRightIcon from '../../../../../public/assets/arrow-right-icon';
import Input from '@/components/input';
import InputFromMain from '@/components/inputFromMain';

const SelectDeparture = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>(''); // Состояние для поиска

    const handleCitySelect = (cityName: string) => {
        setSelectedCity(cityName);
        setIsOpen(false);
    };

    const handleBackClick = () => {
        setSelectedCity('');
        setIsOpen(false);
    };

    // Фильтруем города на основе поиска
    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    if (isOpen) {
        return (
            <>
                <div className="fixed inset-0 z-30 h-full min-h-screen w-full overflow-auto bg-[var(--bg)]">
                    <Topbar className="mx-0 w-full">
                        <InputFromMain
                            iconLeft={<ArrowLeftIcon color="white" />}
                            id="whereFrom"
                            label="Куда вы направляетесь?"
                            onChange={handleInputChange} // Обработчик изменения
                            value={searchTerm} // Связывание значения
                        />
                    </Topbar>
                    <ul className="mx-5 mb-10">
                        {filteredCities.map((city) => (
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
            label={selectedCity || 'Куда'}
            id="where"
            onClick={() => setIsOpen(true)}
            variant='ghost'
            iconLeft={<ArrowRightIcon color="white" />}
        />
    );
};

export default SelectDeparture;
