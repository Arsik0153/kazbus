'use client';

import Menu from '@/components/menu';
import { useState } from 'react';
import CargoOrderDetailsDrawer from './_components/CargoOrderDetailsDrawer';
import DocumentCard from './_components/DocumentCard';
import DriverTripCard from './_components/DriverTripCard';
import EmptyTripState from './_components/EmptyTripState';
import VehicleCard from './_components/VehicleCard';
import {
    activeTripMock,
    cargoShipperContactsMock,
    documentsMock,
    driverMock,
    tripStatuses,
    vehicleMock,
} from './_data/cargo-driver.mock';
import type { CargoShipperContact, TripStep } from './_types/cargo';

const CargoPage = () => {
    const activeTrip = activeTripMock ?? null;
    const driverName = driverMock.fullName.split(' ')[0];
    const [selectedOrder, setSelectedOrder] =
        useState<CargoShipperContact | null>(null);

    const handleSelectNextPoint = (step: TripStep) => {
        const order = cargoShipperContactsMock.find(
            (contact) => contact.orderNumber === step.orderNumber
        );

        if (order) {
            setSelectedOrder(order);
        }
    };

    return (
        <>
            <div className="bg-(--gray) pt-18.75 min-h-full px-5 pb-28">
                <h1 className="text-[2.625rem] font-semibold leading-[2.8875rem] tracking-[-0.03em] text-[#4A4A4A]">
                    Joool Cargo
                </h1>

                <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-[#A0A0A0]">
                                Добро пожаловать
                            </p>
                            <p className="mt-1 text-[1.75rem] font-bold leading-[1.925rem] text-[#4A4A4A]">
                                {driverName}
                            </p>
                            <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                                Ваша cargo-часть работает в том же мобильном
                                shell, что и основное приложение.
                            </p>
                        </div>
                        <div className="text-nowrap rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-1.5 text-xs font-semibold text-[#E74949]">
                            В рейсе
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Активный рейс
                    </h2>
                    <div className="mt-3">
                        {activeTrip ? (
                            <DriverTripCard
                                trip={activeTrip}
                                steps={tripStatuses}
                                isTripCompleted={
                                    activeTrip.currentStatus === 'completed'
                                }
                                onSelectNextPoint={handleSelectNextPoint}
                            />
                        ) : (
                            <EmptyTripState />
                        )}
                    </div>
                </div>

                <div className="mt-5">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Машина
                    </h2>
                    <div className="mt-3">
                        <VehicleCard vehicle={vehicleMock} />
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                            Документы
                        </h2>
                        <span className="text-sm font-medium text-[#A0A0A0]">
                            {documentsMock.length} документа
                        </span>
                    </div>
                    <div className="mt-3 flex flex-col gap-3">
                        {documentsMock.slice(0, 3).map((document) => (
                            <DocumentCard
                                key={document.id}
                                document={document}
                            />
                        ))}
                    </div>
                </div>

                {/* <div className="mt-5 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 pt-5">
                    <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                        Быстрые ссылки
                    </h2>
                    <Menu link="/cargo/trip" text="Текущий рейс" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="/cargo/map" text="Карта маршрута" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="/cargo/documents" text="Документы" />
                    <div className="h-px w-full border-t border-[#E9E9E9]" />
                    <Menu link="/cargo/profile" text="Профиль" />
                </div> */}
            </div>

            <CargoOrderDetailsDrawer
                order={selectedOrder}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedOrder(null);
                    }
                }}
            />
        </>
    );
};

export default CargoPage;
