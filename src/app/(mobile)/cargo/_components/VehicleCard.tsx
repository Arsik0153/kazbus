import type { Vehicle, VehicleType } from '../_types/cargo';

const vehicleTypeLabel: Record<VehicleType, string> = {
    refrigerator: 'Рефрижератор',
    tent: 'Тент',
    van: 'Фургон',
    flatbed: 'Платформа',
};

type Props = {
    vehicle: Vehicle;
};

const VehicleCard = ({ vehicle }: Props) => {
    return (
        <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-[#A0A0A0]">
                        Закрепленная машина
                    </p>
                    <p className="mt-1 text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                        {vehicle.model}
                    </p>
                </div>
                <div className="rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-[6px] text-xs font-semibold text-[#E74949]">
                    {vehicleTypeLabel[vehicle.type]}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Госномер
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {vehicle.plateNumber}
                    </p>
                </div>
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Прицеп</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {vehicle.trailerNumber}
                    </p>
                </div>
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Грузоподъемность
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {vehicle.capacityTons} т
                    </p>
                </div>
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Автопарк
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {vehicle.fleet}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
