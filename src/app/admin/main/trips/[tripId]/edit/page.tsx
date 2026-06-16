import { notFound } from 'next/navigation';

import type { Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

import TripForm from '../../new-trip/_components/trip-form';
import type { TripFormValues } from '../../action';

type Props = {
    params: {
        tripId: string;
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

function mapTripToFormValues(trip: Trips): TripFormValues {
    return {
        route: trip.route.id,
        bus: trip.bus?.id ? String(trip.bus.id) : '',
        driver: trip.driver?.id ?? 0,
        departure_time:
            trip.departure_time.length === 5
                ? `${trip.departure_time}:00`
                : trip.departure_time,
        is_always_active: trip.is_always_active,
        start_date: trip.start_date,
        end_date: trip.end_date,
        ticket_price: Number(trip.ticket_price),
        frequency: trip.frequency === 'weekly' ? 'weekly' : 'daily',
        weekdays: trip.weekdays,
        status:
            trip.status === 'active' ||
            trip.status === 'not_on_sale' ||
            trip.status === 'cancelled' ||
            trip.status === 'scheduled'
                ? trip.status
                : 'not_on_sale',
    };
}

export default async function EditTripPage({ params }: Props) {
    const trip = await getTrip(params.tripId);

    if (!trip) {
        notFound();
    }

    return (
        <TripForm
            mode="edit"
            tripId={trip.id}
            initialValues={mapTripToFormValues(trip)}
        />
    );
}
