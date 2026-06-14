'use client';

import Link from 'next/link';

import Pulse from '@/components/admin/pulse';
import { Button } from '@/components/ui/button';
import { Trips } from '@/data/types';

type Props = {
    trips: Trips[];
};

const statusMap: Record<string, string> = {
    active: 'Рейс активен, идут продажи',
    not_on_sale: 'Рейс не в продаже',
    cancelled: 'Рейс отменен',
    scheduled: 'Рейс перенесен',
};

const renderWeekdays = (weekdays: Trips['weekdays']) => {
    if (
        weekdays.Monday &&
        weekdays.Tuesday &&
        weekdays.Wednesday &&
        weekdays.Thursday &&
        weekdays.Friday &&
        weekdays.Saturday &&
        weekdays.Sunday
    ) {
        return 'Ежедневно';
    }

    return [
        weekdays.Monday && 'Пн',
        weekdays.Tuesday && 'Вт',
        weekdays.Wednesday && 'Ср',
        weekdays.Thursday && 'Чт',
        weekdays.Friday && 'Пт',
        weekdays.Saturday && 'Сб',
        weekdays.Sunday && 'Вс',
    ]
        .filter(Boolean)
        .join(' ');
};

const TripsTable = ({ trips }: Props) => {
    return (
        <div className="mb-20 mt-4 overflow-hidden rounded-[20px] bg-white px-5 pb-3">
            <table className="w-full border-separate border-spacing-y-2">
                <thead>
                    <tr>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Время
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Маршрут
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Период
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Дни
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Статус
                        </th>
                        <th aria-label="Действия" />
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip) => (
                        <tr className="bg-[#F1F5F9]" key={trip.id}>
                            <td className="rounded-l-[10px] py-4 pl-6 font-bold text-[#E74949]">
                                {trip.departure_time}
                            </td>
                            <td className="font-semibold text-[#4A4A4A]">
                                {trip.from_city} - {trip.to_city}
                            </td>
                            <td className="text-[#4A4A4A]">
                                {trip.start_date} - {trip.end_date}
                            </td>
                            <td className="text-[#4A4A4A]">
                                {renderWeekdays(trip.weekdays)}
                            </td>
                            <td className="rounded-r-[10px] py-4 pr-6">
                                <div className="flex items-center gap-2 font-semibold text-[#4A4A4A]">
                                    <Pulse
                                        color={
                                            trip.status === 'active'
                                                ? '#21C01E'
                                                : '#AD1013'
                                        }
                                        pulseRadius={5}
                                    />
                                    <span>
                                        {statusMap[trip.status] ||
                                            'Неизвестный статус'}
                                    </span>
                                </div>
                            </td>
                            <td className="py-4 pr-6 text-right">
                                <Button asChild variant="outline">
                                    <Link
                                        href={`/admin/main/trips/${trip.id}/passengers`}
                                    >
                                        Пассажиры
                                    </Link>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TripsTable;
