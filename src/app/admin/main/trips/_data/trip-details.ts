import type { Trips } from '@/data/types';

export type AdminTripPassengerStatus = 'boarded' | 'waiting' | 'missed';

export type AdminTripPassenger = {
    id: string;
    fullName: string;
    seatNumber: string;
    ticketNumber: string;
    boardingPoint: string;
    destination: string;
    fareLabel: string;
    status: AdminTripPassengerStatus;
    ticketStatus?: string;
};

export type AdminTripStepId =
    | 'bus-arrival'
    | 'boarding'
    | 'departure'
    | 'enroute'
    | 'arrival';

export type AdminTripStepState = 'done' | 'current' | 'upcoming';

export type AdminTripStep = {
    id: AdminTripStepId;
    title: string;
    description: string;
    state: AdminTripStepState;
};

export type AdminTripIncident = {
    id: string;
    title: string;
    comment: string;
    createdAt: string;
    driverName: string;
};

export type AdminTripRunDetails = {
    id: string;
    dateIso: string;
    tripDate: string;
    routeLabel: string;
    departureTime: string;
    arrivalTime: string | null;
    passengerCapacity: number;
    passengers: AdminTripPassenger[];
    steps: AdminTripStep[];
    incidents: AdminTripIncident[];
};

export type AdminTripSummary = {
    total_passengers: number;
    average_occupancy: number;
    revenue: string;
};

export type AdminTripDetailsResponse = {
    trip: Trips;
    summary: AdminTripSummary;
    current_run: AdminTripRunDetails;
    history_runs: AdminTripRunDetails[];
};
