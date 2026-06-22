import Building from '@/assets/building';
import Topbar from '@/components/topbar';
import RouteCard from '../_components/RouteCard';
import { activeTripMock } from '../_data/cargo-driver.mock';

const CargoMapPage = () => {
    return (
        <>
            <Topbar backHref="/cargo">Карта маршрута</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
             
                Тут пусто чел... <br /> Карта переехала в /trip
            </div>
        </>
    );
};

export default CargoMapPage;
