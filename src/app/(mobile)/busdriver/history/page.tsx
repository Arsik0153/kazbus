import Topbar from '@/components/topbar';
import BusDriverHistoryTripCard from '../_components/BusDriverHistoryTripCard';
import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import { busDriverHistoryMock } from '../_data/bus-driver.mock';

const totalTrips = busDriverHistoryMock.length;
const totalAbsentPassengers = busDriverHistoryMock.reduce(
    (sum, trip) => sum + trip.absentPassengers,
    0
);
const averageOccupancy = Math.round(
    busDriverHistoryMock.reduce(
        (sum, trip) => sum + (trip.boardedPassengers / trip.passengerCapacity) * 100,
        0
    ) / totalTrips
);

const historyStats = [
    {
        id: 'history-trips',
        label: 'Рейсов',
        value: String(totalTrips),
        description: 'в последней истории',
        tone: 'neutral' as const,
    },
    {
        id: 'history-occupancy',
        label: 'Средняя загрузка',
        value: `${averageOccupancy}%`,
        description: 'по завершенным рейсам',
        tone: 'success' as const,
    },
    {
        id: 'history-absent',
        label: 'Не пришли',
        value: String(totalAbsentPassengers),
        description: 'пассажиров суммарно',
        tone: 'brand' as const,
    },
];

const BusDriverHistoryPage = () => {
    return (
        <>
            <Topbar backHref="/busdriver">История рейсов</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="grid grid-cols-3 gap-3">
                    {historyStats.map((stat) => (
                        <BusDriverStatsCard key={stat.id} stat={stat} />
                    ))}
                </div>

                <div className="mt-5 rounded-[0.875rem] border border-[#D1D1D1] bg-white p-5">
                    <h2 className="text-xl font-bold leading-[1.4rem] text-[#4A4A4A]">
                        Последние поездки
                    </h2>
                    <p className="mt-2 text-sm leading-[1.225rem] text-[#A0A0A0]">
                        Здесь видно, кто был на рейсе, кто не пришел и с какой
                        загрузкой автобус завершил поездку.
                    </p>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                    {busDriverHistoryMock.map((trip) => (
                        <BusDriverHistoryTripCard key={trip.id} trip={trip} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default BusDriverHistoryPage;
