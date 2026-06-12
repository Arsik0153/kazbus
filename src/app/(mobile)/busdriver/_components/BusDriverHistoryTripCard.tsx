import Calendar from '@/assets/calendar';
import Clock from '@/assets/red-clock';
import type { BusDriverHistoryTrip } from '../_types/bus-driver';

type Props = {
    trip: BusDriverHistoryTrip;
    onClick?: () => void;
};

const BusDriverHistoryTripCard = ({ trip, onClick }: Props) => {
    const occupancyRate = Math.round(
        (trip.boardedPassengers / trip.passengerCapacity) * 100
    );

    const content = (
        <>
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
                <div className="rounded-full text-nowrap bg-[#FFF4F4] px-3 py-1.5 text-xs font-semibold text-[#E23333]">
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
                <div className="rounded-xl bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        На рейсе
                    </p>
                    <p className="mt-1 text-base font-bold text-[#4A4A4A]">
                        {trip.boardedPassengers}
                    </p>
                </div>
                <div className="rounded-xl bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Не пришли
                    </p>
                    <p className="mt-1 text-base font-bold text-[#E23333]">
                        {trip.absentPassengers}
                    </p>
                </div>
                <div className="rounded-xl bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Вместимость
                    </p>
                    <p className="mt-1 text-base font-bold text-[#4A4A4A]">
                        {trip.passengerCapacity}
                    </p>
                </div>
            </div>

            <p className="mt-4 text-sm font-medium text-[#A0A0A0]">
                Нажмите, чтобы посмотреть пассажиров и детали этого рейса.
            </p>
        </>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="w-full rounded-[0.875rem] border border-[#D1D1D1] bg-white p-5 text-left transition-colors active:bg-[#FCFCFC]"
            >
                {content}
            </button>
        );
    }

    return (
        <div className="rounded-[0.875rem] border border-[#D1D1D1] bg-white p-5">
            {content}
        </div>
    );
};

export default BusDriverHistoryTripCard;
