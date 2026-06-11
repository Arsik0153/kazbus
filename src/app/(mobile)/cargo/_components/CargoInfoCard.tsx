import type { CargoTrip } from '../_types/cargo';

type Props = {
    trip: CargoTrip;
};

const CargoInfoCard = ({ trip }: Props) => {
    return (
        <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-[#A0A0A0]">Груз</p>
                    <p className="mt-1 text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                        {trip.cargoTitle}
                    </p>
                </div>
                <div className="rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-[6px] text-xs font-semibold text-[#E74949]">
                    {trip.referenceNumber}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Вес</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.cargoWeightTons} т
                    </p>
                </div>
                <div className="rounded-[10px] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Объем</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.cargoVolumeM3} м3
                    </p>
                </div>
            </div>

            <div className="mt-4 rounded-[10px] bg-[#F8F8F8] p-3">
                <p className="text-xs font-medium text-[#A0A0A0]">
                    Точка погрузки
                </p>
                <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                    {trip.pickupPoint}
                </p>
            </div>

            <div className="mt-3 rounded-[10px] bg-[#F8F8F8] p-3">
                <p className="text-xs font-medium text-[#A0A0A0]">
                    Точка разгрузки
                </p>
                <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                    {trip.dropoffPoint}
                </p>
            </div>
        </div>
    );
};

export default CargoInfoCard;
