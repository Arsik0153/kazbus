import Link from 'next/link';
import RouteFill from '@/assets/route-fill';
import OrderStatusBadge from './OrderStatusBadge';
import { formatPrice, getVehicleTypeLabel } from '../_utils/shipper-utils';
import type { ShipperOrder } from '../_types/shipper';

type Props = {
    order: ShipperOrder;
    href?: string;
};

const ShipperOrderCard = ({ order, href }: Props) => {
    const content = (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-[#A0A0A0]">
                        Заявка {order.orderNumber}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <RouteFill />
                        <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                            {order.fromCity} - {order.toCity}
                        </p>
                    </div>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Груз</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {order.cargoTitle}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Тип машины
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {getVehicleTypeLabel(order.vehicleType)}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4A4A4A]">
                <span>{formatPrice(order.price)}</span>
                <span className="text-[#A0A0A0]">{order.createdAt}</span>
            </div>

            <div className="mt-4 rounded-[0.625rem] bg-[#F8F8F8] p-3">
                <p className="text-xs font-medium text-[#A0A0A0]">
                    Назначенная машина
                </p>
                <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                    {order.assignedVehicleModel && order.assignedVehiclePlate
                        ? `${order.assignedVehicleModel} • ${order.assignedVehiclePlate}`
                        : 'Машина пока не назначена'}
                </p>
            </div>
        </div>
    );

    if (!href) {
        return content;
    }

    return (
        <Link
            href={href}
            className="block rounded-[0.625rem] transition-opacity active:opacity-80"
        >
            {content}
        </Link>
    );
};

export default ShipperOrderCard;
