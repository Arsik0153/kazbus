import OperationsPage, { type OperationsParams } from '../_operations/page';

export const dynamic = 'force-dynamic';

export default function Page({
    searchParams,
}: {
    searchParams: OperationsParams;
}) {
    return <OperationsPage mode="support" searchParams={searchParams} />;
}
