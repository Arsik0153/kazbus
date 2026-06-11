'use client';
import { useState, useEffect, useRef } from 'react';
import { cities } from '@/static/city';

const SelectCity = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative z-20" ref={dropdownRef}>
            <div
                className="w-fit cursor-pointer rounded-full border border-[#E74949] px-5 py-[5px] text-sm font-semibold text-[#E74949]"
                onClick={toggleDropdown}
            >
                {selectedCity || 'Выберите направление'}
            </div>
            {isOpen && (
                <div className="absolute left-0 top-full z-[9999] mt-1 max-h-[400px] min-w-[200px] overflow-y-auto rounded-[10px] border border-gray-300 bg-white shadow-lg">
                    {cities.map((city, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer border-b border-gray-200 px-4 py-2 last:border-b-0 hover:bg-gray-100 ${
                                city.name === selectedCity &&
                                'bg-[#E74949] text-white'
                            }`}
                            onClick={() => handleCitySelect(city.name)}
                        >
                            {city.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectCity;
