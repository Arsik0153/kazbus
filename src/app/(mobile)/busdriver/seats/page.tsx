import Topbar from '@/components/topbar';
import BusSeatMap from '../_components/BusSeatMap';
import { busDriverTripMock, busSeatRowsMock } from '../_data/bus-driver.mock';

const BusDriverSeatsPage = () => {
    return (
        <>
            <Topbar backHref="/busdriver/trip">Места</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <BusSeatMap rows={busSeatRowsMock} />

                <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Вместимость
                        </p>
                        <p className="leading-5.5 mt-2 text-xl font-bold text-[#4A4A4A]">
                            {busDriverTripMock.passengerCapacity}
                        </p>
                    </div>
                    <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            На борту
                        </p>
                        <p className="leading-5.5 mt-2 text-xl font-bold text-[#4A4A4A]">
                            {busDriverTripMock.boardedPassengers}
                        </p>
                    </div>
                    <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                        <p className="text-xs font-medium text-[#A0A0A0]">
                            Свободно
                        </p>
                        <p className="leading-5.5 mt-2 text-xl font-bold text-[#4A4A4A]">
                            {busDriverTripMock.freeSeats}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BusDriverSeatsPage;
