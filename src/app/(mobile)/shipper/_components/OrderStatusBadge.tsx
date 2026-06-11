import { cn } from '@/utils/cn';
import { shipperOrderStatusMeta } from '../_utils/shipper-utils';
import type { ShipperOrderStatus } from '../_types/shipper';

type Props = {
    status: ShipperOrderStatus;
};

const OrderStatusBadge = ({ status }: Props) => {
    const statusMeta = shipperOrderStatusMeta[status];

    return (
        <span
            className={cn(
                'leading-3.3 inline-flex shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
                statusMeta.className
            )}
        >
            {statusMeta.label}
        </span>
    );
};

export default OrderStatusBadge;
