import Topbar from '@/components/topbar';
import React, { useEffect, useState } from 'react';
import ArrowLeftIcon from '../../../../assets/arrow-left-icon';
import Input from '@/components/input';
import InputFromMain from '@/components/inputFromMain';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getCitiesAction } from '../actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { City } from '@/data/types';
import { Drawer } from 'vaul';

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

    return (
        <Drawer.Root
            shouldScaleBackground
            open={isOpen}
            onOpenChange={(open) => setIsOpen(open)}
        >
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 flex h-[90%] flex-col rounded-t-[10px] bg-white">
                    <div className="-mt-[1px] overflow-auto rounded-t-[10px]">
                        <Drawer.Title hidden>Точка отправления</Drawer.Title>
                        <Drawer.Description hidden>
                            Выберите точку отправления
                        </Drawer.Description>
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
                            {[
                                ...filteredCities,
                                ...filteredCities,
                                ...filteredCities,
                                ...filteredCities,
                                ...filteredCities,
                            ].map((city, index) => (
                                <li
                                    key={city.id + index}
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
                </Drawer.Content>
            </Drawer.Portal>
            <Drawer.Trigger
                asChild
                onClick={() => {
                    console.log('click');
                    setIsOpen(true);
                }}
            >
                <button>
                    <div className="pointer-events-none">
                        <Input
                            label="Откуда вы отправляетесь"
                            defaultValue={selectedCity}
                            id="from"
                            variant="ghost"
                            iconLeft={<ArrowLeftIcon color="white" />}
                            hideKeyboardOnFocus={false}
                            containerClassName="pt-[30px] pb-[16px]"
                        />
                    </div>
                </button>
            </Drawer.Trigger>
        </Drawer.Root>
    );
};

export default SelectDeparture;
