import type { DriverTrip } from '@/lib/cargo-contract';
import type {
    CargoShipperContact,
    TripStatus,
    TripStep,
} from '../_types/cargo';

const statuses = [
    'planned',
    'loading',
    'in_transit',
    'unloading',
    'completed',
] as const;
const labels: Record<DriverTrip['status'], string> = {
    planned: 'Назначен',
    loading: 'Погрузка',
    in_transit: 'В пути',
    unloading: 'Разгрузка',
    completed: 'Завершен',
};

function displayStatus(status: DriverTrip['status']): TripStatus {
    return status === 'in_transit' ? 'inTransit' : status;
}

export function tripPresentation(trip: DriverTrip) {
    return {
        currentStatus: displayStatus(trip.status),
        routeLabel: `${trip.order.from} → ${trip.order.to}`,
        referenceNumber: trip.order.id,
        eta: trip.eta,
    };
}

export function tripSteps(trip: DriverTrip): TripStep[] {
    const currentIndex = statuses.indexOf(trip.status);
    const contact = (
        trip.stages.find((stage) => stage.status === 'current') ??
        trip.stages[0]
    )?.contacts[0];
    return statuses.map((status, index) => ({
        id: index,
        title: labels[status],
        description:
            status === 'loading'
                ? trip.order.from
                : status === 'unloading'
                  ? trip.order.to
                  : labels[status],
        status: displayStatus(status),
        state:
            trip.status === 'completed' || index < currentIndex
                ? 'done'
                : index === currentIndex
                  ? 'current'
                  : 'upcoming',
        orderNumber: trip.order.id,
        address:
            status === 'loading'
                ? trip.order.pickup || trip.order.from
                : status === 'unloading'
                  ? trip.order.to
                  : undefined,
        timeLabel: status === 'loading' ? trip.order.date : trip.eta,
        contactName: contact?.name,
        contactPhone: contact?.phone,
    }));
}

export function orderDetails(trip: DriverTrip): CargoShipperContact {
    const contact = (
        trip.stages.find((stage) => stage.status === 'current') ??
        trip.stages[0]
    )?.contacts[0];
    return {
        id: trip.order.recordId,
        orderNumber: trip.order.id,
        companyName: `${trip.order.from} → ${trip.order.to}`,
        contactName: contact?.name || 'Не указан',
        phone: contact?.phone || '',
        cargoTitle: `${trip.order.cargo} · ${trip.order.quantity} ${trip.order.unit}`,
        pickupPoint: trip.order.from,
        pickupAddress: trip.order.pickup || trip.order.from,
        dropoffPoint: trip.order.to,
        dropoffAddress: trip.order.to,
        status:
            trip.status === 'completed'
                ? 'delivered'
                : trip.status === 'in_transit'
                  ? 'inTransit'
                  : trip.status === 'unloading'
                    ? 'loaded'
                    : 'awaitingDelivery',
    };
}
