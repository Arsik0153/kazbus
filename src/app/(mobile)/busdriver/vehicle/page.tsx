import Menu from '@/components/menu';
import Topbar from '@/components/topbar';
import BusVehicleCard from '../_components/BusVehicleCard';
import { busVehicleMock } from '../_data/bus-driver.mock';

const BusDriverVehiclePage = () => {
    return (
        <>
            <Topbar backHref="/busdriver/trip">Автобус</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <BusVehicleCard vehicle={busVehicleMock} />

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Мест
                        </p>
                        <p className="leading-5.5 mt-2 text-xl font-bold text-[#4A4A4A]">
                            {busVehicleMock.seatsCount}
                        </p>
                    </div>
                    <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Осмотр
                        </p>
                        <p className="leading-4.4 mt-2 text-sm font-bold text-[#4A4A4A]">
                            {busVehicleMock.nextInspectionDate}
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 pt-5">
                    <h2 className="leading-5.5 pb-4 text-xl font-bold text-[#4A4A4A]">
                        Действия
                    </h2>
                    <Menu
                        link="/busdriver/issues"
                        text="Сообщить о неисправности"
                    />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="/busdriver/seats" text="Открыть схему мест" />
                </div>
            </div>
        </>
    );
};

export default BusDriverVehiclePage;
