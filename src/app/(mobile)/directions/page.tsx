'use client';
import React from 'react';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getDirectionsAction } from './actions';
import Spinner from '@/components/spinner';
import BusMini from '../../../assets/bus-mini';
import { GetRequestData } from '@/data/types';
import Wifi from '@/assets/wifi';
import ToiletPaper from '@/assets/toilet-paper';
import HotelBed from '@/assets/hotel-bed';
import CitySelector from '@/components/citySelector';
import { getCitiesAction } from '../main/actions';
import { useRouter } from 'next/navigation';

const Directions = () => {
    const router = useRouter();
    const { data: directions, isPending } = useServerActionQuery(
        getDirectionsAction,
        {
            input: undefined,
            queryKey: ['getPopularDirections'],
        }
    );
    const { data: cities, isPending: isCitiesPending } = useServerActionQuery(
        getCitiesAction,
        {
            input: undefined,
            queryKey: ['getCities'],
        }
    );

    const handleDirectionClick = (fromName: string, toName: string) => {
        if (!cities) return;
        const from = cities.find((city) => city.name === fromName);
        const to = cities.find((city) => city.name === toName);
        const url = `/main?from=${from?.id}&to=${to?.id}&passenger_count=1`;
        router.push(url);
    };

    if (isPending || isCitiesPending) {
        return (
            <div className="h-full bg-[var(--gray)] px-5">
                <h1 className="pt-[75px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
                    Популярные направления
                </h1>
                <div className="mt-3 flex flex-wrap justify-center gap-1 py-5">
                    <Spinner size="md" />
                </div>
            </div>
        );
    }
    return (
        <div className="h-full bg-[var(--gray)] px-5">
            <h1 className="pt-[75px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
                Популярные направления
            </h1>
            <div className="mt-3 flex flex-wrap gap-1">
                <CitySelector />

                <div className="w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0]">
                    Самые дешевые
                </div>
            </div>

            <div className="mb-10 mt-4 flex flex-col gap-3">
                {directions?.map((direction: GetRequestData) => (
                    <div
                        key={`${direction.from_city}-${direction.to_city}-${direction.start_date}`}
                        className="flex flex-col gap-2 rounded-[10px] border border-[#D1D1D1] bg-white p-4"
                        onClick={() =>
                            handleDirectionClick(
                                direction.from_city,
                                direction.to_city
                            )
                        }
                    >
                        <div className="flex items-center gap-2">
                            <BusMini color="#E74949" />
                            <p className="text-sm font-medium text-[var(--black)]">
                                {direction.from_city} - {direction.to_city}
                            </p>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="m-0 text-[28px] font-bold text-[#E74949]">
                                {parseFloat(direction.ticket_price).toFixed(0)}₸
                            </span>
                            <span className="text-xs text-[#A0A0A0]">
                                Отправление:{' '}
                                {direction.departure_time.slice(0, 5)}
                            </span>
                        </div>
                        <div className="flex flex-row items-center gap-2 text-xs text-[#A0A0A0]">
                            {direction.bus.have_wifi ? <Wifi /> : ' '}{' '}
                            {direction.bus.have_toilet ? <ToiletPaper /> : ' '}{' '}
                            {direction.bus.is_recumbent ? ' ' : <HotelBed />}
                        </div>
                        {/* <div className="text-xs text-[#A0A0A0]">
                            В пути: {parseFloat(direction.route.total_travel_time) / 3600} ч.
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Directions;
