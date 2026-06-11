import Topbar from '@/components/topbar';
import DocumentCard from '../_components/DocumentCard';
import {
    requiredDriverDocuments,
    requiredVehicleDocuments,
} from '../_data/cargo-required-documents';
import { documentsMock } from '../_data/cargo-driver.mock';
import type { CargoDocument, RequiredCargoDocument } from '../_types/cargo';

const buildDocumentsWithMissing = (
    requiredDocuments: RequiredCargoDocument[],
    existingDocuments: CargoDocument[]
) => {
    const documentsByTemplate = new Map(
        existingDocuments.map((document) => [document.templateId, document])
    );

    const orderedDocuments = requiredDocuments.map(
        (requiredDocument, index) => {
            const existingDocument = documentsByTemplate.get(
                requiredDocument.id
            );

            if (existingDocument) {
                return existingDocument;
            }

            return {
                id: -(index + 1),
                templateId: requiredDocument.id,
                title: requiredDocument.title,
                number: '',
                expiresAt: '',
                status: 'missing' as const,
                scope: requiredDocument.scope,
                ownerLabel: requiredDocument.ownerLabel,
            };
        }
    );

    const extraDocuments = existingDocuments.filter(
        (document) =>
            !requiredDocuments.some(
                (requiredDocument) =>
                    requiredDocument.id === document.templateId
            )
    );

    return [...orderedDocuments, ...extraDocuments];
};

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
