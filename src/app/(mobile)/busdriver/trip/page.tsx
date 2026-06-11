import Menu from '@/components/menu';
import Topbar from '@/components/topbar';
import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import BusDriverTripCard from '../_components/BusDriverTripCard';
import BusDriverTripStatusStepper from '../_components/BusDriverTripStatusStepper';
import {
    busDriverStatsMock,
    busDriverTripMock,
} from '../_data/bus-driver.mock';

const tripPageStats = busDriverStatsMock.slice(0, 3);

const BusDriverTripPage = () => {
    return (
        <>
            <Topbar backHref="/busdriver">Рейс</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <BusDriverTripCard trip={busDriverTripMock} />

                <div className="mt-4 grid grid-cols-3 gap-3">
                    {tripPageStats.map((stat) => (
                        <BusDriverStatsCard key={stat.id} stat={stat} />
                    ))}
                </div>

                <div className="mt-4">
                    <BusDriverTripStatusStepper
                        steps={busDriverTripMock.steps}
                    />
                </div>

                <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 pt-5">
                    <h2 className="leading-5.5 pb-4 text-xl font-bold text-[#4A4A4A]">
                        Инструменты рейса
                    </h2>
                    <Menu
                        link="/busdriver/passengers"
                        text="Открыть список пассажиров"
                    />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="/busdriver/scanner" text="Сканировать билет" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu
                        link="/busdriver/seats"
                        text="Посмотреть схему мест"
                    />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="/busdriver/vehicle" text="Данные автобуса" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="/busdriver/issues" text="Сообщить о ситуации" />
                </div>
            </div>
        </>
    );
};

export default BusDriverTripPage;
