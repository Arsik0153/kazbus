'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Pencil, Power } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useServerAction } from 'zsa-react';
import { Driver } from '@/data/types';
import { dateToReadable } from '@/utils/helper.';
import { Button } from '@/components/ui/button';
import { setDriverStatusAction } from '../actions';

type Props = {
    drivers: Driver[];
};

const DriversTable = ({ drivers }: Props) => {
    const queryClient = useQueryClient();
    const [confirmingDriverId, setConfirmingDriverId] = useState<number | null>(
        null
    );
    const { execute, isPending } = useServerAction(setDriverStatusAction, {
        onSuccess: async ({ data }) => {
            setConfirmingDriverId(null);
            await queryClient.invalidateQueries({ queryKey: ['getDrivers'] });
            toast.success(
                data.is_active
                    ? 'Водитель активирован'
                    : 'Водитель деактивирован'
            );
        },
        onError: ({ err }) => {
            toast.error(err.message || 'Не удалось изменить статус');
        },
    });

    return (
        <div className="mb-28 mt-[17px] overflow-hidden rounded-[20px] bg-white px-5 pb-3">
            <table className="w-full border-separate border-spacing-y-2">
                <thead>
                    <tr>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Водитель
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Дата рождения
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Удостоверение
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Статус
                        </th>
                        <th aria-label="Действия" />
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((driver) => (
                        <tr className="bg-[#F1F5F9]" key={driver.id}>
                            <td className="rounded-l-[10px] py-4 pl-6">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={
                                            driver.picture ||
                                            '/assets/admin/avatar.png'
                                        }
                                        alt=""
                                        width={40}
                                        height={40}
                                        unoptimized
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-[#4A4A4A]">
                                            {driver.full_name}
                                        </p>
                                        <p className="text-sm text-[#A0A0A0]">
                                            Рейсов: {driver.trip_count}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-[#E74949]" />
                                    <span className="font-semibold text-[#4A4A4A]">
                                        {dateToReadable(driver.date_of_birth)}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <p className="font-semibold text-[#4A4A4A]">
                                    {driver.license_number}
                                </p>
                                <p className="text-sm text-[#A0A0A0]">
                                    выдано{' '}
                                    {dateToReadable(driver.license_issue_date)}
                                </p>
                            </td>
                            <td>
                                <span
                                    className={
                                        driver.is_active
                                            ? 'inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700'
                                            : 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-600'
                                    }
                                >
                                    {driver.is_active
                                        ? 'Активен'
                                        : 'Неактивен'}
                                </span>
                            </td>
                            <td className="rounded-r-[10px] py-4 pr-6">
                                {confirmingDriverId === driver.id ? (
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                setConfirmingDriverId(null)
                                            }
                                            disabled={isPending}
                                        >
                                            Отмена
                                        </Button>
                                        <Button
                                            variant={
                                                driver.is_active
                                                    ? 'destructive'
                                                    : 'default'
                                            }
                                            onClick={() =>
                                                execute({
                                                    driverId: driver.id,
                                                    is_active:
                                                        !driver.is_active,
                                                })
                                            }
                                            disabled={isPending}
                                        >
                                            Подтвердить
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="lg"
                                        >
                                            <Link
                                                href={`/admin/main/drivers/${driver.id}/edit`}
                                            >
                                                <Pencil />
                                                Редактировать
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon-lg"
                                            aria-label={
                                                driver.is_active
                                                    ? 'Деактивировать водителя'
                                                    : 'Активировать водителя'
                                            }
                                            title={
                                                driver.is_active
                                                    ? 'Деактивировать'
                                                    : 'Активировать'
                                            }
                                            onClick={() =>
                                                setConfirmingDriverId(driver.id)
                                            }
                                        >
                                            <Power
                                                className={
                                                    driver.is_active
                                                        ? 'text-[#E74949]'
                                                        : 'text-green-600'
                                                }
                                            />
                                        </Button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DriversTable;
