import OrderDetail from '../../../_prototype/order-detail';
export default function Page({ params }: { params: { orderId: string } }) {
    return <OrderDetail id={params.orderId} />;
}
