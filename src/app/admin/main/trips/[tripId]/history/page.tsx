import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import type { Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

import TripHistoryRuns from '../../_components/trip-history-runs';
import type { AdminTripRunDetails } from '../../_data/trip-details';

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

export default async function AdminTripHistoryPage({
    params,
    searchParams,
}: Props) {
    const [trip, historyRuns] = await Promise.all([
        getTrip(params.tripId),
        getHistoryRuns(params.tripId, searchParams?.date),
    ]);

    if (!trip || !historyRuns) {
        notFound();
    }

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

            <TripHistoryRuns
                tripId={trip.id}
                historyRuns={historyRuns}
                selectedDateIso={searchParams?.date}
            />
        </div>
    );
}
