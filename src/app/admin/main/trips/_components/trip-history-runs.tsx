'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CalendarDays, LayoutGrid, List, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';

import type { AdminTripRunDetails } from '../_data/trip-details';

type ViewMode = 'cards' | 'table';

type Props = {
    tripId: number;
    historyRuns: AdminTripRunDetails[];
    selectedDateIso?: string;
};

function getRunStats(historyRun: AdminTripRunDetails) {
    const boardedPassengers = historyRun.passengers.filter(
        (passenger) => passenger.status === 'boarded'
    ).length;
    const missedPassengers = historyRun.passengers.length - boardedPassengers;
    const occupancyRate =
        historyRun.passengerCapacity > 0
            ? Math.round(
                  (boardedPassengers / historyRun.passengerCapacity) * 100
              )
            : 0;

    return {
        boardedPassengers,
        missedPassengers,
        occupancyRate,
    };
}

function toDateIso(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function parseDateIso(dateIso?: string) {
    if (!dateIso) {
        return null;
    }

    const [year, month, day] = dateIso.split('-').map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day);
}

const TripHistoryRuns = ({
    tripId,
    historyRuns,
    selectedDateIso,
}: Props) => {
    const [viewMode, setViewMode] = useState<ViewMode>('cards');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedDate = parseDateIso(selectedDateIso);

    const updateDateFilter = (date: Date | null) => {
        const nextSearchParams = new URLSearchParams(searchParams.toString());

        if (date) {
            nextSearchParams.set('date', toDateIso(date));
        } else {
            nextSearchParams.delete('date');
        }

        const query = nextSearchParams.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

    const sectionAction = (
        <div className="flex flex-wrap items-center justify-end gap-3">
            <DatePicker
                value={selectedDate}
                onChange={(date) => updateDateFilter(date ?? null)}
                placeholder="Фильтр по дате"
                className="min-w-[210px]"
            />
            {selectedDate ? (
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => updateDateFilter(null)}
                >
                    <X data-icon="inline-start" />
                    Сбросить
                </Button>
            ) : null}
            <div className="flex rounded-lg border border-[#E2E8F0] bg-white p-1">
                <Button
                    type="button"
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="px-3"
                >
                    <LayoutGrid data-icon="inline-start" />
                    Карточки
                </Button>
                <Button
                    type="button"
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="px-3"
                >
                    <List data-icon="inline-start" />
                    Таблица
                </Button>
            </div>
        </div>
    );

    return (
        <AdminSectionCard
            title="Проведенные рейсы"
            description="Откройте поездку, чтобы увидеть пассажиров, статусы, выручку и происшествия."
            action={sectionAction}
        >
            {historyRuns.length === 0 ? (
                <div className="rounded-[18px] bg-[#F8FAFC] px-5 py-12 text-center">
                    <p className="text-lg font-semibold text-[#4A4A4A]">
                        {selectedDate
                            ? 'За выбранную дату рейсов нет'
                            : 'Проведенных рейсов пока нет'}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                        {selectedDate
                            ? 'Сбросьте фильтр или выберите другую дату.'
                            : 'Когда водитель начнет поездки, они появятся здесь.'}
                    </p>
                </div>
            ) : viewMode === 'cards' ? (
                <div className="grid grid-cols-3 gap-4">
                    {historyRuns.map((historyRun) => {
                        const {
                            boardedPassengers,
                            missedPassengers,
                            occupancyRate,
                        } = getRunStats(historyRun);

                        return (
                            <Link
                                key={historyRun.id}
                                href={`/admin/main/trips/${tripId}/history/${historyRun.id}`}
                                className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5 duration-150 hover:border-[#E74949] hover:bg-white"
                            >
                                <CalendarDays className="text-[#E74949]" />
                                <p className="mt-4 text-xl font-semibold text-[#4A4A4A]">
                                    {historyRun.tripDate}
                                </p>
                                <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                    {historyRun.departureTime} -{' '}
                                    {historyRun.arrivalTime}
                                </p>
                                <div className="mt-5 grid grid-cols-3 gap-2">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                                            На рейсе
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-[#4A4A4A]">
                                            {boardedPassengers}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                                            Не пришли
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-[#E74949]">
                                            {missedPassengers}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                                            Загрузка
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-[#4A4A4A]">
                                            {occupancyRate}%
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="overflow-hidden rounded-[18px] border border-[#E2E8F0]">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-[#F8FAFC]">
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Дата
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Время
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    На рейсе
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Не пришли
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Загрузка
                                </th>
                                <th aria-label="Действия" />
                            </tr>
                        </thead>
                        <tbody>
                            {historyRuns.map((historyRun) => {
                                const {
                                    boardedPassengers,
                                    missedPassengers,
                                    occupancyRate,
                                } = getRunStats(historyRun);

                                return (
                                    <tr
                                        key={historyRun.id}
                                        className="border-t border-[#EEF2F6]"
                                    >
                                        <td className="px-5 py-4 font-semibold text-[#4A4A4A]">
                                            {historyRun.tripDate}
                                        </td>
                                        <td className="px-5 py-4 text-[#4A4A4A]">
                                            {historyRun.departureTime} -{' '}
                                            {historyRun.arrivalTime}
                                        </td>
                                        <td className="px-5 py-4 text-[#4A4A4A]">
                                            {boardedPassengers}
                                        </td>
                                        <td className="px-5 py-4 text-[#E74949]">
                                            {missedPassengers}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={cn(
                                                    'inline-flex rounded-full px-3 py-1 text-sm font-semibold',
                                                    occupancyRate >= 85
                                                        ? 'bg-[#F3F8EB] text-[#6A9F32]'
                                                        : 'bg-[#FFF7E6] text-[#B7791F]'
                                                )}
                                            >
                                                {occupancyRate}%
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Button asChild variant="outline">
                                                <Link
                                                    href={`/admin/main/trips/${tripId}/history/${historyRun.id}`}
                                                >
                                                    Подробнее
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminSectionCard>
    );
};

export default TripHistoryRuns;
