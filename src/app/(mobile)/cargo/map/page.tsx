import Topbar from '@/components/topbar';
import RouteCard from '../_components/RouteCard';
import { activeTripMock } from '../_data/cargo-driver.mock';

const CargoMapPage = () => {
    return (
        <>
            <Topbar backHref="/cargo">Карта маршрута</Topbar>
            <div className="min-h-full bg-[var(--gray)] px-5 pb-28 pt-5">
                <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                    <div className="flex h-[280px] items-center justify-center rounded-[10px] border border-dashed border-[#E7B0B0] bg-[linear-gradient(180deg,#FFF7F7_0%,#FFFFFF_100%)] p-6 text-center">
                        <div>
                            <div className="mx-auto h-12 w-12 rounded-full bg-[#E23333]" />
                            <p className="mt-4 text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                                Карта маршрута
                            </p>
                            <p className="mt-2 text-sm leading-[17.6px] text-[#A0A0A0]">
                                Здесь будет отображаться маршрут и позиция
                                транспорта
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <RouteCard trip={activeTripMock} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Маршрут
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                            {activeTripMock.routeLabel}
                        </p>
                    </div>
                    <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Текущая точка
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                            {activeTripMock.currentPoint}
                        </p>
                    </div>
                    <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Расстояние
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                            {activeTripMock.distanceKm} км
                        </p>
                    </div>
                    <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Примерное прибытие
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                            {activeTripMock.eta}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CargoMapPage;
