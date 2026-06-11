import Link from 'next/link';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import DocumentUploadCard from '../../_components/DocumentUploadCard';
import {
    requiredDriverDocuments,
    requiredVehicleDocuments,
} from '../../_data/cargo-required-documents';
import { documentsMock } from '../../_data/cargo-driver.mock';
import { getDocumentFormMode } from '../../_utils/document-utils';
import type {
    CargoDocument,
    DocumentFormMode,
    RequiredCargoDocument,
} from '../../_types/cargo';

type SearchParams = {
    document?: string | string[];
    mode?: string | string[];
};

const getSingleParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

const buildDocumentCards = (
    requiredDocuments: RequiredCargoDocument[],
    existingDocuments: CargoDocument[]
) => {
    const documentsByTemplate = new Map(
        existingDocuments.map((document) => [document.templateId, document])
    );

    return requiredDocuments.map((requiredDocument) => {
        const existingDocument = documentsByTemplate.get(requiredDocument.id);
        const status = existingDocument?.status ?? 'missing';

        return {
            ...requiredDocument,
            ownerLabel:
                existingDocument?.ownerLabel ?? requiredDocument.ownerLabel,
            status,
            mode: getDocumentFormMode(status),
            defaultNumber: existingDocument?.number,
            defaultExpiry: existingDocument?.expiresAt,
        };
    });
};

const AddCargoDocumentsPage = ({
    searchParams,
}: {
    searchParams?: SearchParams;
}) => {
    const selectedDocumentId = getSingleParam(searchParams?.document);
    const requestedMode = getSingleParam(searchParams?.mode) as
        | DocumentFormMode
        | undefined;

    const driverCards = buildDocumentCards(
        requiredDriverDocuments,
        documentsMock.filter((document) => document.scope === 'driver')
    );
    const vehicleCards = buildDocumentCards(
        requiredVehicleDocuments,
        documentsMock.filter((document) => document.scope === 'vehicle')
    );

    const allCards = [...driverCards, ...vehicleCards];
    const selectedCard = allCards.find(
        (document) => document.id === selectedDocumentId
    );
    const selectedMode = selectedCard?.mode ?? requestedMode;
    const isEditMode = selectedMode === 'edit';
    const backHref = selectedCard ? '/cargo/documents' : '/cargo/profile';

    return (
        <>
            <Topbar backHref={backHref}>Добавить документы</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <p className="text-sm font-bold text-[#E74949]">
                        Joool Cargo
                    </p>
                    <h1 className="mt-2 text-[2rem] font-bold leading-[2.4rem] text-[#4A4A4A]">
                        {selectedCard
                            ? isEditMode
                                ? 'Редактирование документа'
                                : 'Заполнение документа'
                            : 'Документы на проверку'}
                    </h1>
                    <p className="leading-4.4 mt-3 text-sm text-[#A0A0A0]">
                        {selectedCard
                            ? isEditMode
                                ? `Проверьте и обновите данные документа «${selectedCard.title}», если реквизиты изменились.`
                                : `Заполните документ «${selectedCard.title}», чтобы завершить проверку профиля.`
                            : 'Заполните обязательные документы водителя и транспорта, чтобы профиль был готов к проверке.'}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                            <p className="text-xs font-medium text-[#A0A0A0]">
                                Водитель
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                {requiredDriverDocuments.length} документа
                            </p>
                        </div>
                        <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                            <p className="text-xs font-medium text-[#A0A0A0]">
                                Машина
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                {requiredVehicleDocuments.length} документа
                            </p>
                        </div>
                    </div>

                    {selectedCard && (
                        <div className="mt-4 rounded-[0.625rem] border border-[#F3CDCD] bg-[#FFF2F2] p-4">
                            <p className="text-sm font-semibold text-[#E74949]">
                                {isEditMode
                                    ? 'Открыт документ для редактирования'
                                    : 'Открыт документ для заполнения'}
                            </p>
                            <p className="mt-1 text-base font-semibold text-[#4A4A4A]">
                                {selectedCard.title}
                            </p>
                            <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                                {isEditMode
                                    ? 'Поля уже заполнены текущими данными. При необходимости обновите реквизиты и файл документа.'
                                    : 'Заполните обязательные поля ниже и добавьте файл документа.'}
                            </p>
                        </div>
                    )}
                </div>

                <div id="driver-documents" className="mt-5">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Документы водителя
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                        {driverCards.map((document) => (
                            <DocumentUploadCard
                                key={document.id}
                                id={document.id}
                                title={document.title}
                                description={document.description}
                                ownerLabel={document.ownerLabel}
                                numberLabel={document.numberLabel}
                                expiryLabel={document.expiryLabel}
                                helperText={document.helperText}
                                mode={document.mode}
                                status={document.status}
                                defaultNumber={document.defaultNumber}
                                defaultExpiry={document.defaultExpiry}
                                isSelected={document.id === selectedDocumentId}
                            />
                        ))}
                    </div>
                </div>

                <div id="vehicle-documents" className="mt-6">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Документы машины
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                        {vehicleCards.map((document) => (
                            <DocumentUploadCard
                                key={document.id}
                                id={document.id}
                                title={document.title}
                                description={document.description}
                                ownerLabel={document.ownerLabel}
                                numberLabel={document.numberLabel}
                                expiryLabel={document.expiryLabel}
                                helperText={document.helperText}
                                mode={document.mode}
                                status={document.status}
                                defaultNumber={document.defaultNumber}
                                defaultExpiry={document.defaultExpiry}
                                isSelected={document.id === selectedDocumentId}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-6 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <p className="text-sm font-semibold text-[#E74949]">
                        Что дальше
                    </p>
                    <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                        {selectedCard
                            ? 'После обновления документа вы сможете быстро вернуться к списку документов или в профиль водителя.'
                            : 'После заполнения документов вы сможете быстро вернуться к списку документов или в профиль водителя.'}
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                        <Link href="/cargo/documents" className="w-full">
                            <Button variant="secondary">
                                Вернуться к документам
                            </Button>
                        </Link>
                        <Link href="/cargo/profile" className="w-full">
                            <Button variant="ghost">Вернуться в профиль</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddCargoDocumentsPage;
