import Bus from '@/assets/bus';
import { cn } from '@/utils/cn';
import type { BusVehicle } from '../_types/bus-driver';

const vehicleStatusMeta: Record<
    BusVehicle['operationalStatus'],
    { label: string; className: string }
> = {
    ready: {
        label: 'Готов к рейсу',
        className: 'bg-[#7CC71C] text-white',
    },
    inspectionSoon: {
        label: 'Осмотр скоро',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    serviceRequired: {
        label: 'Нужен сервис',
        className: 'bg-[#AEAEAE] text-white',
    },
};

type Props = {
    vehicle: BusVehicle;
};

const BusVehicleCard = ({ vehicle }: Props) => {
    const status = vehicleStatusMeta[vehicle.operationalStatus];

    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <Bus color="#E74949" />
                        <p className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                            {vehicle.model}
                        </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#E74949]">
                        {vehicle.plateNumber}
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
                        Гаражный номер
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {vehicle.garageNumber}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Автопарк
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {vehicle.fleet}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Пробег</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {vehicle.mileage}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Топливо
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {vehicle.fuelLevel}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {vehicle.amenities.map((item) => (
                    <span
                        key={item}
                        className="rounded-full border border-[#E9E9E9] bg-[#F8F8F8] px-3 py-1.5 text-xs font-semibold text-[#4A4A4A]"
                    >
                        {item}
                    </span>
                ))}
            </div>

            <p className="mt-4 text-sm text-[#A0A0A0]">
                Следующий техосмотр:{' '}
                <span className="font-medium text-[#4A4A4A]">
                    {vehicle.nextInspectionDate}
                </span>
            </p>
        </div>
    );
};

export default BusVehicleCard;
