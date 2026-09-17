import { notFound } from 'next/navigation';

import type { Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

import TripDetailsView from '../../../_components/trip-details-view';
import type { AdminTripRunDetails } from '../../../_data/trip-details';

type Props = {
    params: Promise<{
        tripId: string;
        historyTripId: string;
    }>;
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

async function getHistoryRun(tripId: string, historyTripId: string) {
    const response = await adminFetch(
        `/trip/trips/${tripId}/runs/${historyTripId}/`
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Не удалось загрузить историю рейса');
    }

    return (await response.json()) as AdminTripRunDetails;
}

export default async function AdminTripHistoryDetailsPage({ params }: Props) {
    const { tripId, historyTripId } = await params;
    const [trip, historyRun] = await Promise.all([
        getTrip(tripId),
        getHistoryRun(tripId, historyTripId),
    ]);

    if (!trip || !historyRun) {
        notFound();
    }

    return <TripDetailsView trip={trip} run={historyRun} mode="history" />;
}
