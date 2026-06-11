import Building from '@/assets/building';
import Topbar from '@/components/topbar';
import EmptyOrdersState from '../_components/EmptyOrdersState';
import OrderTrackingCard from '../_components/OrderTrackingCard';
import { activeShipperOrderMock } from '../_data/shipper.mock';
import { buildTrackingFromOrder } from '../_utils/shipper-utils';

const ShipperTrackingPage = () => {
    const tracking = activeShipperOrderMock
        ? buildTrackingFromOrder(activeShipperOrderMock)
        : null;

    return (
        <>
            <Topbar backHref="/shipper">Трекинг</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                {!tracking ? (
                    <EmptyOrdersState
                        title="Нет активной перевозки"
                        description="Когда заявка перейдет в статус движения, здесь появится трекинг по грузу."
                        actionHref="/shipper/orders"
                        actionLabel="Открыть заявки"
                    />
                ) : (
                    <div className="flex flex-col gap-4">
                        <OrderTrackingCard tracking={tracking} />

                        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                            <div className="h-70 bg-linear-[180deg,#FFF7F7_0%,#FFFFFF_100%] flex items-center justify-center rounded-[0.625rem] border border-dashed border-[#E7B0B0] p-6 text-center">
                                <div>
                                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E23333]">
                                        <Building color="#FFFFFF" />
                                    </div>
                                    <p className="leading-5.5 mt-4 text-xl font-bold text-[#4A4A4A]">
                                        Карта движения груза
                                    </p>
                                    <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                                        Здесь будет отображаться карта и
                                        движение груза
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ShipperTrackingPage;
