import Menu from '@/components/menu';
import DocumentCard from './_components/DocumentCard';
import DriverTripCard from './_components/DriverTripCard';
import EmptyTripState from './_components/EmptyTripState';
import VehicleCard from './_components/VehicleCard';
import {
    activeTripMock,
    documentsMock,
    driverMock,
    vehicleMock,
} from './_data/cargo-driver.mock';

const CargoPage = () => {
    const activeTrip = activeTripMock ?? null;
    const driverName = driverMock.fullName.split(' ')[0];

    return (
        <div className="min-h-full bg-[var(--gray)] px-5 pb-28 pt-[75px]">
            <h1 className="text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[#4A4A4A]">
                Joool Cargo
            </h1>

            <div className="mt-4 rounded-[10px] border border-[#D1D1D1] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-[#A0A0A0]">
                            Добро пожаловать
                        </p>
                        <p className="mt-1 text-[28px] font-bold leading-[30.8px] text-[#4A4A4A]">
                            {driverName}
                        </p>
                        <p className="mt-2 text-sm leading-[17.6px] text-[#A0A0A0]">
                            Ваша cargo-часть работает в том же мобильном shell,
                            что и основное приложение.
                        </p>
                    </div>
                    <div className="text-nowrap rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-[6px] text-xs font-semibold text-[#E74949]">
                        В рейсе
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h2 className="text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                    Активный рейс
                </h2>
                <div className="mt-3">
                    {activeTrip ? (
                        <DriverTripCard trip={activeTrip} />
                    ) : (
                        <EmptyTripState />
                    )}
                </div>
            </div>

            <div className="mt-5">
                <h2 className="text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                    Машина
                </h2>
                <div className="mt-3">
                    <VehicleCard vehicle={vehicleMock} />
                </div>
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                        Документы
                    </h2>
                    <span className="text-sm font-medium text-[#A0A0A0]">
                        {documentsMock.length} документа
                    </span>
                </div>
                <div className="mt-3 flex flex-col gap-3">
                    {documentsMock.slice(0, 3).map((document) => (
                        <DocumentCard key={document.id} document={document} />
                    ))}
                </div>
            </div>

            {/* <div className="mt-5 rounded-[10px] border border-[#D1D1D1] bg-white px-4 pt-5">
                <h2 className="pb-4 text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                    Быстрые ссылки
                </h2>
                <Menu link="/cargo/trip" text="Текущий рейс" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/cargo/map" text="Карта маршрута" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/cargo/documents" text="Документы" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/cargo/profile" text="Профиль" />
            </div> */}
        </div>
    );
};

export default CargoPage;
