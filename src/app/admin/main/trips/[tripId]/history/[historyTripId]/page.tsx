import { notFound } from 'next/navigation';

import type { Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

import TripDetailsView from '../../../_components/trip-details-view';
import { getTripHistoryRuns } from '../../../_data/trip-details';

type Props = {
    params: {
        tripId: string;
        historyTripId: string;
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

export default async function AdminTripHistoryDetailsPage({ params }: Props) {
    const trip = await getTrip(params.tripId);

    if (!trip) {
        notFound();
    }

    const historyRuns = getTripHistoryRuns(trip);
    const historyRun = historyRuns.find((run) => run.id === params.historyTripId);

    if (!historyRun) {
        notFound();
    }

    return (
        <TripDetailsView
            trip={trip}
            run={historyRun}
            historyRuns={historyRuns}
            mode="history"
        />
    );
}
