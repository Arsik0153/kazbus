import Topbar from '@/components/topbar';
import DocumentCard from '../_components/DocumentCard';
import { documentsMock } from '../_data/cargo-driver.mock';

const CargoDocumentsPage = () => {
    const driverDocuments = documentsMock.filter(
        (document) => document.scope === 'driver'
    );
    const vehicleDocuments = documentsMock.filter(
        (document) => document.scope === 'vehicle'
    );

    return (
        <>
            <Topbar backHref="/cargo">Документы</Topbar>
            <div className="min-h-full bg-[var(--gray)] px-5 pb-28 pt-5">
                <div>
                    <h2 className="text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                        Документы водителя
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                        {driverDocuments.map((document) => (
                            <DocumentCard
                                key={document.id}
                                document={document}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                        Документы машины
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                        {vehicleDocuments.map((document) => (
                            <DocumentCard
                                key={document.id}
                                document={document}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CargoDocumentsPage;
