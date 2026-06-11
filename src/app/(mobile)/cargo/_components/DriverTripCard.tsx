import Calendar from '@/assets/calendar';
import Clock from '@/assets/red-clock';
import RouteFill from '@/assets/route-fill';
import { cn } from '@/utils/cn';
import type { CargoTrip } from '../_types/cargo';

const tripStatusMeta: Record<
    CargoTrip['currentStatus'],
    { label: string; className: string }
> = {
    planned: {
        label: 'Назначен',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    loading: {
        label: 'Погрузка',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    inTransit: {
        label: 'В пути',
        className: 'bg-[#E23333] text-white',
    },
    unloading: {
        label: 'Разгрузка',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    completed: {
        label: 'Завершен',
        className: 'bg-[#7CC71C] text-white',
    },
};

type Props = {
    trip: CargoTrip;
};

const DriverTripCard = ({ trip }: Props) => {
    const status = tripStatusMeta[trip.currentStatus];

    return (
        <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <RouteFill />
                        <p className="text-[16px] font-semibold leading-[17.6px] text-[#4A4A4A]">
                            {trip.routeLabel}
                        </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                        Рейс {trip.referenceNumber}
                    </p>
                </div>
                <div
                    className={cn(
                        'shrink-0 rounded-full px-3 py-[6px] text-xs font-semibold leading-[13.2px]',
                        status.className
                    )}
                >
                    {status.label}
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Откуда</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.fromCity}
                    </p>
                    <p className="mt-1 text-xs text-[#A0A0A0]">
                        {trip.pickupPoint}
                    </p>
                </div>
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Куда</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.toCity}
                    </p>
                    <p className="mt-1 text-xs text-[#A0A0A0]">
                        {trip.dropoffPoint}
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
                    <span>{trip.eta}</span>
                </div>
            </div>
        </div>
    );
};

export default DriverTripCard;
