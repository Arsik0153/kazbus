import Menu from '@/components/menu';
import BusDriverProfileCard from '../_components/BusDriverProfileCard';
import { busDriverProfileMock, busVehicleMock } from '../_data/bus-driver.mock';
import Link from 'next/link';
import BusDriverLogoutMenu from '../_components/BusDriverLogoutMenu';

const BusDriverProfilePage = () => {
    return (
        <div className="bg-(--gray) pt-18.75 min-h-full px-5 pb-28">
            <h1 className="text-[2.625rem] font-semibold leading-[2.8875rem] tracking-[-0.03em] text-[#4A4A4A]">
                Профиль
            </h1>

            <div className="mt-4">
                <BusDriverProfileCard
                    driver={busDriverProfileMock}
                    assignedVehicleLabel={busVehicleMock.model}
                />
            </div>

            <div className="mt-5 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 pt-5">
                <h2 className="leading-5.5 pb-4 text-xl font-bold text-[#4A4A4A]">
                    Рабочее меню
                </h2>
                <Menu link="/busdriver/vehicle" text="Закрепленный автобус" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/busdriver/issues" text="Нештатные ситуации" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <BusDriverLogoutMenu />
            </div>

            <div className="mt-5 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <p className="text-sm font-medium text-[#A0A0A0]">Диспетчер</p>
                <p className="leading-5.5 mt-2 text-xl font-bold text-[#4A4A4A]">
                    Смена Южный маршрут
                </p>
                <Link className="pt-3 text-sm font-medium text-[#E74949]" href="tel:+77018882010">
                    +7 701 888 20 10
                </Link>
            </div>
        </div>
    );
};

export default BusDriverProfilePage;
