import Building from '@/assets/building';
import type { ShipperProfile } from '../_types/shipper';
import { shipperTypeLabel } from '../_utils/shipper-utils';

type Props = {
    profile: ShipperProfile;
    ordersCount: number;
};

const ShipperProfileCard = ({ profile, ordersCount }: Props) => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <Building color="#E74949" />
                        <p className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                            {profile.companyName}
                        </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#E74949]">
                        {profile.phone}
                    </p>
                    <p className="mt-1 text-sm text-[#A0A0A0]">
                        Контакт: {profile.name}
                    </p>
                </div>
                <span className="shrink-0 rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-1.5 text-xs font-semibold text-[#E74949]">
                    {shipperTypeLabel[profile.type]}
                </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        БИН/ИИН
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {profile.bin}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Город</p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {profile.city}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Контактное лицо
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {profile.name}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Всего заявок
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {ordersCount}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShipperProfileCard;
