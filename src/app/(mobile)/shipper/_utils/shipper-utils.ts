import { shipperVehicleTypesMock } from '../_data/shipper.mock';
import type {
    ShipperOrder,
    ShipperOrderStatus,
    ShipperTracking,
    ShipperType,
    ShipperVehicleType,
} from '../_types/shipper';

export const shipperOrderStatusMeta: Record<
    ShipperOrderStatus,
    { label: string; className: string }
> = {
    draft: {
        label: 'Черновик',
        className: 'border border-[#D1D1D1] bg-[#F8F8F8] text-[#A0A0A0]',
    },
    waitingDriver: {
        label: 'Ожидает водителя',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    vehicleAssigned: {
        label: 'Машина назначена',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    inTransit: {
        label: 'В пути',
        className: 'bg-[#E23333] text-white',
    },
    delivered: {
        label: 'Доставлено',
        className: 'bg-[#7CC71C] text-white',
    },
    cancelled: {
        label: 'Отменено',
        className: 'bg-[#AEAEAE] text-white',
    },
};

export const shipperTypeLabel: Record<ShipperType, string> = {
    individual: 'Физлицо',
    company: 'Компания',
};

export const formatPrice = (price: number) =>
    `${new Intl.NumberFormat('ru-RU').format(price)} тг`;

export const getVehicleTypeOption = (type: ShipperVehicleType) =>
    shipperVehicleTypesMock.find(
        (vehicleOption) => vehicleOption.type === type
    );

export const getVehicleTypeLabel = (type: ShipperVehicleType) =>
    getVehicleTypeOption(type)?.label ?? 'Тип не указан';

export const buildTrackingFromOrder = (
    order: ShipperOrder
): ShipperTracking => ({
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    fromCity: order.fromCity,
    toCity: order.toCity,
    currentPoint: order.currentPoint,
    eta: order.eta,
    driverName: order.assignedDriverName,
    vehicleModel: order.assignedVehicleModel,
    vehiclePlate: order.assignedVehiclePlate,
});
