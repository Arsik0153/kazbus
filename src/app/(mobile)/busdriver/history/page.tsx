'use client';

import { useState } from 'react';
import { Drawer } from 'vaul';
import Topbar from '@/components/topbar';
import BusDriverHistoryTripCard from '../_components/BusDriverHistoryTripCard';
import BusDriverHistoryTripDetails from '../_components/BusDriverHistoryTripDetails';
import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import { busDriverHistoryMock } from '../_data/bus-driver.mock';
import type { BusDriverHistoryTrip } from '../_types/bus-driver';

const totalTrips = busDriverHistoryMock.length;
const totalAbsentPassengers = busDriverHistoryMock.reduce(
    (sum, trip) => sum + trip.absentPassengers,
    0
);
const averageOccupancy = Math.round(
    busDriverHistoryMock.reduce(
        (sum, trip) =>
            sum + (trip.boardedPassengers / trip.passengerCapacity) * 100,
        0
    ) / totalTrips
);

const historyStats = [
    {
        id: 'history-trips',
        label: 'Рейсов',
        value: String(totalTrips),
        description: 'в последней истории',
        tone: 'neutral' as const,
    },
    {
        id: 'history-occupancy',
        label: 'Ср. загрузка',
        value: `${averageOccupancy}%`,
        description: 'по завершенным рейсам',
        tone: 'success' as const,
    },
    {
        id: 'history-absent',
        label: 'Не пришли',
        value: String(totalAbsentPassengers),
        description: 'пассажиров суммарно',
        tone: 'brand' as const,
    },
];

const BusDriverHistoryPage = () => {
    const [selectedTrip, setSelectedTrip] =
        useState<BusDriverHistoryTrip | null>(null);

    return (
        <>
            <Topbar backHref="/busdriver">История рейсов</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="grid grid-cols-3 gap-3">
                    {historyStats.map((stat) => (
                        <BusDriverStatsCard key={stat.id} stat={stat} />
                    ))}
                </div>

                <div className="mt-5 ">
                    <h2 className="text-xl font-bold leading-[1.4rem] text-[#4A4A4A]">
                        Последние поездки
                    </h2>
                    <p className="mt-2 text-sm leading-[1.225rem] text-[#A0A0A0]">
                        На карточках показана только сводка. Нажмите на нужный
                        рейс, чтобы открыть пассажиров и все детали поездки.
                    </p>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                    {busDriverHistoryMock.map((trip) => (
                        <BusDriverHistoryTripCard
                            key={trip.id}
                            trip={trip}
                            onClick={() => setSelectedTrip(trip)}
                        />
                    ))}
                </div>
            </div>

            <Drawer.Root
                open={!!selectedTrip}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedTrip(null);
                    }
                }}
            >
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
                    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[88vh] flex-col rounded-t-[1rem] bg-white">
                        {selectedTrip && (
                            <div className="overflow-y-auto px-5 pb-8 pt-4">
                                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#D6D6D6]" />
                                <Drawer.Title className="text-center text-xl font-bold text-[#4A4A4A]">
                                    Детали рейса
                                </Drawer.Title>
                                <Drawer.Description className="sr-only">
                                    Информация о завершенном рейсе и статусах пассажиров
                                </Drawer.Description>

                                <div className="mt-5">
                                    <BusDriverHistoryTripDetails
                                        trip={selectedTrip}
                                    />
                                </div>
                            </div>
                        )}
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </>
    );
};

export default BusDriverHistoryPage;
