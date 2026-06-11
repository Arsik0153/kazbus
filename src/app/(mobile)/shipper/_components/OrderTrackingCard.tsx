import RouteFill from '@/assets/route-fill';
import OrderStatusBadge from './OrderStatusBadge';
import type { ShipperTracking } from '../_types/shipper';

type Props = {
    tracking: ShipperTracking;
};

const OrderTrackingCard = ({ tracking }: Props) => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-[#A0A0A0]">
                        Активная заявка
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <RouteFill />
                        <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                            {tracking.fromCity} - {tracking.toCity}
                        </p>
                    </div>
                    <p className="mt-2 text-sm text-[#A0A0A0]">
                        Заявка {tracking.orderNumber}
                    </p>
                </div>
                <OrderStatusBadge status={tracking.status} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Текущая точка
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {tracking.currentPoint}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">ETA</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {tracking.eta}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Водитель
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {tracking.driverName ?? 'Водитель пока не назначен'}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Машина</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {tracking.vehicleModel && tracking.vehiclePlate
                            ? `${tracking.vehicleModel} • ${tracking.vehiclePlate}`
                            : 'Машина пока не назначена'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingCard;
