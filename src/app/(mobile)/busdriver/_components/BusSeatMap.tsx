import { cn } from '@/utils/cn';
import type { BusSeat, BusSeatRow, BusSeatStatus } from '../_types/bus-driver';

const seatStatusMeta: Record<
    BusSeatStatus,
    { label: string; className: string }
> = {
    occupied: {
        label: 'Занято',
        className: 'border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    available: {
        label: 'Свободно',
        className: 'border-[#D1D1D1] bg-white text-[#A0A0A0]',
    },
    reserved: {
        label: 'Резерв',
        className: 'border-[#D4E8B6] bg-[#F2FAE8] text-[#6BA916]',
    },
    service: {
        label: 'Служебное',
        className: 'border-[#E1E1E1] bg-[#F3F3F3] text-[#8D8D8D]',
    },
};

type Props = {
    rows: BusSeatRow[];
};

const renderSeatCell = (seat: BusSeat | null, key: string) => {
    if (!seat) {
        return <div key={key} className="aspect-square" />;
    }

    const meta = seatStatusMeta[seat.status];

    return (
        <div
            key={key}
            className={cn(
                'flex aspect-square flex-col items-center justify-center rounded-[0.625rem] border px-1 text-center',
                meta.className
            )}
            title={seat.passengerName || meta.label}
        >
            <span className="text-xs font-semibold leading-3">
                {seat.label}
            </span>
            {seat.passengerName && (
                <span className="mt-1 line-clamp-2 text-[0.5625rem] leading-[0.6875rem]">
                    {seat.passengerName}
                </span>
            )}
        </div>
    );
};

const BusSeatMap = ({ rows }: Props) => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Схема салона
                    </h2>
                    <p className="mt-2 text-sm text-[#A0A0A0]">
                        Свободные, занятые и резервные места по текущему рейсу.
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] px-3 py-2 text-xs font-semibold text-[#4A4A4A]">
                    Водитель
                </div>
            </div>

            <div className="mt-5 rounded-[0.625rem] bg-[#FAFAFA] p-4">
                <div className="mb-4 flex justify-end">
                    <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 py-2 text-xs font-semibold text-[#4A4A4A]">
                        Кабина
                    </div>
                </div>

                <div className="flex flex-col gap-2.5">
                    {rows.map((row) => (
                        <div
                            key={row.id}
                            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_1.75rem_minmax(0,1fr)_minmax(0,1fr)] gap-2"
                        >
                            {row.left.map((seat, index) =>
                                renderSeatCell(seat, `${row.id}-left-${index}`)
                            )}
                            <div className="flex items-center justify-center text-xs font-medium text-[#A0A0A0]">
                                {row.rowLabel}
                            </div>
                            {row.right.map((seat, index) =>
                                renderSeatCell(seat, `${row.id}-right-${index}`)
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                {Object.values(seatStatusMeta).map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-2 rounded-[0.625rem] bg-[#F8F8F8] px-3 py-2"
                    >
                        <div
                            className={cn(
                                'h-3.5 w-3.5 rounded-full border',
                                item.className
                            )}
                        />
                        <span className="text-xs font-medium text-[#4A4A4A]">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusSeatMap;
