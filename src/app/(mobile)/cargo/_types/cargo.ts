export type TripStatus =
    | 'planned'
    | 'loading'
    | 'inTransit'
    | 'unloading'
    | 'completed';

export type DriverStatus = 'verified' | 'pending' | 'needsUpdate';

export type DocumentStatus = 'valid' | 'expiring' | 'expired' | 'missing';

export type DocumentFormMode = 'create' | 'edit';

export type VehicleType = 'refrigerator' | 'tent' | 'van' | 'flatbed';

export type CargoShipperContactStatus =
    | 'loaded'
    | 'inTransit'
    | 'awaitingDelivery';

export type Driver = {
    id: number;
    fullName: string;
    phone: string;
    status: DriverStatus;
    fleet: string;
    experienceYears: number;
    assignedVehicleId: number;
    licenseNumber: string;
    city: string;
};

export type Vehicle = {
    id: number;
    model: string;
    plateNumber: string;
    trailerNumber: string;
    type: VehicleType;
    capacityTons: number;
    fleet: string;
    year: number;
};

export type CargoTrip = {
    id: number;
    routeLabel: string;
    fromCity: string;
    toCity: string;
    currentStatus: TripStatus;
    cargoTitle: string;
    cargoWeightTons: number;
    cargoVolumeM3: number;
    pickupPoint: string;
    pickupAddress: string;
    dropoffPoint: string;
    dropoffAddress: string;
    currentPoint: string;
    distanceKm: number;
    eta: string;
    departureDate: string;
    arrivalDate: string;
    referenceNumber: string;
};

export type CargoDocument = {
    id: number;
    templateId: string;
    title: string;
    number: string;
    expiresAt: string;
    status: DocumentStatus;
    scope: 'driver' | 'vehicle';
    ownerLabel: string;
};

export type RequiredCargoDocument = {
    id: string;
    title: string;
    description: string;
    scope: 'driver' | 'vehicle';
    ownerLabel: string;
    numberLabel: string;
    expiryLabel: string;
    helperText: string;
};

export type TripStep = {
    id: number;
    title: string;
    description: string;
    status: TripStatus;
    state: 'done' | 'current' | 'upcoming';
    orderNumber?: string;
    shipperName?: string;
    contactName?: string;
    contactPhone?: string;
    address?: string;
    timeLabel?: string;
};

export type CargoShipperContact = {
    id: number;
    orderNumber: string;
    companyName: string;
    contactName: string;
    phone: string;
    cargoTitle: string;
    pickupPoint: string;
    pickupAddress: string;
    dropoffPoint: string;
    dropoffAddress: string;
    status: CargoShipperContactStatus;
};
