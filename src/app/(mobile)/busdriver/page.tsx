import Link from 'next/link';
import BusDriverStatsCard from './_components/BusDriverStatsCard';
import BusDriverTripCard from './_components/BusDriverTripCard';
import {
    busDriverProfileMock,
    busDriverStatsMock,
    busDriverTripMock,
} from './_data/bus-driver.mock';

const BusDriverHomePage = () => {
    return (
        <div className="bg-(--gray) pt-18.75 min-h-full px-5 pb-28">
            <h1 className="text-[2.625rem] font-semibold leading-[2.8875rem] tracking-[-0.03em] text-[#4A4A4A]">
                Bus Driver
            </h1>

            <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-[#A0A0A0]">
                            Сегодняшняя смена
                        </p>
                        <p className="mt-1 text-[1.75rem] font-bold leading-[1.925rem] text-[#4A4A4A]">
                            {busDriverProfileMock.fullName}
                        </p>
                        <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                            {busDriverTripMock.routeLabel}, отправление в{' '}
                            {busDriverTripMock.departureTime}
                        </p>
                    </div>
                    <span className="rounded-full bg-[#E23333] px-3 py-1.5 text-xs font-semibold text-white">
                        {busDriverProfileMock.badgeNumber}
                    </span>
                </div>
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="leading-5.5 pb-3 text-xl font-bold text-[#4A4A4A]">
                        Активный рейс
                    </h2>
                    
                </div>
                <Link
                        href="/busdriver/trip"

                    >

                    <BusDriverTripCard trip={busDriverTripMock} />
                </Link>

            </div>

            {/* <div className="mt-5 grid grid-cols-2 gap-3">
                {busDriverStatsMock.map((stat) => (
                    <BusDriverStatsCard key={stat.id} stat={stat} />
                ))}
            </div> */}

            {/* <div className="mt-5 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 pt-5">
                <h2 className="leading-5.5 pb-4 text-xl font-bold text-[#4A4A4A]">
                    Быстрые действия
                </h2>
                <Menu link="/busdriver/passengers" text="Открыть пассажиров" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/busdriver/history" text="Открыть историю рейсов" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/busdriver/seats" text="Проверить схему мест" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/busdriver/vehicle" text="Информация об автобусе" />
            </div> */}
        </div>
    );
};

export default BusDriverHomePage;
