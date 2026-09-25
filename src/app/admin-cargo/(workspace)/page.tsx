import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Panel } from '../_components/ui';
import { loadCargoWorkspace } from '../_components/load-workspace';
import TripsPage from '../_components/trips';

export default async function OverviewPage() {
    const { state, session } = await loadCargoWorkspace();
    const waiting = state.orders.filter((order) =>
        ['waiting', 'offer'].includes(order.status)
    ).length;
    const requests = state.relations.filter(
        (relation) => relation.status === 'requested'
    ).length;
    const unassigned = state.orders.filter(
        (order) =>
            order.status === 'planned' &&
            !state.trips.some((trip) => trip.orderRecordId === order.recordId)
    ).length;
    const metrics = [
        {
            label: 'Заказы в работе',
            value: state.orders.filter((order) =>
                ['waiting', 'offer', 'planned', 'transit'].includes(
                    order.status
                )
            ).length,
            href: 'orders',
        },
        {
            label: 'Активные рейсы',
            value: state.trips.filter((trip) => trip.status !== 'completed')
                .length,
            href: 'trips',
        },
        {
            label: 'Активные водители',
            value: state.drivers.filter(
                (driver) =>
                    driver.status === 'active' &&
                    driver.account_status === 'active'
            ).length,
            href: 'drivers',
        },
        { label: 'Автомобили', value: state.vehicles.length, href: 'vehicles' },
        {
            label: 'Клиенты',
            value: state.relations.filter(
                (relation) => relation.status === 'confirmed'
            ).length,
            href: 'clients',
        },
        { label: 'Склады', value: state.warehouses.length, href: 'warehouses' },
    ];
    return (
        <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {metrics.map((metric) => (
                    <Link
                        key={metric.href}
                        href={`/admin-cargo/${metric.href}`}
                        className="rounded-[20px] bg-white p-6 transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-muted-foreground text-sm font-bold uppercase">
                                {metric.label}
                            </p>
                            <ArrowUpRight className="text-muted-foreground size-4" />
                        </div>
                        <p className="mt-3 text-3xl font-semibold text-[#E74949]">
                            {metric.value}
                        </p>
                    </Link>
                ))}
            </div>
            <div className="grid items-start gap-5 xl:grid-cols-[1.5fr_1fr]">
                <TripsPage
                    state={{
                        ...state,
                        trips: state.trips
                            .filter((trip) => trip.status !== 'completed')
                            .slice()
                            .sort((a, b) => a.eta.localeCompare(b.eta))
                            .slice(0, 5),
                    }}
                    currentUserId={session.user.id}
                />
                <Panel title="Требуют внимания">
                    {[
                        {
                            label: 'Заказы ждут предложения',
                            count: waiting,
                            href: 'orders',
                        },
                        {
                            label: 'Заказы без назначенного рейса',
                            count: unassigned,
                            href: 'orders',
                        },
                        {
                            label: 'Запросы на сотрудничество',
                            count: requests,
                            href: 'clients',
                        },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={`/admin-cargo/${item.href}`}
                            className="hover:bg-muted rounded-2xl bg-[#F8FAFC] p-4"
                        >
                            <p className="text-muted-foreground text-sm">
                                {item.label}
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[#E74949]">
                                {item.count}
                            </p>
                        </Link>
                    ))}
                    <Link
                        href="/admin-cargo/company"
                        className="text-primary text-sm hover:underline"
                    >
                        {state.company.isSearchable
                            ? 'Компания видна грузоотправителям'
                            : 'Компания скрыта от поиска. Настроить публикацию'}
                    </Link>
                </Panel>
            </div>
        </>
    );
}
