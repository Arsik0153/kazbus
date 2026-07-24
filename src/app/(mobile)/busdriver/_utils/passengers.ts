import type {
    BusDriverStat,
    BusPassenger,
    PassengerBoardingStatus,
} from '../_types/bus-driver';

export const getPassengerStats = (
    passengers: BusPassenger[]
): BusDriverStat[] => {
    const boardedCount = passengers.filter(
        (passenger) => passenger.boardingStatus === 'boarded'
    ).length;
    const waitingCount = passengers.filter(
        (passenger) => passenger.boardingStatus === 'waiting'
    ).length;
    const missedCount = passengers.filter(
        (passenger) => passenger.boardingStatus === 'missed'
    ).length;

    return [
        {
            id: 'all',
            label: 'Всего',
            value: String(passengers.length),
            description: 'пассажиров в списке',
            tone: 'neutral',
        },
        {
            id: 'boarded',
            label: 'На борту',
            value: String(boardedCount),
            description: 'уже прошли посадку',
            tone: 'success',
        },
        {
            id: 'waiting',
            label: 'Ожидают',
            value: String(waitingCount + missedCount),
            description: 'нужно проверить',
            tone: 'brand',
        },
    ];
};

export const normalizePassengerSearchTerm = (searchTerm: string) =>
    searchTerm.trim().toLowerCase();

export const filterPassengersBySearchTerm = (
    passengers: BusPassenger[],
    searchTerm: string
) => {
    const normalizedSearchTerm = normalizePassengerSearchTerm(searchTerm);

    if (!normalizedSearchTerm) return passengers;

    return passengers.filter((passenger) =>
        [
            passenger.fullName,
            passenger.ticketNumber,
            passenger.seatNumber,
            passenger.boardingPoint,
            passenger.destination,
            passenger.fareLabel,
        ].some((field) => field.toLowerCase().includes(normalizedSearchTerm))
    );
};

export const updatePassengerBoardingStatus = (
    passengers: BusPassenger[],
    passengerId: BusPassenger['id'],
    boardingStatus: PassengerBoardingStatus
) =>
    passengers.map((passenger) =>
        passenger.id === passengerId
            ? { ...passenger, boardingStatus }
            : passenger
    );
