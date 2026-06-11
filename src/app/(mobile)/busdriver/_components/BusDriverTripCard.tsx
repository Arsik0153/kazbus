import Calendar from '@/assets/calendar';
import Clock from '@/assets/red-clock';
import RouteFill from '@/assets/route-fill';
import { cn } from '@/utils/cn';
import type { BusDriverTrip } from '../_types/bus-driver';

const tripStatusMeta: Record<
    BusDriverTrip['currentStatus'],
    { label: string; className: string }
> = {
    preTrip: {
        label: 'Подготовка',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    boarding: {
        label: 'Посадка',
        className: 'bg-[#E23333] text-white',
    },
    onRoute: {
        label: 'В пути',
        className: 'bg-[#E23333] text-white',
    },
    arriving: {
        label: 'Прибытие',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    completed: {
        label: 'Завершен',
        className: 'bg-[#7CC71C] text-white',
    },
};

type Props = {
    trip: BusDriverTrip;
};

const BusDriverTripCard = ({ trip }: Props) => {
    const status = tripStatusMeta[trip.currentStatus];

    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <RouteFill />
                        <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                            {trip.routeLabel}
                        </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                        Рейс {trip.referenceNumber}
                    </p>
                </div>
                <div
                    className={cn(
                        'leading-3.3 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
                        status.className
                    )}
                >
                    {status.label}
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Откуда</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.fromCity}
                    </p>
                    <p className="mt-1 text-xs text-[#A0A0A0]">
                        {trip.platform}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Куда</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.toCity}
                    </p>
                    <p className="mt-1 text-xs text-[#A0A0A0]">
                        Следующая точка: {trip.nextStop}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-[#4A4A4A]">
                <div className="flex items-center gap-2">
                    <Calendar color="#E74949" width="16" height="16" />
                    <span>{trip.departureDate}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock color="#E74949" />
                    <span>
                        {trip.departureTime} - {trip.arrivalTime}
                    </span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Посадка
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.boardingWindow}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        На борту
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.boardedPassengers} чел.
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Свободно
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.freeSeats} мест
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BusDriverTripCard;
