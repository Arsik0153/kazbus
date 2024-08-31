import Topbar from '@/components/topbar';
import React, { useEffect, useState } from 'react';
import ArrowLeftIcon from '../../../../assets/arrow-left-icon';
import Input from '@/components/input';
import InputFromMain from '@/components/inputFromMain';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getCitiesAction } from '../actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { City } from '@/data/types';
import Link from 'next/link';

const SelectDeparture = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { data: cities } = useServerActionQuery(getCitiesAction, {
        input: undefined,
        queryKey: ['cities'],
    });

    const searchParams = useSearchParams();
    const fromParam = searchParams.get('from');
    const pathname = usePathname();
    const router = useRouter();

    const handleCitySelect = (city: City) => {
        setSelectedCity(city.name);
        setIsOpen(false);
        updateSearchQuery({ from: String(city.id) });
    };

    const filteredCities =
        cities?.filter((city) =>
            city.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const updateSearchQuery = (updatedQuery: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(updatedQuery).forEach(([key, value]) => {
            if (value !== null) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        const queryString = params.toString();
        const updatedPath = queryString
            ? `${pathname}?${queryString}`
            : pathname;
        router.push(updatedPath);
    };

    useEffect(() => {
        if (fromParam) {
            setSelectedCity(
                cities?.find((city) => city.id === Number(fromParam))?.name ||
                    ''
            );
        }
    }, [fromParam, cities]);

    if (isOpen) {
        return (
            <>
                <div className="fixed inset-0 z-30 h-full min-h-screen w-full overflow-auto bg-[var(--bg)]">
                    <Topbar className="mx-0 w-full">
                        <InputFromMain
                            iconLeft={<Link href='/main'><ArrowLeftIcon color="white" /></Link>}
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
                                onClick={() => handleCitySelect(city)}
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
        <div onClick={() => setIsOpen(true)}>
            <div className="pointer-events-none">
                <Input
                    label="Откуда вы отправляетесь"
                    defaultValue={selectedCity}
                    id="from"
                    variant="ghost"
                    iconLeft={<ArrowLeftIcon color="white" />}
                    hideKeyboardOnFocus={false}
                    containerClassName="xs:pt-[30px] xs:pb-[16px]"
                />
            </div>
        </div>
    );
};

export default SelectDeparture;
