import React from 'react';
import BusMini from '../../../../public/assets/bus-mini';
import CitySelector from '@/components/citySelector';
import Button from '@/components/button';

const Directions = () => {
    return (
        <div className="h-full bg-[var(--gray)] px-5">
            <h1 className="pt-[75px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
                Популярные направления
            </h1>
            <div className="mt-3 flex flex-wrap gap-1">
                <CitySelector/>
                <Button variant='choise'>Самые дешевые</Button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
                <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                    <div className="flex items-center gap-2">
                        <BusMini color="#E74949" />
                        <p className="text-sm font-medium text-[var(--black)]">
                            Алматы / ав. Саяхат - Астана / ав. Сапаржай
                        </p>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                        <span className="m-0 text-[28px] font-bold text-[#E74949]">
                            8050₸
                        </span>
                        <span className="text-xs text-[#A0A0A0]">
                            1 пассажир
                        </span>
                    </div>
                </div>
                <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                    <div className="flex items-center gap-2">
                        <BusMini color="#E74949" />
                        <p className="text-sm font-medium text-[var(--black)]">
                            Алматы / ав. Саяхат - Бишкек
                        </p>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                        <span className="m-0 text-[28px] font-bold text-[#E74949]">
                            3450₸
                        </span>
                        <span className="text-xs text-[#A0A0A0]">
                            1 пассажир
                        </span>
                    </div>
                </div>
                <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                    <div className="flex items-center gap-2">
                        <BusMini color="#E74949" />
                        <p className="text-sm font-medium text-[var(--black)]">
                            Алматы - Кокшетау
                        </p>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                        <span className="m-0 text-[28px] font-bold text-[#E74949]">
                            12350₸
                        </span>
                        <span className="text-xs text-[#A0A0A0]">
                            1 пассажир
                        </span>
                    </div>
                </div>
                <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                    <div className="flex items-center gap-2">
                        <BusMini color="#E74949" />
                        <p className="text-sm font-medium text-[var(--black)]">
                            Алматы / ав. Саяхат - Астана / ав. Сапаржай
                        </p>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                        <span className="m-0 text-[28px] font-bold text-[#E74949]">
                            8050₸
                        </span>
                        <span className="text-xs text-[#A0A0A0]">
                            1 пассажир
                        </span>
                    </div>
                </div>
                <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                    <div className="flex items-center gap-2">
                        <BusMini color="#E74949" />
                        <p className="text-sm font-medium text-[var(--black)]">
                            Алматы / ав. Саяхат - Бишкек
                        </p>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                        <span className="m-0 text-[28px] font-bold text-[#E74949]">
                            3450₸
                        </span>
                        <span className="text-xs text-[#A0A0A0]">
                            1 пассажир
                        </span>
                    </div>
                </div>
                <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                    <div className="flex items-center gap-2">
                        <BusMini color="#E74949" />
                        <p className="text-sm font-medium text-[var(--black)]">
                            Алматы - Кокшетау
                        </p>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                        <span className="m-0 text-[28px] font-bold text-[#E74949]">
                            12350₸
                        </span>
                        <span className="text-xs text-[#A0A0A0]">
                            1 пассажир
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Directions;
