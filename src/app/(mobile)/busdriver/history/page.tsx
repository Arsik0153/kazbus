import DriverPage from '../_components/DriverPage';

export default function Page({ searchParams }: {
    searchParams: Promise<{ date?: string; tripId?: string; runId?: string }>;
}) {
    return <DriverPage mode="history" searchParams={searchParams} />;
}
