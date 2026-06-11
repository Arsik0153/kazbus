import Topbar from '@/components/topbar';
import BusIssueOptionCard from '../_components/BusIssueOptionCard';
import { busIssueOptionsMock } from '../_data/bus-driver.mock';

const BusDriverIssuesPage = () => {
    return (
        <>
            <Topbar backHref="/busdriver/trip">Ситуации</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <h1 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Что произошло в рейсе
                    </h1>
                    <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                        Выберите подходящий сценарий, чтобы быстро свериться с
                        действиями по пассажирам, местам и графику.
                    </p>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                    {busIssueOptionsMock.map((option) => (
                        <BusIssueOptionCard key={option.id} option={option} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default BusDriverIssuesPage;
