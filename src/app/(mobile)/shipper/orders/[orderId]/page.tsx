import { notFound } from 'next/navigation';
import Topbar from '@/components/topbar';
import OrderStatusBadge from '../../_components/OrderStatusBadge';
import { shipperOrdersMock } from '../../_data/shipper.mock';
import { formatPrice, getVehicleTypeLabel } from '../../_utils/shipper-utils';

const ShipperOrderDetailsPage = ({
    params,
}: {
    params: { orderId: string };
}) => {
    const orderId = Number(params.orderId);
    const order = shipperOrdersMock.find((item) => item.id === orderId);

    if (!order) {
        notFound();
    }

    return (
        <>
            <Topbar backHref="/shipper/orders">Заявка</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-[#A0A0A0]">
                                Номер заявки
                            </p>
                            <p className="mt-2 text-[1.75rem] font-bold leading-[1.925rem] text-[#4A4A4A]">
                                {order.orderNumber}
                            </p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                            <p className="text-xs font-medium text-[#A0A0A0]">
                                Маршрут
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                {order.fromCity} - {order.toCity}
                            </p>
                        </div>
                        <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                            <p className="text-xs font-medium text-[#A0A0A0]">
                                Цена
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                {formatPrice(order.price)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-[0.625rem] bg-[#F8F8F8] p-3">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Адрес погрузки
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                            {order.pickupAddress}
                        </p>
                    </div>

                    <div className="mt-3 rounded-[0.625rem] bg-[#F8F8F8] p-3">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Адрес разгрузки
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                            {order.dropoffAddress}
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                            <p className="text-xs font-medium text-[#A0A0A0]">
                                Груз
                            </p>
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
                        <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                            <p className="text-xs font-medium text-[#A0A0A0]">
                                Вес
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                {order.cargoWeightTons} т
                            </p>
                        </div>
                        <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                            <p className="text-xs font-medium text-[#A0A0A0]">
                                Объем
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                {order.cargoVolumeM3} м3
                            </p>
                        </div>
                        <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                            <p className="text-xs font-medium text-[#A0A0A0]">
                                Подача
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                {order.pickupDate}
                            </p>
                        </div>
                        <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                            <p className="text-xs font-medium text-[#A0A0A0]">
                                ETA
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                {order.eta}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Назначение машины
                    </h2>
                    {order.assignedDriverName &&
                    order.assignedVehicleModel &&
                    order.assignedVehiclePlate ? (
                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                                <p className="text-xs font-medium text-[#A0A0A0]">
                                    Водитель
                                </p>
                                <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                    {order.assignedDriverName}
                                </p>
                            </div>
                            <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                                <p className="text-xs font-medium text-[#A0A0A0]">
                                    Машина
                                </p>
                                <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                    {order.assignedVehicleModel}
                                </p>
                                <p className="mt-1 text-xs text-[#A0A0A0]">
                                    {order.assignedVehiclePlate}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="leading-4.4 mt-4 text-sm text-[#A0A0A0]">
                            Водитель пока не назначен
                        </p>
                    )}
                </div>

                <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Комментарий
                    </h2>
                    <p className="leading-4.4 mt-3 text-sm text-[#4A4A4A]">
                        {order.comment}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ShipperOrderDetailsPage;
