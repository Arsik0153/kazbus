import Menu from '@/components/menu';
import Topbar from '@/components/topbar';
import DriverProfileCard from '../_components/DriverProfileCard';
import VehicleCard from '../_components/VehicleCard';
import { driverMock, vehicleMock } from '../_data/cargo-driver.mock';

const CargoProfilePage = () => {
    return (
        <>
            <Topbar backHref="/cargo">Профиль</Topbar>
            <div className="min-h-full bg-[var(--gray)] px-5 pb-28 pt-5">
                <DriverProfileCard
                    driver={driverMock}
                    assignedVehicleLabel={`${vehicleMock.model} • ${vehicleMock.plateNumber}`}
                />

                <div className="mt-4">
                    <VehicleCard vehicle={vehicleMock} />
                </div>

                <div className="mt-4 rounded-[10px] border border-[#D1D1D1] bg-white px-4 pt-5">
                    <h2 className="pb-4 text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                        Настройки
                    </h2>
                    <Menu link="#" text="Уведомления" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="#" text="Язык приложения" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="#" text="Выйти" />
                </div>
            </div>
        </>
    );
};

export default CargoProfilePage;
