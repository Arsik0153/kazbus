import OrderDetail from '../../_prototype/order-detail';
import { Suspense } from 'react';
export default function Page({ params }: { params: { orderId: string } }) {
    return (
        <Suspense fallback={<div className="shipper-loading">Заказ…</div>}>
            <OrderDetail id={params.orderId} />
        </Suspense>
    );
}
