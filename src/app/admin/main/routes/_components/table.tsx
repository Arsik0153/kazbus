'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useServerAction } from 'zsa-react';

import Arrow from '@/assets/admin/Arrow';
import Calendar from '@/assets/admin/Calendar';
import Clock from '@/assets/admin/Clock';
import { Button } from '@/components/ui/button';
import { Routes } from '@/data/types';
import { dateTimeToReadable } from '@/utils/helper.';

import { deleteRouteAction } from '../action';

type Props = {
    routes: Routes[];
};

const RoutesTable = ({ routes }: Props) => {
    const queryClient = useQueryClient();
    const { execute: deleteRoute, isPending: isDeleting } = useServerAction(
        deleteRouteAction,
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['getRoutes'],
                });
                toast.success('Маршрут удален');
            },
            onError: ({ err }) => {
                toast.error(err.message || 'Не удалось удалить маршрут');
            },
        }
    );

    const handleDelete = (route: Routes) => {
        const confirmed = window.confirm(
            `Удалить маршрут ${route.start_city.name} - ${route.end_city.name}?`
        );

        if (confirmed) {
            deleteRoute({ routeId: route.id });
        }
    };

    return (
        <div className="mb-28 mt-[17px] overflow-hidden rounded-[20px] bg-white px-5 pb-3">
            <table className="w-full border-separate border-spacing-y-2">
                <thead>
                    <tr>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Маршрут
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Остановки
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Время в пути
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Создан
                        </th>
                        <th aria-label="Действия" />
                    </tr>
                </thead>
                <tbody>
                    {routes.map((route) => (
                        <tr className="bg-[#F1F5F9]" key={route.id}>
                            <td className="rounded-l-[10px] py-4 pl-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E74949] text-lg text-white">
                                        A
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-medium text-[#4A4A4A]">
                                            {route.start_city.name}
                                        </p>
                                        <Arrow
                                            color="#4A4A4A"
                                            width={26}
                                            height={0}
                                        />
                                        <p className="font-medium text-[#4A4A4A]">
                                            {route.end_city.name}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className="font-semibold text-[#4A4A4A]">
                                    {route.stops.length}
                                </p>
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <Clock
                                        color="#E74949"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="font-semibold text-[#E74949]">
                                        {route.total_travel_time}
                                    </p>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        color="#E74949"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="font-semibold text-[#4A4A4A]">
                                        {dateTimeToReadable(route.created_at)}
                                    </p>
                                </div>
                            </td>
                            <td className="rounded-r-[10px] py-4 pr-6 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button asChild variant="outline">
                                        <Link
                                            href={`/admin/main/routes/${route.id}/edit`}
                                        >
                                            <Edit />
                                            Редактировать
                                        </Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        disabled={isDeleting}
                                        onClick={() => handleDelete(route)}
                                    >
                                        <Trash2 />
                                        Удалить
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoutesTable;
