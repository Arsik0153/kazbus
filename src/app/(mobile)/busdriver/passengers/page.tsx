import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import BusPassengerCard from '../_components/BusPassengerCard';
import EmptyPassengersState from '../_components/EmptyPassengersState';
import Topbar from '@/components/topbar';
import { busPassengersMock } from '../_data/bus-driver.mock';

const boardedCount = busPassengersMock.filter(
    (passenger) => passenger.boardingStatus === 'boarded'
).length;
const waitingCount = busPassengersMock.filter(
    (passenger) => passenger.boardingStatus === 'waiting'
).length;
const missedCount = busPassengersMock.filter(
    (passenger) => passenger.boardingStatus === 'missed'
).length;

const passengerStats = [
    {
        id: 'all',
        label: 'Всего',
        value: String(busPassengersMock.length),
        description: 'пассажиров в списке',
        tone: 'neutral' as const,
    },
    {
        id: 'boarded',
        label: 'На борту',
        value: String(boardedCount),
        description: 'уже прошли посадку',
        tone: 'success' as const,
    },
    {
        id: 'waiting',
        label: 'Ожидают',
        value: String(waitingCount + missedCount),
        description: 'нужно проверить',
        tone: 'brand' as const,
    },
];

const BusDriverPassengersPage = () => {
    return (
        <>
            <Topbar backHref="/busdriver">Пассажиры</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="grid grid-cols-3 gap-3">
                    {passengerStats.map((stat) => (
                        <BusDriverStatsCard key={stat.id} stat={stat} />
                    ))}
                </div>

                <div className="mt-5">
                    {busPassengersMock.length === 0 ? (
                        <EmptyPassengersState
                            title="Список пассажиров пока пуст"
                            description="Как только появятся подтвержденные билеты, они отобразятся здесь."
                            actionHref="/busdriver/scanner"
                            actionLabel="Перейти к сканеру"
                        />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {busPassengersMock.map((passenger) => (
                                <BusPassengerCard
                                    key={passenger.id}
                                    passenger={passenger}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BusDriverPassengersPage;
