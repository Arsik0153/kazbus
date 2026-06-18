import type {
    BusDriverHistoryTrip,
    BusDriverProfile,
    BusDriverStat,
    BusDriverTrip,
    BusIssueOption,
    BusPassenger,
    BusSeatRow,
    BusVehicle,
} from '../_types/bus-driver';

export const busDriverProfileMock: BusDriverProfile = {
    id: 'driver-1',
    fullName: 'Руслан Омаров',
    phone: '+7 701 555 13 26',
    fleet: 'Kazbus Express',
    badgeNumber: 'BD-0241',
    licenseCategory: 'D',
    experienceYears: 9,
    rating: '4.9',
    shiftStatus: 'onDuty',
};

export const busDriverTripMock: BusDriverTrip = {
    id: 'trip-102',
    referenceNumber: 'KB-1024',
    routeLabel: 'Алматы - Шымкент',
    fromCity: 'Алматы',
    toCity: 'Шымкент',
    departureDate: '11 июня 2026',
    departureTime: '21:30',
    arrivalTime: '08:10',
    boardingWindow: '20:45 - 21:20',
    platform: 'Платформа 4',
    nextStop: 'Тараз',
    currentStatus: 'boarding',
    passengerCapacity: 47,
    boardedPassengers: 31,
    freeSeats: 8,
    steps: [
        {
            id: 'arrival',
            title: 'Подача автобуса',
            description: 'Автобус прибыл на платформу и готов к посадке.',
            state: 'done',
        },
        {
            id: 'boarding',
            title: 'Посадка пассажиров',
            description: 'Проверьте билеты и закройте посадку до отправления.',
            state: 'current',
        },
        {
            id: 'departure',
            title: 'Отправление',
            description: 'После окончания посадки можно открывать рейс.',
            state: 'upcoming',
        },
        {
            id: 'enroute',
            title: 'В пути',
            description:
                'Контроль остановок и посадки по промежуточным точкам.',
            state: 'upcoming',
        },
        {
            id: 'arrival-finish',
            title: 'Прибытие',
            description: 'Завершение рейса и сдача смены.',
            state: 'upcoming',
        },
    ],
};

export const busDriverNextTripMock: BusDriverTrip = {
    id: 'trip-103',
    referenceNumber: 'KB-1025',
    routeLabel: 'Шымкент - Алматы',
    fromCity: 'Шымкент',
    toCity: 'Алматы',
    departureDate: '12 июня 2026',
    departureTime: '10:40',
    arrivalTime: '21:25',
    boardingWindow: '09:55 - 10:30',
    platform: 'Платформа 2',
    nextStop: 'Тараз',
    currentStatus: 'preTrip',
    passengerCapacity: 47,
    boardedPassengers: 0,
    freeSeats: 47,
    steps: [
        {
            id: 'arrival',
            title: 'Проверка автобуса',
            description: 'Осмотрите салон, багажный отсек и документы.',
            state: 'current',
        },
        {
            id: 'boarding',
            title: 'Подача на платформу',
            description: 'Подайте автобус на платформу до начала посадки.',
            state: 'upcoming',
        },
        {
            id: 'departure',
            title: 'Посадка пассажиров',
            description: 'Проверьте билеты и багаж перед отправлением.',
            state: 'upcoming',
        },
        {
            id: 'enroute',
            title: 'В пути',
            description: 'Контроль остановок по маршруту Шымкент - Алматы.',
            state: 'upcoming',
        },
        {
            id: 'arrival-finish',
            title: 'Прибытие',
            description: 'Высадка пассажиров и закрытие рейса.',
            state: 'upcoming',
        },
    ],
};

export const busDriverTripsMock: BusDriverTrip[] = [
    busDriverTripMock,
    busDriverNextTripMock,
];

export const busDriverStatsMock: BusDriverStat[] = [
    {
        id: 'checked',
        label: 'Проверено',
        value: '31',
        description: 'билетов сканировано',
        tone: 'brand',
    },
    {
        id: 'waiting',
        label: 'Ожидают',
        value: '8',
        description: 'пассажиров к посадке',
        tone: 'neutral',
    },
    {
        id: 'free-seats',
        label: 'Свободно',
        value: '8',
        description: 'мест в салоне',
        tone: 'success',
    },
    {
        id: 'next-stop',
        label: 'Следующая',
        value: 'Тараз',
        description: 'контрольная точка',
        tone: 'neutral',
    },
];

export const busPassengersMock: BusPassenger[] = [
    {
        id: 'passenger-1',
        fullName: 'Аскар Сейдахметов',
        seatNumber: '3A',
        ticketNumber: 'TK-001842',
        boardingStatus: 'boarded',
        boardingPoint: 'Алматы Сайран',
        destination: 'Шымкент',
        fareLabel: 'Стандарт',
    },
    {
        id: 'passenger-2',
        fullName: 'Алина Кожахметова',
        seatNumber: '3B',
        ticketNumber: 'TK-001843',
        boardingStatus: 'boarded',
        boardingPoint: 'Алматы Сайран',
        destination: 'Шымкент',
        fareLabel: 'Стандарт',
    },
    {
        id: 'passenger-3',
        fullName: 'Диас Темирбек',
        seatNumber: '6C',
        ticketNumber: 'TK-001851',
        boardingStatus: 'waiting',
        boardingPoint: 'Алматы Сайран',
        destination: 'Тараз',
        fareLabel: 'Комфорт',
    },
    {
        id: 'passenger-4',
        fullName: 'Мадина Жусупова',
        seatNumber: '8D',
        ticketNumber: 'TK-001857',
        boardingStatus: 'waiting',
        boardingPoint: 'Алматы Сайран',
        destination: 'Шымкент',
        fareLabel: 'Стандарт',
    },
    {
        id: 'passenger-5',
        fullName: 'Ернар Бекболат',
        seatNumber: '11A',
        ticketNumber: 'TK-001861',
        boardingStatus: 'missed',
        boardingPoint: 'Алматы Сайран',
        destination: 'Тараз',
        fareLabel: 'Стандарт',
    },
];

export const busDriverHistoryMock: BusDriverHistoryTrip[] = [
    {
        id: 'history-trip-1',
        routeLabel: 'Алматы - Шымкент',
        tripDate: '10 июня 2026',
        departureTime: '21:30',
        arrivalTime: '08:10',
        passengerCapacity: 47,
        boardedPassengers: 43,
        absentPassengers: 4,
        passengers: [
            {
                id: 'history-1-passenger-1',
                fullName: 'Аскар Сейдахметов',
                seatNumber: '3A',
                status: 'boarded',
            },
            {
                id: 'history-1-passenger-2',
                fullName: 'Алина Кожахметова',
                seatNumber: '3B',
                status: 'boarded',
            },
            {
                id: 'history-1-passenger-3',
                fullName: 'Диас Темирбек',
                seatNumber: '6C',
                status: 'boarded',
            },
            {
                id: 'history-1-passenger-4',
                fullName: 'Ернар Бекболат',
                seatNumber: '11A',
                status: 'missed',
            },
            {
                id: 'history-1-passenger-5',
                fullName: 'Гульмира Оспанова',
                seatNumber: '14C',
                status: 'missed',
            },
        ],
    },
    {
        id: 'history-trip-2',
        routeLabel: 'Шымкент - Тараз',
        tripDate: '8 июня 2026',
        departureTime: '09:10',
        arrivalTime: '13:25',
        passengerCapacity: 38,
        boardedPassengers: 31,
        absentPassengers: 7,
        passengers: [
            {
                id: 'history-2-passenger-1',
                fullName: 'Сабина Нургалиева',
                seatNumber: '2D',
                status: 'boarded',
            },
            {
                id: 'history-2-passenger-2',
                fullName: 'Нуртас Кусаинов',
                seatNumber: '5A',
                status: 'boarded',
            },
            {
                id: 'history-2-passenger-3',
                fullName: 'Айым Сейтова',
                seatNumber: '9B',
                status: 'boarded',
            },
            {
                id: 'history-2-passenger-4',
                fullName: 'Мадина Жусупова',
                seatNumber: '8D',
                status: 'missed',
            },
            {
                id: 'history-2-passenger-5',
                fullName: 'Руслан Токтаров',
                seatNumber: '12C',
                status: 'missed',
            },
        ],
    },
    {
        id: 'history-trip-3',
        routeLabel: 'Тараз - Алматы',
        tripDate: '6 июня 2026',
        departureTime: '18:40',
        arrivalTime: '23:55',
        passengerCapacity: 47,
        boardedPassengers: 45,
        absentPassengers: 2,
        passengers: [
            {
                id: 'history-3-passenger-1',
                fullName: 'Ермек Жансеитов',
                seatNumber: '1C',
                status: 'boarded',
            },
            {
                id: 'history-3-passenger-2',
                fullName: 'Айгерим Жуматаева',
                seatNumber: '4B',
                status: 'boarded',
            },
            {
                id: 'history-3-passenger-3',
                fullName: 'Данияр Абильдаев',
                seatNumber: '7A',
                status: 'boarded',
            },
            {
                id: 'history-3-passenger-4',
                fullName: 'Лаура Мухитова',
                seatNumber: '10D',
                status: 'missed',
            },
        ],
    },
];

export const busSeatRowsMock: BusSeatRow[] = [
    {
        id: 'row-1',
        rowLabel: '1',
        left: [
            { id: '1A', label: '1A', status: 'occupied' },
            { id: '1B', label: '1B', status: 'occupied' },
        ],
        right: [
            { id: '1C', label: '1C', status: 'reserved' },
            { id: '1D', label: '1D', status: 'available' },
        ],
    },
    {
        id: 'row-2',
        rowLabel: '2',
        left: [
            { id: '2A', label: '2A', status: 'occupied' },
            { id: '2B', label: '2B', status: 'occupied' },
        ],
        right: [
            { id: '2C', label: '2C', status: 'occupied' },
            { id: '2D', label: '2D', status: 'available' },
        ],
    },
    {
        id: 'row-3',
        rowLabel: '3',
        left: [
            {
                id: '3A',
                label: '3A',
                status: 'occupied',
                passengerName: 'Аскар Сейдахметов',
            },
            {
                id: '3B',
                label: '3B',
                status: 'occupied',
                passengerName: 'Алина Кожахметова',
            },
        ],
        right: [
            { id: '3C', label: '3C', status: 'available' },
            { id: '3D', label: '3D', status: 'available' },
        ],
    },
    {
        id: 'row-4',
        rowLabel: '4',
        left: [
            { id: '4A', label: '4A', status: 'available' },
            { id: '4B', label: '4B', status: 'available' },
        ],
        right: [
            { id: '4C', label: '4C', status: 'reserved' },
            { id: '4D', label: '4D', status: 'service' },
        ],
    },
    {
        id: 'row-5',
        rowLabel: '5',
        left: [
            { id: '5A', label: '5A', status: 'occupied' },
            { id: '5B', label: '5B', status: 'occupied' },
        ],
        right: [
            { id: '5C', label: '5C', status: 'occupied' },
            { id: '5D', label: '5D', status: 'occupied' },
        ],
    },
    {
        id: 'row-6',
        rowLabel: '6',
        left: [
            { id: '6A', label: '6A', status: 'available' },
            { id: '6B', label: '6B', status: 'available' },
        ],
        right: [
            {
                id: '6C',
                label: '6C',
                status: 'reserved',
                passengerName: 'Диас Темирбек',
            },
            { id: '6D', label: '6D', status: 'available' },
        ],
    },
];

export const busVehicleMock: BusVehicle = {
    id: 'vehicle-22',
    model: 'Yutong ZK6128',
    plateNumber: 'KZ 725 ABA 17',
    garageNumber: 'BUS-22',
    fleet: 'Kazbus Express',
    seatsCount: 47,
    mileage: '184 200 км',
    fuelLevel: '78%',
    nextInspectionDate: '28 июня 2026',
    operationalStatus: 'ready',
    amenities: ['Wi-Fi', 'USB', 'Кондиционер', 'Багажный отсек'],
};

export const busIssueOptionsMock: BusIssueOption[] = [
    {
        id: 'duplicate-ticket',
        title: 'Дубликат или спорный билет',
        description:
            'Если по одному месту пришли два пассажира или билет не проходит проверку.',
        helperText: 'Проверьте место и данные в списке пассажиров.',
        severity: 'warning',
    },
    {
        id: 'seat-issue',
        title: 'Проблема с местом в салоне',
        description:
            'Используйте, если кресло недоступно, занято ошибочно или требует пересадки.',
        helperText: 'При необходимости временно пересадите пассажира.',
        severity: 'normal',
    },
    {
        id: 'delay',
        title: 'Задержка или внеплановая остановка',
        description:
            'Сообщите об изменении графика отправления или длительной остановке на маршруте.',
        helperText: 'Предупредите диспетчера о новом расчетном времени.',
        severity: 'urgent',
    },
];
