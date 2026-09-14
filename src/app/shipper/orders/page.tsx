import { Suspense } from 'react';
import Orders from '../_prototype/orders';

export default function Page() {
    return (
        <Suspense fallback={<div className="shipper-loading">Заказы…</div>}>
            <Orders />
        </Suspense>
    );
}
