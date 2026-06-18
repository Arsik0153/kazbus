import type {
    CargoDocument,
    CargoTrip,
    Driver,
    TripStep,
    Vehicle,
} from '../_types/cargo';

export const driverMock: Driver = {
    id: 1,
    fullName: 'Аскар Сейдахметов',
    phone: '+7 (777) 701 - 14 - 22',
    status: 'verified',
    fleet: 'Joool Cargo Almaty',
    experienceYears: 8,
    assignedVehicleId: 17,
    licenseNumber: 'KZ 044381927',
    city: 'Алматы',
};

export const vehicleMock: Vehicle = {
    id: 17,
    model: 'Volvo FH 500',
    plateNumber: '777 ABA 02',
    trailerNumber: 'TR 438 AK',
    type: 'refrigerator',
    capacityTons: 20,
    fleet: 'Joool Cargo Almaty',
    year: 2021,
};

export const activeTripMock: CargoTrip = {
    id: 4042,
    routeLabel: 'Алматы - Шымкент',
    fromCity: 'Алматы',
    toCity: 'Шымкент',
    currentStatus: 'inTransit',
    cargoTitle: 'Охлажденные продукты',
    cargoWeightTons: 14,
    cargoVolumeM3: 34,
    pickupPoint: 'Склад Joool Cargo, Северное кольцо',
    pickupAddress: 'Алматы, Северное кольцо, 28/4',
    dropoffPoint: 'РЦ Shymkent Fresh, Каратау',
    dropoffAddress: 'Шымкент, район Каратау, ул. Байдибек би, 126',
    currentPoint: 'Тараз, объездная дорога',
    distanceKm: 182,
    eta: 'Сегодня, 19:40',
    departureDate: '11 июня, 08:30',
    arrivalDate: '11 июня, 19:40',
    referenceNumber: 'JC-4042',
};

export const tripStatuses: TripStep[] = [
    {
        id: 1,
        title: 'Рейс назначен',
        description: 'Подтвержден маршрут и документы по заявке',
        status: 'planned',
        state: 'done',
    },
    {
        id: 2,
        title: 'Погрузка',
        description: 'Товар принят и закреплен в кузове',
        status: 'loading',
        state: 'done',
    },
    {
        id: 3,
        title: 'В пути',
        description: 'Транспорт следует по основному маршруту',
        status: 'inTransit',
        state: 'current',
    },
    {
        id: 4,
        title: 'Разгрузка',
        description: 'Ожидается прием товара на точке доставки',
        status: 'unloading',
        state: 'upcoming',
    },
    {
        id: 5,
        title: 'Рейс завершен',
        description: 'Подписание закрывающих документов',
        status: 'completed',
        state: 'upcoming',
    },
];

export const documentsMock: CargoDocument[] = [
    {
        id: 1,
        templateId: 'driver-license',
        title: 'Водительское удостоверение',
        number: '12AB 449212',
        expiresAt: '02.12.2027',
        status: 'valid',
        scope: 'driver',
        ownerLabel: 'Аскар Сейдахметов',
    },
    {
        id: 2,
        templateId: 'medical-certificate',
        title: 'Медицинская справка',
        number: 'MED 004218',
        expiresAt: '28.06.2026',
        status: 'expiring',
        scope: 'driver',
        ownerLabel: 'Аскар Сейдахметов',
    },
    {
        id: 3,
        templateId: 'truck-registration',
        title: 'СТС тягача',
        number: 'STS 882190',
        expiresAt: '13.09.2028',
        status: 'valid',
        scope: 'vehicle',
        ownerLabel: 'Volvo FH 500',
    },
    {
        id: 4,
        templateId: 'insurance-policy',
        title: 'Страховой полис',
        number: 'INS 110482',
        expiresAt: '01.05.2026',
        status: 'expired',
        scope: 'vehicle',
        ownerLabel: 'Volvo FH 500',
    },
];
