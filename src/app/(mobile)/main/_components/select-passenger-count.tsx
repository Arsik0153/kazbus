import Input from '@/components/input';
import { getStringByNumber } from '@/utils/helper.';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import User from '../../../../../public/assets/user';
import Counter from '@/components/counter';

const SelectPassengerCount = () => {
    const [isOpen, setIsOpen] = useState(false);

    const searchParams = useSearchParams();
    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;

    const [adultPassengers, setAdultPassengers] = useState(1);
    const [childPassengers, setChildPassengers] = useState(0);

    const totalPassengers = adultPassengers + childPassengers;

    const pathname = usePathname();
    const router = useRouter();

    const handleAdultPassengersChange = (value: number) => {
        setAdultPassengers(value);
    };

    const handleChildPassengersChange = (value: number) => {
        setChildPassengers(value);
    };

    const handleInputWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsOpen(true);
    };

    useEffect(() => {
        const updateSearchQuery = (
            updatedQuery: Record<string, string | null>
        ) => {
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

        updateSearchQuery({ passenger_count: String(totalPassengers) });
    }, [pathname, router, searchParams, totalPassengers]);

    return (
        <>
            {isOpen && (
                <>
                    <div
                        className="absolute left-0 top-0 z-20 h-screen w-screen bg-black/40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="fixed bottom-0 left-0 right-0 z-30 mt-24 flex flex-col rounded-t-[10px] bg-white pb-24">
                        <div className="flex-1 rounded-t-[10px] bg-white p-4">
                            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
                            <div className="mx-auto max-w-md">
                                <h1 className="text-center text-2xl font-bold text-[#E74949]">
                                    Сколько пассажиров?
                                </h1>

                                <div className="mt-6 flex justify-between">
                                    <div className="flex flex-col items-start">
                                        <h1 className="text-xl font-semibold text-[var(--black)]">
                                            Взрослый
                                        </h1>
                                        <p className="text-sm font-medium text-[#A0A0A0]">
                                            от 12 лет
                                        </p>
                                    </div>
                                    <Counter
                                        value={adultPassengers}
                                        setValue={handleAdultPassengersChange}
                                    />
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <div className="flex flex-col items-start">
                                        <h1 className="text-xl font-semibold text-[var(--black)]">
                                            Детские
                                        </h1>
                                        <p className="text-sm font-medium text-[#A0A0A0]">
                                            младше 12 лет
                                        </p>
                                    </div>
                                    <Counter
                                        value={childPassengers}
                                        setValue={handleChildPassengersChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div onClick={handleInputWrapperClick}>
                <div className="pointer-events-none">
                    <Input
                        label={`${passengerCountParam} ${getStringByNumber(
                            passengerCountParam,
                            ['пассажир', 'пассажира', 'пассажиров']
                        )}`}
                        id="passengers"
                        variant="ghost"
                        iconLeft={<User color="white" />}
                        hideKeyboardOnFocus={false}
                    />
                </div>
            </div>
        </>
    );
};

export default SelectPassengerCount;
