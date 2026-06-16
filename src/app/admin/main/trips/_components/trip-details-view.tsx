import Link from 'next/link';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Circle,
    History,
    WalletCards,
} from 'lucide-react';

import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';
import type { Trips } from '@/data/types';
import { cn } from '@/lib/utils';

import type {
    AdminTripPassengerStatus,
    AdminTripRunDetails,
    AdminTripSummary,
    AdminTripStepState,
} from '../_data/trip-details';

type Props = {
    trip: Trips;
    run: AdminTripRunDetails;
    historyRuns: AdminTripRunDetails[];
    summary: AdminTripSummary;
    mode: 'current' | 'history';
};

const passengerStatusMeta: Record<
    AdminTripPassengerStatus,
    { label: string; className: string }
> = {
    boarded: {
        label: 'На рейсе',
        className: 'bg-[#F3F8EB] text-[#6A9F32]',
    },
    waiting: {
        label: 'Не пришел',
        className: 'bg-[#FFF7E6] text-[#B7791F]',
    },
    missed: {
        label: 'Не пришел',
        className: 'bg-[#FFF3F3] text-[#D95C5C]',
    },
};

const stepStateMeta: Record<
    AdminTripStepState,
    { className: string; iconClassName: string }
> = {
    done: {
        className: 'border-[#CFE8C5] bg-[#F7FBF4]',
        iconClassName: 'text-[#6A9F32]',
    },
    current: {
        className: 'border-[#F4C7C7] bg-[#FFF8F8]',
        iconClassName: 'text-[#E74949]',
    },
    upcoming: {
        className: 'border-[#E2E8F0] bg-[#F8FAFC]',
        iconClassName: 'text-[#A0A0A0]',
    },
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('ru-KZ', {
        style: 'currency',
        currency: 'KZT',
        maximumFractionDigits: 0,
    }).format(value);
}

function getBoardedPassengers(run: AdminTripRunDetails) {
    return run.passengers.filter((passenger) => passenger.status === 'boarded');
}

function getMissingPassengers(run: AdminTripRunDetails) {
    return run.passengers.filter((passenger) => passenger.status !== 'boarded');
}

const TripDetailsView = ({ trip, run, summary, mode }: Props) => {
    const boardedPassengers = getBoardedPassengers(run);
    const missingPassengers = getMissingPassengers(run);
    const averageOccupancy = summary.average_occupancy;
    const totalRevenue = Number(summary.revenue) || 0;

    const metrics = [
        {
            label: 'Общее число пассажиров',
            value: String(summary.total_passengers),
            hint:
                mode === 'current'
                    ? 'по всем поездкам рейса'
                    : 'по истории этого рейса',
        },
        {
            label: 'Средняя загруженность автобуса',
            value: `${averageOccupancy}%`,
            hint: 'по истории этого рейса',
        },
        {
            label: 'Общий доход',
            value: formatCurrency(totalRevenue),
            hint: 'по завершенным поездкам',
        },
    ];

    return (
        <div className="mt-6 flex flex-col gap-5 pb-20">
            <div className="rounded-[20px] bg-white px-8 py-8">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild variant="outline">
                                <Link
                                    href={
                                        mode === 'current'
                                            ? '/admin/main/trips'
                                            : `/admin/main/trips/${trip.id}/history`
                                    }
                                >
                                    <ArrowLeft data-icon="inline-start" />
                                    Назад
                                </Link>
                            </Button>
                            <p className="rounded-full bg-[#FFF4F4] px-4 py-2 text-sm font-semibold text-[#E74949]">
                                {mode === 'current'
                                    ? 'Текущий рейс'
                                    : 'Завершенный рейс'}
                            </p>
                        </div>
                        <h1 className="mt-5 text-[42px] font-semibold leading-tight text-[#4A4A4A]">
                            {run.routeLabel}
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            {run.tripDate}, {run.departureTime} -{' '}
                            {run.arrivalTime || 'не указано'}. Автобус:{' '}
                            {trip.bus?.state_number || 'не назначен'}. Водитель:{' '}
                            {trip.driver?.full_name || 'не назначен'}.
                        </p>
                    </div>
                    {mode === 'current' ? (
                        <Button asChild size="lg" className="py-2! px-6">
                            <Link href={`/admin/main/trips/${trip.id}/history`}>
                                <History />
                                История
                            </Link>
                        </Button>
                    ) : null}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-[20px] bg-white px-6 py-6"
                    >
                        <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                            {metric.label}
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-[#E74949]">
                            {metric.value}
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            {metric.hint}
                        </p>
                    </div>
                ))}
            </div>

            <AdminSectionCard
                title={mode === 'current' ? 'Сейчас' : 'Итог поездки'}
            >
                <div className="grid grid-cols-[1.2fr_1fr] gap-4">
                    <div className="rounded-[18px] bg-[#F8FAFC] px-5 py-5">
                        <p className="mt-3 text-2xl font-semibold text-[#4A4A4A]">
                            Пассажиров: {boardedPassengers.length}
                        </p>
                        <p className="mt-2 text-base font-medium text-[#A0A0A0]">
                            Ещё не пришли: {missingPassengers.length}
                        </p>
                    </div>
                    <div className="rounded-[18px] bg-[#FFF8F8] px-5 py-5">
                        <WalletCards className="text-[#E74949]" />
                        <p className="mt-3 text-sm font-bold uppercase text-[#A0A0A0]">
                            Выручка
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#4A4A4A]">
                            {formatCurrency(
                                run.passengers.length *
                                    (Number(trip.ticket_price) || 0)
                            )}
                        </p>
                    </div>
                </div>
            </AdminSectionCard>

            <AdminSectionCard title="Пассажиры">
                <div className="overflow-hidden rounded-[18px] border border-[#E2E8F0]">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-[#F8FAFC]">
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Пассажир
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Билет
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Маршрут
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Место
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Статус
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {run.passengers.map((passenger) => {
                                const status =
                                    passengerStatusMeta[passenger.status];

                                return (
                                    <tr
                                        key={passenger.id}
                                        className="border-t border-[#EEF2F6]"
                                    >
                                        <td className="px-5 py-4 font-semibold text-[#4A4A4A]">
                                            {passenger.fullName}
                                            <p className="mt-1 text-xs font-medium text-[#A0A0A0]">
                                                {passenger.fareLabel}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-[#4A4A4A]">
                                            {passenger.ticketNumber}
                                        </td>
                                        <td className="px-5 py-4 text-[#4A4A4A]">
                                            {passenger.boardingPoint} -{' '}
                                            {passenger.destination}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-[#4A4A4A]">
                                            {passenger.seatNumber}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={cn(
                                                    'inline-flex rounded-full px-3 py-1 text-sm font-semibold',
                                                    status.className
                                                )}
                                            >
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </AdminSectionCard>

            <AdminSectionCard title="Статусы текущей поездки">
                <div className="grid grid-cols-5 gap-3">
                    {run.steps.map((step) => {
                        const meta = stepStateMeta[step.state];
                        const Icon =
                            step.state === 'done' ? CheckCircle2 : Circle;

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    'rounded-[18px] border px-4 py-4',
                                    meta.className
                                )}
                            >
                                <Icon className={meta.iconClassName} />
                                <p className="mt-3 text-base font-semibold text-[#4A4A4A]">
                                    {step.title}
                                </p>
                                <p className="mt-2 text-xs font-medium leading-5 text-[#A0A0A0]">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </AdminSectionCard>

            <AdminSectionCard
                title="Происшествия"
                description="Комментарии водителя по внештатным ситуациям рейса."
            >
                {run.incidents.length === 0 ? (
                    <div className="rounded-[18px] bg-[#F7FBF4] px-5 py-5">
                        <p className="text-lg font-semibold text-[#4A4A4A]">
                            Поездка выдалась без происшествий
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            Водитель не добавлял комментарии по внештатным
                            ситуациям.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {run.incidents.map((incident) => (
                            <div
                                key={incident.id}
                                className="rounded-[18px] border border-[#F4C7C7] bg-[#FFF8F8] px-5 py-5"
                            >
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="mt-1 text-[#E74949]" />
                                    <div>
                                        <p className="text-lg font-semibold text-[#4A4A4A]">
                                            {incident.title}
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-[#4A4A4A]">
                                            {incident.comment}
                                        </p>
                                        <p className="mt-3 text-xs font-semibold text-[#A0A0A0]">
                                            {incident.driverName},{' '}
                                            {incident.createdAt}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AdminSectionCard>
        </div>
    );
};

export default TripDetailsView;
