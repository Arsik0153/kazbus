import Menu from '@/components/menu';
import Topbar from '@/components/topbar';
import ShipperProfileCard from '../_components/ShipperProfileCard';
import { shipperOrdersMock, shipperProfileMock } from '../_data/shipper.mock';

const ShipperProfilePage = () => {
    return (
        <>
            <Topbar backHref="/shipper">Профиль</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <ShipperProfileCard
                    profile={shipperProfileMock}
                    ordersCount={shipperOrdersMock.length}
                />

                <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 pt-5">
                    <h2 className="leading-5.5 pb-4 text-xl font-bold text-[#4A4A4A]">
                        Настройки
                    </h2>
                    <Menu link="#" text="Уведомления" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="#" text="Документы компании" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="#" text="Способы оплаты" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="#" text="Выйти" />
                </div>
            </div>
        </>
    );
};

export default ShipperProfilePage;
