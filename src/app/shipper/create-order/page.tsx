import CreateOrder from '../_prototype/create-order';
export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ batch?: string }>;
}) {
    const { batch } = await searchParams;

    return (
        <CreateOrder
            key={batch || 'new'}
            batchId={batch}
        />
    );
}
