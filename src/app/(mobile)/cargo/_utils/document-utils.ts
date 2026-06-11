import type {
    CargoDocument,
    DocumentFormMode,
    DocumentStatus,
    RequiredCargoDocument,
} from '../_types/cargo';

export const documentStatusMeta: Record<
    DocumentStatus,
    { label: string; className: string }
> = {
    valid: {
        label: 'Действует',
        className: 'bg-[#7CC71C] text-white',
    },
    expiring: {
        label: 'Скоро истекает',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    expired: {
        label: 'Истек',
        className: 'bg-[#AEAEAE] text-white',
    },
    missing: {
        label: 'Не заполнен',
        className: 'border border-[#D1D1D1] bg-[#F8F8F8] text-[#A0A0A0]',
    },
};

export const getDocumentFormMode = (
    status: DocumentStatus
): DocumentFormMode => (status === 'missing' ? 'create' : 'edit');

export const getDocumentFormHref = (
    document: Pick<CargoDocument, 'templateId' | 'status'>
) =>
    `/cargo/profile/add-documents?document=${document.templateId}&mode=${getDocumentFormMode(document.status)}#document-${document.templateId}`;

export const buildDocumentsWithMissing = (
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
