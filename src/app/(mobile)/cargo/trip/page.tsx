import Button from '@/components/button';
import Topbar from '@/components/topbar';
import CargoInfoCard from '../_components/CargoInfoCard';
import DriverTripCard from '../_components/DriverTripCard';
import EmptyTripState from '../_components/EmptyTripState';
import RouteCard from '../_components/RouteCard';
import TripStatusStepper from '../_components/TripStatusStepper';
import VehicleCard from '../_components/VehicleCard';
import {
    activeTripMock,
    tripStatuses,
    vehicleMock,
} from '../_data/cargo-driver.mock';

const CargoTripPage = () => {
    const activeTrip = activeTripMock ?? null;

    return (
        <>
            <Topbar backHref="/cargo">Текущий рейс</Topbar>
            <div className="min-h-full bg-[var(--gray)] px-5 pb-28 pt-5">
                {!activeTrip ? (
                    <EmptyTripState />
                ) : (
                    <div className="flex flex-col gap-4">
                        <DriverTripCard trip={activeTrip} />
                        <RouteCard trip={activeTrip} />
                        <CargoInfoCard trip={activeTrip} />
                        <VehicleCard vehicle={vehicleMock} />

                        <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-[#A0A0A0]">
                                        Текущий статус рейса
                                    </p>
                                    <p className="mt-1 text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                                        В пути
                                    </p>
                                </div>
                                <div className="rounded-full bg-[#E23333] px-3 py-[6px] text-xs font-semibold text-white">
                                    Активно
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                type="button"
                                className="mt-4"
                            >
                                Изменить статус
                            </Button>
                        </div>

                        <TripStatusStepper steps={tripStatuses} />
                    </div>
                )}
            </div>
        </>
    );
};

export default CargoTripPage;
