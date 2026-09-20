'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getDirectionsAction } from './actions';
import { selectDirections } from './model';
import Spinner from '@/components/spinner';
import BusMini from '@/assets/bus-mini';
import Wifi from '@/assets/wifi';
import ToiletPaper from '@/assets/toilet-paper';
import HotelBed from '@/assets/hotel-bed';

export default function Directions() {
    const [cityId, setCityId] = useState('');
    const [cheapest, setCheapest] = useState(false);
    const {
        data: directions = [],
        isPending,
        isError,
        refetch,
    } = useServerActionQuery(getDirectionsAction, {
        input: undefined,
        queryKey: ['getPopularDirections'],
    });
    const cities = Array.from(
        new Map(
            directions.map((direction) => [
                direction.route.start_city.id,
                direction.route.start_city,
            ])
        ).values()
    ).sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    const visible = selectDirections(directions, cityId, cheapest);
    return (
        <main className="min-h-full bg-[var(--gray)] px-5 pb-24">
            <h1 className="pt-[75px] text-[42px] leading-tight font-semibold text-[var(--black)]">
                Популярные направления
            </h1>
            <div className="mt-4 flex flex-wrap items-end gap-3">
                <label className="text-sm font-semibold text-[#4A4A4A]">
                    Город отправления
                    <select
                        value={cityId}
                        onChange={(event) => setCityId(event.target.value)}
                        className="mt-1 block max-w-full rounded-full border border-[#E74949] bg-white px-4 py-2 text-[#E74949]"
                    >
                        <option value="">Все города</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button
                    type="button"
                    aria-pressed={cheapest}
                    onClick={() => setCheapest(!cheapest)}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold ${cheapest ? 'border-[#E74949] bg-[#E74949] text-white' : 'border-[#A0A0A0] text-[#555]'}`}
                >
                    Самые дешёвые
                </button>
            </div>
            {isPending ? (
                <div className="flex justify-center py-12">
                    <Spinner size="md" />
                </div>
            ) : isError ? (
                <div role="alert" className="py-8">
                    <p>Не удалось загрузить направления.</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 underline"
                    >
                        Попробовать ещё раз
                    </button>
                </div>
            ) : (
                <div className="mt-4 mb-10 flex flex-col gap-3">
                    {visible.length === 0 && (
                        <p className="py-8">
                            Направлений из выбранного города пока нет.
                        </p>
                    )}
                    {visible.map((direction) => (
                        <Link
                            key={direction.id}
                            href={`/bus/main?from=${direction.route.start_city.id}&to=${direction.route.end_city.id}&passenger_count=1`}
                            className="flex flex-col gap-2 rounded-[10px] border border-[#D1D1D1] bg-white p-4"
                        >
                            <div className="flex items-center gap-2">
                                <BusMini color="#E74949" />
                                <p className="text-sm font-medium text-[var(--black)]">
                                    {direction.route.start_city.name} —{' '}
                                    {direction.route.end_city.name}
                                </p>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-[28px] font-bold text-[#E74949]">
                                    {Number(
                                        direction.ticket_price
                                    ).toLocaleString('ru-RU')}{' '}
                                    ₸
                                </span>
                                <span className="text-xs text-[#666]">
                                    Отправление:{' '}
                                    {direction.departure_time.slice(0, 5)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#666]">
                                {direction.bus.have_wifi && (
                                    <span title="Wi-Fi">
                                        <Wifi />
                                    </span>
                                )}
                                {direction.bus.have_toilet && (
                                    <span title="Туалет">
                                        <ToiletPaper />
                                    </span>
                                )}
                                {direction.bus.is_recumbent && (
                                    <span title="Лежачие места">
                                        <HotelBed />
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
