import User from '@/assets/user';
import { cn } from '@/utils/cn';
import type {
    BusDriverProfile,
    BusDriverShiftStatus,
} from '../_types/bus-driver';

const shiftStatusMeta: Record<
    BusDriverShiftStatus,
    { label: string; className: string }
> = {
    onDuty: {
        label: 'На линии',
        className: 'bg-[#7CC71C] text-white',
    },
    break: {
        label: 'Перерыв',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    offDuty: {
        label: 'Не в смене',
        className: 'bg-[#AEAEAE] text-white',
    },
};

type Props = {
    driver: BusDriverProfile;
    assignedVehicleLabel: string;
};

const BusDriverProfileCard = ({ driver, assignedVehicleLabel }: Props) => {
    const status = shiftStatusMeta[driver.shiftStatus];

    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <User color="#E74949" width={18} height={18} />
                        <p className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                            {driver.fullName}
                        </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#E74949]">
                        {driver.phone}
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
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Табельный номер
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {driver.badgeNumber}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Стаж</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {driver.experienceYears} лет
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Категория
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {driver.licenseCategory}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Автобус
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {assignedVehicleLabel}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[0.625rem] bg-[#F8F8F8] px-4 py-3">
                <div>
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Рейтинг
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {driver.rating}
                    </p>
                </div>
                <div>
                    <p className="text-right text-xs font-medium text-[#A0A0A0]">
                        Автопарк
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {driver.fleet}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BusDriverProfileCard;
