import Link from 'next/link';
import RouteFill from '@/assets/route-fill';
import OrderStatusBadge from './OrderStatusBadge';
import { formatPrice } from '../_utils/shipper-utils';
import type { ShipperOrder } from '../_types/shipper';

type Props = {
    order: ShipperOrder;
};

const ShipperActiveOrderCard = ({ order }: Props) => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-[#A0A0A0]">
                        Активная перевозка
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <RouteFill />
                        <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                            {order.fromCity} - {order.toCity}
                        </p>
                    </div>
                    <p className="mt-2 text-sm text-[#A0A0A0]">
                        Заявка {order.orderNumber}
                    </p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Текущая точка
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {order.currentPoint}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">ETA</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {order.eta}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4A4A4A]">
                <span>{formatPrice(order.price)}</span>
                <span className="text-[#A0A0A0]">
                    {order.assignedDriverName ?? 'Ожидает назначения'}
                </span>
            </div>

            <div className="mt-4 flex gap-3">
                <Link
                    href="/shipper/tracking"
                    className="flex-1 rounded-[0.625rem] bg-[#E23333] px-4 py-4 text-center text-sm font-semibold text-white"
                >
                    Открыть трекинг
                </Link>
                <Link
                    href={`/shipper/orders/${order.id}`}
                    className="flex-1 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 py-4 text-center text-sm font-semibold text-[#4A4A4A]"
                >
                    Детали заявки
                </Link>
            </div>
        </div>
    );
};

export default ShipperActiveOrderCard;
