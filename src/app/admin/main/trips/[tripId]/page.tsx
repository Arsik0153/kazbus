import { notFound } from 'next/navigation';

import { adminFetch } from '@/lib/admin-api';

import TripDetailsView from '../_components/trip-details-view';
import type { AdminTripDetailsResponse } from '../_data/trip-details';

type Props = {
    params: {
        tripId: string;
    };
};

async function getTripDetails(tripId: string) {
    const response = await adminFetch(`/trip/trips/${tripId}/admin-details/`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Не удалось загрузить детали рейса');
    }

    return (await response.json()) as AdminTripDetailsResponse;
}

export default async function AdminTripDetailsPage({ params }: Props) {
    const details = await getTripDetails(params.tripId);

    if (!details) {
        notFound();
    }

    return (
        <TripDetailsView
            trip={details.trip}
            run={details.current_run}
            mode="current"
        />
    );
}
