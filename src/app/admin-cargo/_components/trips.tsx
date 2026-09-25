import { formatCargoDate } from '@/lib/cargo-validation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Panel, type CargoPageProps } from './ui';

const tripStatusNames = {
    planned: 'Запланирован',
    loading: 'Погрузка',
    in_transit: 'В пути',
    unloading: 'Разгрузка',
    completed: 'Завершен',
};

export default function TripsPage({ state }: CargoPageProps) {
    return (
        <Panel title={`Рейсы · ${state.trips.length}`}>
            {!state.trips.length ? (
                <div className="flex flex-col items-start gap-4">
                    <p className="text-muted-foreground">
                        Назначенных рейсов пока нет. Выберите согласованный
                        заказ и назначьте водителя и машину.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/admin-cargo/orders">
                            Перейти к заказам
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
                    <table className="w-full text-left text-sm">
                        <thead className="text-muted-foreground bg-[#F8FAFC]">
                            <tr>
                                {[
                                    'Заказ и маршрут',
                                    'Водитель',
                                    'Машина',
                                    'Доставка',
                                    'Статус',
                                ].map((label) => (
                                    <th
                                        key={label}
                                        className="px-4 py-3 font-semibold"
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {state.trips.map((trip) => {
                                const order = state.orders.find(
                                    (item) =>
                                        item.recordId === trip.orderRecordId
                                );
                                const driver = state.drivers.find(
                                    (item) => item.id === trip.driverId
                                );
                                const vehicle = state.vehicles.find(
                                    (item) => item.id === trip.vehicleId
                                );
                                return (
                                    <tr
                                        key={trip.id}
                                        className="border-t border-[#EEF2F6]"
                                    >
                                        <td className="px-4 py-4">
                                            <Link
                                                href={`/admin-cargo/orders#order-${trip.orderRecordId}`}
                                                className="text-primary font-semibold hover:underline"
                                            >
                                                {trip.orderId}
                                            </Link>
                                            {order && (
                                                <p className="mt-1">
                                                    {order.from} → {order.to}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {driver?.full_name ?? 'Не указан'}
                                        </td>
                                        <td className="px-4 py-4">
                                            {vehicle
                                                ? `${vehicle.model} · ${vehicle.plate_number}`
                                                : 'Не указана'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {formatCargoDate(trip.eta)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="bg-muted rounded-lg px-3 py-1 font-medium whitespace-nowrap">
                                                {tripStatusNames[trip.status]}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </Panel>
    );
}
