export type ShipperOrderStatus =
    | 'draft'
    | 'waitingDriver'
    | 'vehicleAssigned'
    | 'inTransit'
    | 'delivered'
    | 'cancelled';

export type ShipperVehicleType =
    | 'tent'
    | 'refrigerator'
    | 'van'
    | 'flatbed'
    | 'manipulator';

export type ShipperType = 'individual' | 'company';

export type ShipperProfile = {
    id: number;
    name: string;
    phone: string;
    type: ShipperType;
    companyName: string;
    bin: string;
    city: string;
};

export type ShipperOrder = {
    id: number;
    orderNumber: string;
    fromCity: string;
    toCity: string;
    pickupAddress: string;
    dropoffAddress: string;
    cargoTitle: string;
    cargoWeightTons: number;
    cargoVolumeM3: number;
    vehicleType: ShipperVehicleType;
    status: ShipperOrderStatus;
    price: number;
    createdAt: string;
    pickupDate: string;
    eta: string;
    assignedDriverName: string | null;
    assignedVehicleModel: string | null;
    assignedVehiclePlate: string | null;
    currentPoint: string;
    comment: string;
};

export type ShipperTracking = {
    orderId: number;
    orderNumber: string;
    status: ShipperOrderStatus;
    fromCity: string;
    toCity: string;
    currentPoint: string;
    eta: string;
    driverName: string | null;
    vehicleModel: string | null;
    vehiclePlate: string | null;
};

export type ShipperVehicleTypeOption = {
    type: ShipperVehicleType;
    label: string;
    description: string;
    highlight: string;
};
