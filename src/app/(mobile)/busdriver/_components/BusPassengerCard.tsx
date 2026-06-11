import { cn } from '@/utils/cn';
import type { BusPassenger } from '../_types/bus-driver';

const passengerStatusMeta: Record<
    BusPassenger['boardingStatus'],
    { label: string; className: string }
> = {
    boarded: {
        label: 'На борту',
        className: 'bg-[#7CC71C] text-white',
    },
    waiting: {
        label: 'Ждет посадки',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    missed: {
        label: 'Не подошел',
        className: 'bg-[#AEAEAE] text-white',
    },
};

type Props = {
    passenger: BusPassenger;
};

const BusPassengerCard = ({ passenger }: Props) => {
    const status = passengerStatusMeta[passenger.boardingStatus];

    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        {passenger.fullName}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                        Билет {passenger.ticketNumber}
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
                    <p className="text-xs font-medium text-[#A0A0A0]">Место</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {passenger.seatNumber}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Тариф</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {passenger.fareLabel}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-1 text-sm text-[#A0A0A0]">
                <p>
                    Посадка:{' '}
                    <span className="font-medium">
                        {passenger.boardingPoint}
                    </span>
                </p>
                <p>
                    Пункт прибытия:{' '}
                    <span className="font-medium">{passenger.destination}</span>
                </p>
            </div>
        </div>
    );
};

export default BusPassengerCard;
