export type BusDriverShiftStatus = 'onDuty' | 'break' | 'offDuty';

export type BusTripStatus =
    | 'preTrip'
    | 'boarding'
    | 'onRoute'
    | 'arriving'
    | 'completed';

export type BusTripStepState = 'done' | 'current' | 'upcoming';

export type PassengerBoardingStatus = 'boarded' | 'waiting' | 'missed';

export type BusSeatStatus = 'occupied' | 'available' | 'reserved' | 'service';

export type BusIssueSeverity = 'normal' | 'warning' | 'urgent';

export type BusDriverProfile = {
    id: string;
    fullName: string;
    phone: string;
    fleet: string;
    badgeNumber: string;
    licenseCategory: string;
    experienceYears: number;
    rating: string;
    shiftStatus: BusDriverShiftStatus;
};

export type BusDriverTripStep = {
    id: string;
    title: string;
    description: string;
    state: BusTripStepState;
};

export type BusDriverTrip = {
    id: string;
    referenceNumber: string;
    routeLabel: string;
    fromCity: string;
    toCity: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    boardingWindow: string;
    platform: string;
    nextStop: string;
    currentStatus: BusTripStatus;
    passengerCapacity: number;
    boardedPassengers: number;
    freeSeats: number;
    steps: BusDriverTripStep[];
};

export type BusDriverStatTone = 'neutral' | 'brand' | 'success';

export type BusDriverStat = {
    id: string;
    label: string;
    value: string;
    description: string;
    tone: BusDriverStatTone;
};

export type BusPassenger = {
    id: string;
    fullName: string;
    seatNumber: string;
    ticketNumber: string;
    boardingStatus: PassengerBoardingStatus;
    boardingPoint: string;
    destination: string;
    fareLabel: string;
};

export type BusDriverHistoryPassengerStatus = Exclude<
    PassengerBoardingStatus,
    'waiting'
>;

export type BusDriverHistoryPassenger = {
    id: string;
    fullName: string;
    seatNumber: string;
    status: BusDriverHistoryPassengerStatus;
};

export type BusDriverHistoryTrip = {
    id: string;
    routeLabel: string;
    tripDate: string;
    departureTime: string;
    arrivalTime: string;
    passengerCapacity: number;
    boardedPassengers: number;
    absentPassengers: number;
    passengers: BusDriverHistoryPassenger[];
};

export type BusSeat = {
    id: string;
    label: string;
    status: BusSeatStatus;
    passengerName?: string;
};

export type BusSeatRow = {
    id: string;
    rowLabel: string;
    left: Array<BusSeat | null>;
    right: Array<BusSeat | null>;
};

export type BusVehicleStatus = 'ready' | 'inspectionSoon' | 'serviceRequired';

export type BusVehicle = {
    id: string;
    model: string;
    plateNumber: string;
    garageNumber: string;
    fleet: string;
    seatsCount: number;
    mileage: string;
    fuelLevel: string;
    nextInspectionDate: string;
    operationalStatus: BusVehicleStatus;
    amenities: string[];
};

export type BusIssueOption = {
    id: string;
    title: string;
    description: string;
    helperText: string;
    severity: BusIssueSeverity;
};
