import Link from 'next/link';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import DocumentUploadCard from '../../_components/DocumentUploadCard';
import {
    requiredDriverDocuments,
    requiredVehicleDocuments,
} from '../../_data/cargo-required-documents';

const AddCargoDocumentsPage = () => {
    return (
        <>
            <Topbar backHref="/cargo/profile">Добавить документы</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <p className="text-sm font-bold text-[#E74949]">
                        Joool Cargo
                    </p>
                    <h1 className="mt-2 text-[2rem] font-bold leading-[2.4rem] text-[#4A4A4A]">
                        Документы на проверку
                    </h1>
                    <p className="leading-4.4 mt-3 text-sm text-[#A0A0A0]">
                        Заполните обязательные документы водителя и транспорта,
                        чтобы профиль был готов к проверке.
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
                </div>

                <div id="driver-documents" className="mt-5">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Документы водителя
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                        {requiredDriverDocuments.map((document) => (
                            <DocumentUploadCard
                                key={document.id}
                                id={document.id}
                                title={document.title}
                                description={document.description}
                                ownerLabel={document.ownerLabel}
                                numberLabel={document.numberLabel}
                                expiryLabel={document.expiryLabel}
                                helperText={document.helperText}
                            />
                        ))}
                    </div>
                </div>

                <div id="vehicle-documents" className="mt-6">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Документы машины
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                        {requiredVehicleDocuments.map((document) => (
                            <DocumentUploadCard
                                key={document.id}
                                id={document.id}
                                title={document.title}
                                description={document.description}
                                ownerLabel={document.ownerLabel}
                                numberLabel={document.numberLabel}
                                expiryLabel={document.expiryLabel}
                                helperText={document.helperText}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-6 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <p className="text-sm font-semibold text-[#E74949]">
                        Что дальше
                    </p>
                    <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                        После заполнения документов вы сможете быстро вернуться
                        к списку документов или в профиль водителя.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                        <Link href="/cargo/documents" className="w-full">
                            <Button variant="secondary">
                                Перейти к документам
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
