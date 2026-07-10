import Link from 'next/link';
import Topbar from '@/components/topbar';
import CargoMap from '../_components/CargoMap';

const CargoMapPage = () => {
    return (
        <>
            <Topbar backHref="/cargo">Карта маршрута</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="flex flex-col gap-4">
                    <CargoMap />
                    <section className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                        <h1 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                            Отслеживание маршрута
                        </h1>
                        <p className="mt-2 text-sm leading-5 text-[#777777]">
                            Живая карта и позиция транспорта появятся здесь,
                            когда текущий рейс будет запущен.
                        </p>
                        <Link
                            href="/cargo/trip"
                            className="mt-5 flex min-h-14 w-full items-center justify-center rounded-[0.625rem] bg-[#E23333] px-4 py-4 text-center text-sm font-semibold text-white active:bg-[#D92727]"
                        >
                            Открыть текущий рейс
                        </Link>
                    </section>
                </div>
            </div>
        </>
    );
};

export default CargoMapPage;
