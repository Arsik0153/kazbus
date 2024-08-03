import Topbar from '@/components/topbar';
import React, { useState } from 'react';
import ArrowLeftIcon from '../../../../../public/assets/arrow-left-icon';
import Input from '@/components/input';
import InputFromMain from '@/components/inputFromMain';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getCitiesAction } from '../actions';

const SelectDeparture = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { data: cities } = useServerActionQuery(getCitiesAction, {
        input: undefined,
        queryKey: ['cities'],
    });

    const handleCitySelect = (cityName: string) => {
        setSelectedCity(cityName);
        setIsOpen(false);
    };

    const filteredCities =
        cities?.filter((city) =>
            city.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

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
                            label="Откуда вы отправляетесь?"
                            onChange={handleInputChange}
                            value={searchTerm}
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
            label={selectedCity || 'Откуда'}
            id="whereFrom"
            onClick={() => setIsOpen(true)}
            variant="ghost"
            iconLeft={<ArrowLeftIcon color="white" />}
        />
    );
};

export default SelectDeparture;
