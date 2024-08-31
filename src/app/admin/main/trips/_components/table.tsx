'use client';
import React, { useState } from 'react';
import Pulse from '@/components/admin/pulse';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getTripsAction } from '../action';
import Spinner from '@/components/spinner';
import { timetoReadable } from '@/utils/helper.';

const Table: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const { data, isPending } = useServerActionQuery(getTripsAction, {
        input: undefined,
        queryKey: ['getTrips'],
    });

    // Маппинг значений статусов
    const statusMap: { [key: string]: string } = {
        active: 'Рейс активен,<br />идут продажи',
        not_on_sale: 'Рейс не в<br />продаже',
        cancelled: 'Рейс отменен',
        scheduled: 'Рейс перенесен<br /> с {start_date}<br /> по {end_date}', // Шаблон строки
    };

    // Функция для получения текста статуса
    const getStatusText = (status: string, startDate?: string, endDate?: string) => {
        if (status === 'scheduled' && startDate && endDate) {
            return statusMap[status].replace('{start_date}', startDate).replace('{end_date}', endDate);
        }
        return statusMap[status] || 'Неизвестный статус';
    };

    const handleButtonClick = () => {
        setIsActive(!isActive);
        console.log('edit new-driver activated');
    };

    if (isPending) {
        return (
            <div className="flex justify-center py-11">
                <Spinner />
            </div>
        );
    }


    return (
        <table className="w-full mt-6 border-separate border-spacing-y-2">
            <thead>
                <tr className="w-full py-[10px]">
                    <th className="py-5 px-6 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Время
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Маршрут
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Проводится
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Дни
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Статус
                    </th>
                </tr>
            </thead>
            <tbody>
                {data?.map((trip) => (
                    <tr className="bg-[#F1F5F9] px-6" key={trip.id}>
                        <td className="px-6 rounded-l-[10px] text-base font-bold text-[#E74949]">
                            {timetoReadable(trip.departure_time)}                        
                        </td>
                        <td className="text-base font-bold text-[#E74949]">
                            {trip.from_city} - {trip.to_city}
                        </td>
                        <td className="text-base font-medium">
                            {trip.end_date}
                        </td>
                        <td className="text-base font-medium">
                            {trip.weekdays.Monday &&
                                trip.weekdays.Tuesday &&
                                trip.weekdays.Wednesday &&
                                trip.weekdays.Thursday &&
                                trip.weekdays.Friday &&
                                trip.weekdays.Saturday &&
                                trip.weekdays.Sunday
                                ? 'Ежедневно'
                                : <>
                                    {trip.weekdays.Monday && 'Пн '}
                                    {trip.weekdays.Tuesday && 'Вт '}
                                    {trip.weekdays.Wednesday && 'Ср '}
                                    {trip.weekdays.Thursday && 'Чт '}
                                    {trip.weekdays.Friday && 'Пт '}
                                    {trip.weekdays.Saturday && 'Сб '}
                                    {trip.weekdays.Sunday && 'Вс '}
                                </>
                            }
                        </td>
                        <td className="rounded-r-[10px] py-4 flex flex-row items-start gap-2 text-base font-semibold text-[#4A4A4A]">
                            <div className="mt-[6px]">
                                <Pulse color={trip.status === 'active' ? "#21C01E" : "#AD1013"} pulseRadius={5} />
                            </div>
                            <span dangerouslySetInnerHTML={{ __html: getStatusText(trip.status, trip.start_date, trip.end_date) }} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;
