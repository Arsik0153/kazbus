import User from '@/assets/user';
import { cn } from '@/utils/cn';
import type { Driver, DriverStatus } from '../_types/cargo';

const driverStatusMeta: Record<
    DriverStatus,
    { label: string; className: string }
> = {
    verified: {
        label: 'Верифицирован',
        className: 'bg-[#7CC71C] text-white',
    },
    pending: {
        label: 'На проверке',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    needsUpdate: {
        label: 'Требует обновления',
        className: 'bg-[#AEAEAE] text-white',
    },
};

type Props = {
    driver: Driver;
    assignedVehicleLabel: string;
};

const DriverProfileCard = ({ driver, assignedVehicleLabel }: Props) => {
    const status = driverStatusMeta[driver.status];

    return (
        <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <User color="#E74949" width={18} height={18} />
                        <p className="text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                            {driver.fullName}
                        </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#E74949]">
                        {driver.phone}
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
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Автопарк
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {driver.fleet}
                    </p>
                </div>
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Стаж</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {driver.experienceYears} лет
                    </p>
                </div>
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Удостоверение
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {driver.licenseNumber}
                    </p>
                </div>
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Машина</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {assignedVehicleLabel}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DriverProfileCard;
