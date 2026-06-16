import Link from 'next/link';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { notFound } from 'next/navigation';

import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';
import type { Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

import { getTripHistoryRuns } from '../../_data/trip-details';

type Props = {
    params: {
        tripId: string;
    };
};

async function getTrip(tripId: string) {
    const response = await adminFetch('/trip/trips/');

    if (!response.ok) {
        throw new Error('Не удалось загрузить рейс');
    }

    const trips = (await response.json()) as Trips[];

    return trips.find((trip) => String(trip.id) === tripId) ?? null;
}

export default async function AdminTripHistoryPage({ params }: Props) {
    const trip = await getTrip(params.tripId);

    if (!trip) {
        notFound();
    }

    const historyRuns = getTripHistoryRuns(trip);

    return (
        <div className="mt-6 flex flex-col gap-5 pb-20">
            <div className="rounded-[20px] bg-white px-8 py-8">
                <Button asChild variant="outline">
                    <Link href={`/admin/main/trips/${trip.id}`}>
                        <ArrowLeft data-icon="inline-start" />
                        К рейсу
                    </Link>
                </Button>
                <h1 className="mt-5 text-[42px] font-semibold leading-tight text-[#4A4A4A]">
                    История рейса
                </h1>
                <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                    {trip.from_city} - {trip.to_city}. Все проведенные поездки
                    этого маршрута.
                </p>
            </div>

            <AdminSectionCard
                title="Проведенные рейсы"
                description="Откройте поездку, чтобы увидеть пассажиров, статусы, выручку и происшествия."
            >
                <div className="grid grid-cols-3 gap-4">
                    {historyRuns.map((historyRun) => {
                        const boardedPassengers =
                            historyRun.passengers.filter(
                                (passenger) => passenger.status === 'boarded'
                            ).length;
                        const missedPassengers =
                            historyRun.passengers.length - boardedPassengers;
                        const occupancyRate = Math.round(
                            (boardedPassengers /
                                historyRun.passengerCapacity) *
                                100
                        );

                        return (
                            <Link
                                key={historyRun.id}
                                href={`/admin/main/trips/${trip.id}/history/${historyRun.id}`}
                                className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5 duration-150 hover:border-[#E74949] hover:bg-white"
                            >
                                <CalendarDays className="text-[#E74949]" />
                                <p className="mt-4 text-xl font-semibold text-[#4A4A4A]">
                                    {historyRun.tripDate}
                                </p>
                                <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                    {historyRun.departureTime} -{' '}
                                    {historyRun.arrivalTime}
                                </p>
                                <div className="mt-5 grid grid-cols-3 gap-2">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                                            На рейсе
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-[#4A4A4A]">
                                            {boardedPassengers}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                                            Не пришли
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-[#E74949]">
                                            {missedPassengers}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                                            Загрузка
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-[#4A4A4A]">
                                            {occupancyRate}%
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </AdminSectionCard>
        </div>
    );
}
