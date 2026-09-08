import CreateOrder from '../_prototype/create-order';
export default function Page({
    searchParams,
}: {
    searchParams: { batch?: string };
}) {
    return (
        <CreateOrder
            key={searchParams.batch || 'new'}
            batchId={searchParams.batch}
        />
    );
}
