import { cn } from '@/utils/cn';
import type { BusDriverStat } from '../_types/bus-driver';

const statToneMeta: Record<
    BusDriverStat['tone'],
    { valueClassName: string; accentClassName: string }
> = {
    neutral: {
        valueClassName: 'text-[#4A4A4A]',
        accentClassName: 'bg-[#F8F8F8]',
    },
    brand: {
        valueClassName: 'text-[#E23333]',
        accentClassName: 'bg-[#FFF2F2]',
    },
    success: {
        valueClassName: 'text-[#4A4A4A]',
        accentClassName: 'bg-[#F2FAE8]',
    },
};

type Props = {
    stat: BusDriverStat;
};

const BusDriverStatsCard = ({ stat }: Props) => {
    const tone = statToneMeta[stat.tone];

    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
            <div
                className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold text-[#A0A0A0]',
                    tone.accentClassName
                )}
            >
                {stat.label}
            </div>
            <p
                className={cn(
                    'leading-5.5 mt-3 text-xl font-bold',
                    tone.valueClassName
                )}
            >
                {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium text-[#A0A0A0]">
                {stat.description}
            </p>
        </div>
    );
};

export default BusDriverStatsCard;
