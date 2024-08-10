'use client';
import React from 'react';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getDirectionsAction } from './actions';
import Spinner from '@/components/spinner';
import BusMini from '../../../assets/bus-mini';

const Directions = () => {
    const { data: directions, isPending } = useServerActionQuery(
        getDirectionsAction,
        {
            input: undefined,
            queryKey: ['getPopularDirections'],
        }
    );

    if (isPending) {
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
                <div className="flex w-fit items-center gap-2 rounded-full border border-[#E74949] px-5 py-[5px] text-sm font-semibold text-[#E74949]">
                    Из Алматы
                    <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4.99993 3.78095L8.2998 0.48114L9.2426 1.42395L4.99993 5.66662L0.757324 1.42395L1.70013 0.48114L4.99993 3.78095Z"
                            fill="#E74949"
                        />
                    </svg>
                </div>
                <div className="w-fit rounded-full border border-[#A0A0A0] px-5 py-[5px] text-sm font-semibold text-[#A0A0A0]">
                    Самые дешевые
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
                {directions?.map((direction) => (
                    <div
                        key={direction.id}
                        className="rounded-[10px] border border-[#D1D1D1] bg-white p-4"
                    >
                        <div className="flex items-center gap-2">
                            <BusMini color="#E74949" />
                            <p className="text-sm font-medium text-[var(--black)]">
                                {direction.from_point.name} / ав.{' '}
                                {direction.from_bus_station.name} -{' '}
                                {direction.to_point.name} / ав.{' '}
                                {direction.to_bus_station.name}
                            </p>
                        </div>
                        <div className="mt-2 flex items-end justify-between">
                            <span className="m-0 text-[28px] font-bold text-[#E74949]">
                                {parseFloat(direction.price).toFixed(0)}₸
                            </span>
                            <span className="text-xs text-[#A0A0A0]">
                                1 пассажир
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Directions;
