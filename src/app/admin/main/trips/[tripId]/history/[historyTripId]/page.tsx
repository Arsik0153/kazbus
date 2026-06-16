import { notFound } from 'next/navigation';

import type { Trips } from '@/data/types';
import { adminFetch } from '@/lib/admin-api';

import TripDetailsView from '../../../_components/trip-details-view';
import type {
    AdminTripRunDetails,
    AdminTripSummary,
} from '../../../_data/trip-details';

type Props = {
    params: {
        tripId: string;
        historyTripId: string;
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

async function getHistoryRuns(tripId: string) {
    const response = await adminFetch(`/trip/trips/${tripId}/runs/`);

    if (!response.ok) {
        return [];
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
    const revenue =
        totalPassengers * (Number(trip.ticket_price) || 0);

    return {
        total_passengers: totalPassengers,
        average_occupancy: averageOccupancy,
        revenue: revenue.toFixed(2),
    };
}

export default async function AdminTripHistoryDetailsPage({ params }: Props) {
    const [trip, historyRun, historyRuns] = await Promise.all([
        getTrip(params.tripId),
        getHistoryRun(params.tripId, params.historyTripId),
        getHistoryRuns(params.tripId),
    ]);

    if (!trip || !historyRun) {
        notFound();
    }

    return (
        <TripDetailsView
            trip={trip}
            run={historyRun}
            historyRuns={historyRuns}
            summary={getSummary(trip, historyRuns)}
            mode="history"
        />
    );
}
