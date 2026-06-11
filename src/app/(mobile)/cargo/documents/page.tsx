import Topbar from '@/components/topbar';
import DocumentCard from '../_components/DocumentCard';
import {
    requiredDriverDocuments,
    requiredVehicleDocuments,
} from '../_data/cargo-required-documents';
import { documentsMock } from '../_data/cargo-driver.mock';
import {
    buildDocumentsWithMissing,
    getDocumentFormHref,
} from '../_utils/document-utils';

const CargoDocumentsPage = () => {
    const driverDocuments = buildDocumentsWithMissing(
        requiredDriverDocuments,
        documentsMock.filter((document) => document.scope === 'driver')
    );
    const vehicleDocuments = buildDocumentsWithMissing(
        requiredVehicleDocuments,
        documentsMock.filter((document) => document.scope === 'vehicle')
    );

    return (
        <>
            <Topbar backHref="/cargo">Документы</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div>
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Документы водителя
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                        {driverDocuments.map((document) => (
                            <DocumentCard
                                key={document.id}
                                document={document}
                                href={getDocumentFormHref(document)}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Документы машины
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                        {vehicleDocuments.map((document) => (
                            <DocumentCard
                                key={document.id}
                                document={document}
                                href={getDocumentFormHref(document)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CargoDocumentsPage;
