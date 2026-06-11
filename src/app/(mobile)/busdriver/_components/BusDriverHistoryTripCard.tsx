import Calendar from '@/assets/calendar';
import Clock from '@/assets/red-clock';
import { cn } from '@/utils/cn';
import type {
    BusDriverHistoryPassenger,
    BusDriverHistoryTrip,
} from '../_types/bus-driver';

const passengerStatusMeta: Record<
    BusDriverHistoryPassenger['status'],
    { badgeClassName: string; label: string }
> = {
    boarded: {
        badgeClassName: 'bg-[#F3F8EB] text-[#6A9F32]',
        label: 'Был на рейсе',
    },
    missed: {
        badgeClassName: 'bg-[#FFF3F3] text-[#D95C5C]',
        label: 'Не пришел',
    },
};

type Props = {
    trip: BusDriverHistoryTrip;
};

const BusDriverHistoryTripCard = ({ trip }: Props) => {
    const occupancyRate = Math.round(
        (trip.boardedPassengers / trip.passengerCapacity) * 100
    );
    const boardedPassengers = trip.passengers.filter(
        (passenger) => passenger.status === 'boarded'
    );
    const missedPassengers = trip.passengers.filter(
        (passenger) => passenger.status === 'missed'
    );

    return (
        <div className="rounded-[0.875rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xl font-bold leading-[1.4rem] text-[#4A4A4A]">
                        {trip.routeLabel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm font-medium text-[#A0A0A0]">
                        <div className="flex items-center gap-2">
                            <Calendar color="#E74949" width="16" height="16" />
                            <span>{trip.tripDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock color="#E74949" />
                            <span>
                                {trip.departureTime} - {trip.arrivalTime}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="rounded-full bg-[#FFF4F4] px-3 py-1.5 text-xs font-semibold text-[#E23333]">
                    {occupancyRate}% заполнено
                </div>
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-medium text-[#A0A0A0]">
                    <span>Заполненность рейса</span>
                    <span>
                        {trip.boardedPassengers} / {trip.passengerCapacity} мест
                    </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#F1F1F1]">
                    <div
                        className="h-full rounded-full bg-[#E23333]"
                        style={{ width: `${occupancyRate}%` }}
                    />
                </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-[0.75rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        На рейсе
                    </p>
                    <p className="mt-1 text-base font-bold text-[#4A4A4A]">
                        {trip.boardedPassengers}
                    </p>
                </div>
                <div className="rounded-[0.75rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Не пришли
                    </p>
                    <p className="mt-1 text-base font-bold text-[#E23333]">
                        {trip.absentPassengers}
                    </p>
                </div>
                <div className="rounded-[0.75rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Вместимость
                    </p>
                    <p className="mt-1 text-base font-bold text-[#4A4A4A]">
                        {trip.passengerCapacity}
                    </p>
                </div>
            </div>

            <div className="mt-5 space-y-4">
                <div>
                    <p className="text-sm font-semibold text-[#4A4A4A]">
                        Были на рейсе
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {boardedPassengers.map((passenger) => (
                            <div
                                key={passenger.id}
                                className="rounded-[0.75rem] border border-[#E8E8E8] bg-[#FBFBFB] px-3 py-2"
                            >
                                <p className="text-xs font-semibold text-[#4A4A4A]">
                                    {passenger.fullName}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-[0.6875rem] font-medium text-[#A0A0A0]">
                                    <span>Место {passenger.seatNumber}</span>
                                    <span
                                        className={cn(
                                            'rounded-full px-2 py-0.5',
                                            passengerStatusMeta[
                                                passenger.status
                                            ].badgeClassName
                                        )}
                                    >
                                        {
                                            passengerStatusMeta[
                                                passenger.status
                                            ].label
                                        }
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-semibold text-[#4A4A4A]">
                        Не были на рейсе
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {missedPassengers.length === 0 ? (
                            <div className="rounded-[0.75rem] bg-[#F8F8F8] px-3 py-2 text-xs font-medium text-[#A0A0A0]">
                                Все пассажиры прибыли на посадку
                            </div>
                        ) : (
                            missedPassengers.map((passenger) => (
                                <div
                                    key={passenger.id}
                                    className="rounded-[0.75rem] border border-[#F4D3D3] bg-[#FFF9F9] px-3 py-2"
                                >
                                    <p className="text-xs font-semibold text-[#4A4A4A]">
                                        {passenger.fullName}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-[0.6875rem] font-medium text-[#A0A0A0]">
                                        <span>Место {passenger.seatNumber}</span>
                                        <span
                                            className={cn(
                                                'rounded-full px-2 py-0.5',
                                                passengerStatusMeta[
                                                    passenger.status
                                                ].badgeClassName
                                            )}
                                        >
                                            {
                                                passengerStatusMeta[
                                                    passenger.status
                                                ].label
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusDriverHistoryTripCard;
