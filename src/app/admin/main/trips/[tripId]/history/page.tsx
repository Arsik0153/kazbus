import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import type { Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

import TripHistoryRuns from '../../_components/trip-history-runs';
import TripHistorySummary from '../../_components/trip-history-summary';
import type {
    AdminTripRunDetails,
    AdminTripSummary,
} from '../../_data/trip-details';

type Props = {
    params: {
        tripId: string;
    };
    searchParams?: {
        date?: string;
    };
};

async function getTrip(tripId: string) {
    const response = await adminFetch(`/trip/trips/${tripId}/`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Не удалось загрузить рейс');
    }

    return (await response.json()) as Trips;
}

async function getHistoryRuns(tripId: string, date?: string) {
    const searchParams = new URLSearchParams();

    if (date) {
        searchParams.set('date', date);
    }

    const query = searchParams.toString();
    const response = await adminFetch(
        `/trip/trips/${tripId}/runs/${query ? `?${query}` : ''}`
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Не удалось загрузить историю рейса');
    }

    return (await response.json()) as AdminTripRunDetails[];
}

function getSummary(
    trip: Trips,
    historyRuns: AdminTripRunDetails[]
): AdminTripSummary {
    const capacity = trip.bus?.count_of_seats || 0;
    const totalPassengers = historyRuns.reduce(
        (sum, run) => sum + run.passengers.length,
        0
    );
    const averageOccupancy =
        capacity > 0 && historyRuns.length > 0
            ? Math.round(
                  historyRuns.reduce(
                      (sum, run) =>
                          sum + (run.passengers.length / capacity) * 100,
                      0
                  ) / historyRuns.length
              )
            : 0;

    return {
        total_passengers: totalPassengers,
        average_occupancy: averageOccupancy,
        revenue: (totalPassengers * (Number(trip.ticket_price) || 0)).toFixed(
            2
        ),
    };
}

export default async function AdminTripHistoryPage({
    params,
    searchParams,
}: Props) {
    const allHistoryRunsPromise = getHistoryRuns(params.tripId);
    const [trip, historyRuns, allHistoryRuns] = await Promise.all([
        getTrip(params.tripId),
        searchParams?.date
            ? getHistoryRuns(params.tripId, searchParams.date)
            : allHistoryRunsPromise,
        allHistoryRunsPromise,
    ]);

    if (!trip || !historyRuns || !allHistoryRuns) {
        notFound();
    }

    return (
        <div className="mt-6 flex flex-col gap-5 pb-20">
            <div className="rounded-[20px] bg-white px-8 py-8">
                <Button asChild variant="outline">
                    <Link href={`/admin/main/trips/${trip.id}`}>
                        <ArrowLeft data-icon="inline-start" />К рейсу
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

            <TripHistorySummary summary={getSummary(trip, allHistoryRuns)} />

            <TripHistoryRuns
                tripId={trip.id}
                historyRuns={historyRuns}
                selectedDateIso={searchParams?.date}
            />
        </div>
    );
}
