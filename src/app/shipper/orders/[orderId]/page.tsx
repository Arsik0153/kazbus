import OrderDetail from '../../_prototype/order-detail';
import { Suspense } from 'react';
export default async function Page({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const { orderId } = await params;
    return (
        <Suspense fallback={<div className="shipper-loading">Заказ…</div>}>
            <OrderDetail id={orderId} />
        </Suspense>
    );
}
