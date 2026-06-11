import Menu from '@/components/menu';
import Topbar from '@/components/topbar';
import DriverProfileCard from '../_components/DriverProfileCard';
import ProfileDocumentMenuItem from '../_components/ProfileDocumentMenuItem';
import VehicleCard from '../_components/VehicleCard';
import {
    requiredDriverDocuments,
    requiredVehicleDocuments,
} from '../_data/cargo-required-documents';
import {
    documentsMock,
    driverMock,
    vehicleMock,
} from '../_data/cargo-driver.mock';
import type { CargoDocument } from '../_types/cargo';

const getDocumentGroupStatus = (
    documents: CargoDocument[],
    requiredCount: number
): 'ready' | 'attention' | 'expired' | 'missing' => {
    if (documents.some((document) => document.status === 'expired')) {
        return 'expired';
    }

    if (documents.length < requiredCount) {
        return 'missing';
    }

    if (documents.some((document) => document.status === 'expiring')) {
        return 'attention';
    }

    return 'ready';
};

const CargoProfilePage = () => {
    const driverDocuments = documentsMock.filter(
        (document) => document.scope === 'driver'
    );
    const vehicleDocuments = documentsMock.filter(
        (document) => document.scope === 'vehicle'
    );

    const driverDocumentStatus = getDocumentGroupStatus(
        driverDocuments,
        requiredDriverDocuments.length
    );
    const vehicleDocumentStatus = getDocumentGroupStatus(
        vehicleDocuments,
        requiredVehicleDocuments.length
    );
    const allDocumentStatus = getDocumentGroupStatus(
        documentsMock,
        requiredDriverDocuments.length + requiredVehicleDocuments.length
    );

    return (
        <>
            <Topbar backHref="/cargo">Профиль</Topbar>
            <div className="min-h-full bg-[var(--gray)] px-5 pb-28 pt-5">
                <DriverProfileCard
                    driver={driverMock}
                    assignedVehicleLabel={`${vehicleMock.model} • ${vehicleMock.plateNumber}`}
                />

                <div className="mt-4">
                    <VehicleCard vehicle={vehicleMock} />
                </div>

                <div className="mt-4 rounded-[10px] border border-[#D1D1D1] bg-white px-4 pt-5">
                    <h2 className="pb-2 text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                        Документы
                    </h2>
                    <p className="pb-4 text-sm leading-[17.6px] text-[#A0A0A0]">
                        Добавьте обязательные документы водителя и машины для
                        проверки профиля.
                    </p>
                    <ProfileDocumentMenuItem
                        link="/cargo/profile/add-documents#driver-documents"
                        text="Добавить документы водителя"
                        status={driverDocumentStatus}
                    />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <ProfileDocumentMenuItem
                        link="/cargo/profile/add-documents#vehicle-documents"
                        text="Добавить документы машины"
                        status={vehicleDocumentStatus}
                    />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <ProfileDocumentMenuItem
                        link="/cargo/documents"
                        text="Открыть список документов"
                        status={allDocumentStatus}
                    />
                </div>

                <div className="mt-4 rounded-[10px] border border-[#D1D1D1] bg-white px-4 pt-5">
                    <h2 className="pb-4 text-[20px] font-bold leading-[22px] text-[#4A4A4A]">
                        Настройки
                    </h2>
                    <Menu link="#" text="Уведомления" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="#" text="Язык приложения" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="#" text="Выйти" />
                </div>
            </div>
        </>
    );
};

export default CargoProfilePage;
