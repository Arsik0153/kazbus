import Topbar from '@/components/topbar';
import EmptyOrdersState from '../_components/EmptyOrdersState';
import ShipperOrderCard from '../_components/ShipperOrderCard';
import { shipperOrdersMock } from '../_data/shipper.mock';

const ShipperOrdersPage = () => {
    return (
        <>
            <Topbar backHref="/shipper">Заявки</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                {shipperOrdersMock.length === 0 ? (
                    <EmptyOrdersState />
                ) : (
                    <div className="flex flex-col gap-3">
                        {shipperOrdersMock.map((order) => (
                            <ShipperOrderCard
                                key={order.id}
                                order={order}
                                href={`/shipper/orders/${order.id}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ShipperOrdersPage;
