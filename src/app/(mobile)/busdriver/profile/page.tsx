import DriverPage from '../_components/DriverPage';

export default function Page({ searchParams }: {
    searchParams: { date?: string; tripId?: string; runId?: string };
}) {
    return <DriverPage mode="profile" searchParams={searchParams} />;
}
