import Link from 'next/link';
import Menu from '@/components/menu';
import ShipperActiveOrderCard from './_components/ShipperActiveOrderCard';
import ShipperOrderCard from './_components/ShipperOrderCard';
import {
    activeShipperOrderMock,
    shipperOrdersMock,
    shipperProfileMock,
} from './_data/shipper.mock';

const ShipperHomePage = () => {
    const inTransitCount = shipperOrdersMock.filter(
        (order) => order.status === 'inTransit'
    ).length;
    const waitingDriverCount = shipperOrdersMock.filter(
        (order) => order.status === 'waitingDriver'
    ).length;
    const deliveredCount = shipperOrdersMock.filter(
        (order) => order.status === 'delivered'
    ).length;

    return (
        <div className="bg-(--gray) pt-18.75 min-h-full px-5 pb-28">
            <h1 className="text-[2.625rem] font-semibold leading-[2.8875rem] tracking-[-0.03em] text-[#4A4A4A]">
                Joool Shipper
            </h1>

            <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-[#A0A0A0]">
                            Добро пожаловать
                        </p>
                        <p className="mt-1 text-[1.75rem] font-bold leading-[1.925rem] text-[#4A4A4A]">
                            {shipperProfileMock.companyName}
                        </p>
                        <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                            Контактный логист: {shipperProfileMock.name}
                        </p>
                    </div>
                    <span className="rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-1.5 text-xs font-semibold text-[#E74949]">
                        {shipperOrdersMock.length} заявок
                    </span>
                </div>
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Активная перевозка
                    </h2>
                    <Link
                        href="/shipper/create-order"
                        className="text-sm font-semibold text-[#E23333]"
                    >
                        Создать заявку
                    </Link>
                </div>
                <div className="mt-3">
                    {activeShipperOrderMock ? (
                        <ShipperActiveOrderCard
                            order={activeShipperOrderMock}
                        />
                    ) : (
                        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5 text-center">
                            <p className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                                Пока нет активной перевозки
                            </p>
                            <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                                Как только заявке назначат машину, здесь
                                появится оперативный статус по грузу.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                    <p className="text-xs font-medium text-[#A0A0A0]">В пути</p>
                    <p className="leading-5.5 mt-2 text-xl font-bold text-[#4A4A4A]">
                        {inTransitCount}
                    </p>
                </div>
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Ждут водителя
                    </p>
                    <p className="leading-5.5 mt-2 text-xl font-bold text-[#4A4A4A]">
                        {waitingDriverCount}
                    </p>
                </div>
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Доставлены
                    </p>
                    <p className="leading-5.5 mt-2 text-xl font-bold text-[#4A4A4A]">
                        {deliveredCount}
                    </p>
                </div>
            </div>

            {/* <div className="mt-5 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 pt-5">
                <h2 className="leading-5.5 pb-4 text-xl font-bold text-[#4A4A4A]">
                    Быстрые переходы
                </h2>
                <Menu link="/shipper/create-order" text="Создать заявку" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/shipper/orders" text="Открыть список заявок" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/shipper/tracking" text="Перейти к трекингу" />
                <div className="h-px w-full border-t border-[#E9E9E9]" />
                <Menu link="/shipper/profile" text="Профиль компании" />
            </div> */}

            <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Последние заявки
                    </h2>
                    <Link
                        href="/shipper/orders"
                        className="text-sm font-semibold text-[#E23333]"
                    >
                        Все заявки
                    </Link>
                </div>
                <div className="mt-3 flex flex-col gap-3">
                    {shipperOrdersMock.slice(0, 3).map((order) => (
                        <ShipperOrderCard
                            key={order.id}
                            order={order}
                            href={`/shipper/orders/${order.id}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShipperHomePage;
