import Link from 'next/link';
import Topbar from '@/components/topbar';
import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import QRCodeScannerPlaceholder from '../_components/QRCodeScannerPlaceholder';
import { busDriverStatsMock } from '../_data/bus-driver.mock';

const scannerStats = busDriverStatsMock.slice(0, 2);

const BusDriverScannerPage = () => {
    return (
        <>
            <Topbar backHref="/busdriver">Сканер</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <QRCodeScannerPlaceholder />

                <div className="mt-4 grid grid-cols-2 gap-3">
                    {scannerStats.map((stat) => (
                        <BusDriverStatsCard key={stat.id} stat={stat} />
                    ))}
                </div>

                <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Проверка пассажиров
                    </h2>
                    <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                        После проверки откройте список пассажиров, чтобы
                        посмотреть статусы посадки по местам.
                    </p>
                    <Link
                        href="/busdriver/passengers"
                        className="mt-4 inline-flex text-sm font-semibold text-[#E23333]"
                    >
                        Открыть список пассажиров
                    </Link>
                </div>
            </div>
        </>
    );
};

export default BusDriverScannerPage;
