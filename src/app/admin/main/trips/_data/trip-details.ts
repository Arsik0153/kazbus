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
    tripDate: string;
    routeLabel: string;
    departureTime: string;
    arrivalTime: string;
    passengerCapacity: number;
    passengers: AdminTripPassenger[];
    steps: AdminTripStep[];
    incidents: AdminTripIncident[];
};

const stepTemplates: Array<Omit<AdminTripStep, 'state'>> = [
    {
        id: 'bus-arrival',
        title: 'Подача автобуса',
        description: 'Автобус подан на платформу и готовится к посадке.',
    },
    {
        id: 'boarding',
        title: 'Посадка пассажиров',
        description: 'Водитель проверяет билеты и отмечает пассажиров.',
    },
    {
        id: 'departure',
        title: 'Отправление',
        description: 'Рейс отправился по маршруту.',
    },
    {
        id: 'enroute',
        title: 'В пути',
        description: 'Автобус движется между контрольными точками.',
    },
    {
        id: 'arrival',
        title: 'Прибытие',
        description: 'Рейс прибыл в конечный пункт.',
    },
];

const basePassengers: AdminTripPassenger[] = [
    {
        id: 'passenger-1',
        fullName: 'Аскар Сейдахметов',
        seatNumber: '3A',
        ticketNumber: 'TK-001842',
        boardingPoint: 'Автовокзал Сайран',
        destination: 'Шымкент',
        fareLabel: 'Стандарт',
        status: 'boarded',
    },
    {
        id: 'passenger-2',
        fullName: 'Алина Кожахметова',
        seatNumber: '3B',
        ticketNumber: 'TK-001843',
        boardingPoint: 'Автовокзал Сайран',
        destination: 'Шымкент',
        fareLabel: 'Стандарт',
        status: 'boarded',
    },
    {
        id: 'passenger-3',
        fullName: 'Диас Темирбек',
        seatNumber: '6C',
        ticketNumber: 'TK-001851',
        boardingPoint: 'Автовокзал Сайран',
        destination: 'Тараз',
        fareLabel: 'Комфорт',
        status: 'waiting',
    },
    {
        id: 'passenger-4',
        fullName: 'Мадина Жусупова',
        seatNumber: '8D',
        ticketNumber: 'TK-001857',
        boardingPoint: 'Автовокзал Сайран',
        destination: 'Шымкент',
        fareLabel: 'Стандарт',
        status: 'waiting',
    },
    {
        id: 'passenger-5',
        fullName: 'Ернар Бекболат',
        seatNumber: '11A',
        ticketNumber: 'TK-001861',
        boardingPoint: 'Автовокзал Сайран',
        destination: 'Тараз',
        fareLabel: 'Стандарт',
        status: 'missed',
    },
    {
        id: 'passenger-6',
        fullName: 'Гульмира Оспанова',
        seatNumber: '14C',
        ticketNumber: 'TK-001864',
        boardingPoint: 'Каскелен',
        destination: 'Шымкент',
        fareLabel: 'Стандарт',
        status: 'boarded',
    },
];

function buildSteps(currentStepId: AdminTripStepId | null): AdminTripStep[] {
    if (!currentStepId) {
        return stepTemplates.map((step) => ({ ...step, state: 'done' }));
    }

    const currentIndex = stepTemplates.findIndex(
        (step) => step.id === currentStepId
    );

    return stepTemplates.map((step, index) => ({
        ...step,
        state:
            index < currentIndex
                ? 'done'
                : index === currentIndex
                  ? 'current'
                  : 'upcoming',
    }));
}

function getRouteLabel(trip: Trips) {
    return `${trip.from_city} - ${trip.to_city}`;
}

function getArrivalTime(trip: Trips) {
    if (trip.come_to_point) {
        return trip.come_to_point.slice(0, 5);
    }

    return '08:10';
}

function getCapacity(trip: Trips) {
    return trip.bus?.count_of_seats || 47;
}

function getDriverName(trip: Trips) {
    return trip.driver?.full_name || 'Водитель рейса';
}

function mapPassengersForHistory(
    seed: string,
    passengers: AdminTripPassenger[],
    missedIndexes: number[]
) {
    return passengers.map((passenger, index) => ({
        ...passenger,
        id: `${seed}-${passenger.id}`,
        status: missedIndexes.includes(index)
            ? 'missed'
            : ('boarded' as AdminTripPassengerStatus),
    }));
}

export function getCurrentTripRunDetails(trip: Trips): AdminTripRunDetails {
    return {
        id: `current-${trip.id}`,
        tripDate: 'Сегодня',
        routeLabel: getRouteLabel(trip),
        departureTime: trip.departure_time.slice(0, 5),
        arrivalTime: getArrivalTime(trip),
        passengerCapacity: getCapacity(trip),
        passengers: basePassengers,
        steps: buildSteps('boarding'),
        incidents: [],
    };
}

export function getTripHistoryRuns(trip: Trips): AdminTripRunDetails[] {
    const routeLabel = getRouteLabel(trip);
    const passengerCapacity = getCapacity(trip);
    const departureTime = trip.departure_time.slice(0, 5);
    const arrivalTime = getArrivalTime(trip);
    const driverName = getDriverName(trip);

    return [
        {
            id: 'history-1',
            tripDate: '15 июня 2026',
            routeLabel,
            departureTime,
            arrivalTime,
            passengerCapacity,
            passengers: mapPassengersForHistory('history-1', basePassengers, [
                4,
            ]),
            steps: buildSteps(null),
            incidents: [],
        },
        {
            id: 'history-2',
            tripDate: '13 июня 2026',
            routeLabel,
            departureTime,
            arrivalTime,
            passengerCapacity,
            passengers: mapPassengersForHistory('history-2', basePassengers, [
                2,
                4,
            ]),
            steps: buildSteps(null),
            incidents: [
                {
                    id: 'incident-1',
                    title: 'Задержка на промежуточной остановке',
                    comment:
                        'Пассажир с опозданием подошел на посадку, отправление задержали на 7 минут.',
                    createdAt: '13 июня 2026, 22:07',
                    driverName,
                },
            ],
        },
        {
            id: 'history-3',
            tripDate: '11 июня 2026',
            routeLabel,
            departureTime,
            arrivalTime,
            passengerCapacity,
            passengers: mapPassengersForHistory('history-3', basePassengers, []),
            steps: buildSteps(null),
            incidents: [],
        },
    ];
}
