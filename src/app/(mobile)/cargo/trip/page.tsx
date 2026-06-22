'use client';

import Topbar from '@/components/topbar';
import toast from 'react-hot-toast';
import { useState } from 'react';
import CargoInfoCard from '../_components/CargoInfoCard';
import CargoOrderDetailsDrawer, {
    cargoOrderStatusMeta,
} from '../_components/CargoOrderDetailsDrawer';
import DriverTripCard from '../_components/DriverTripCard';
import EmptyTripState from '../_components/EmptyTripState';
import TripStatusStepper from '../_components/TripStatusStepper';
import {
    activeTripMock,
    cargoShipperContactsMock,
    tripStatuses,
} from '../_data/cargo-driver.mock';
import type { CargoShipperContact, CargoTrip, TripStep } from '../_types/cargo';
import Building from '@/assets/building';

const buildTripSteps = (
    steps: TripStep[],
    currentStepIndex: number,
    isCompleted: boolean
): TripStep[] =>
    steps.map((step, index) => {
        let state: TripStep['state'];

        if (isCompleted || index < currentStepIndex) {
            state = 'done';
        } else if (index === currentStepIndex) {
            state = 'current';
        } else {
            state = 'upcoming';
        }

        return {
            ...step,
            state,
        };
    });

const getStepIndexByStatus = (status: CargoTrip['currentStatus']) => {
    const stepIndex = tripStatuses.findIndex((step) => step.status === status);

    return stepIndex >= 0 ? stepIndex : 0;
};

const ShipperContactsCard = ({
    contacts,
    onSelectOrder,
}: {
    contacts: CargoShipperContact[];
    onSelectOrder: (contact: CargoShipperContact) => void;
}) => {
    return (
        <section className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
             
            <div className="flex items-center justify-between gap-3">
                <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                    Текущие заказы
                </h2>
                <span className="text-sm font-medium text-[#A0A0A0]">
                    {contacts.length} заказа
                </span>
            </div>
  
            <div className="mt-4 flex flex-col gap-3">
                {contacts.map((contact) => {
                    const status = cargoOrderStatusMeta[contact.status];

                    return (
                        <button
                            key={contact.id}
                            type="button"
                            onClick={() => onSelectOrder(contact)}
                            className="w-full rounded-[0.625rem] bg-[#F8F8F8] p-4 text-left active:bg-[#F0F0F0]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 flex-row items-center gap-2">
                                    <p className="text-base font-bold leading-5 text-[#4A4A4A]">
                                        {contact.companyName}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-[#A0A0A0]">
                                        {contact.orderNumber}
                                    </p>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold ${status.className}`}
                                >
                                    {status.label}
                                </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 rounded-[0.5rem] bg-white p-3">
                                <p className="text-xs font-medium text-[#A0A0A0]">
                                    Тип груза
                                </p>
                                <p className="text-sm font-semibold leading-5 text-[#4A4A4A]">
                                    {contact.cargoTitle}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

const CargoTripPage = () => {
    const [activeTrip, setActiveTrip] = useState<CargoTrip | null>(
        activeTripMock ?? null
    );
    const [isTripCompleted, setIsTripCompleted] = useState(
        activeTripMock?.currentStatus === 'completed'
    );
    const [steps, setSteps] = useState(() =>
        activeTripMock
            ? buildTripSteps(
                  tripStatuses,
                  getStepIndexByStatus(activeTripMock.currentStatus),
                  activeTripMock.currentStatus === 'completed'
              )
            : tripStatuses
    );
    const [selectedOrder, setSelectedOrder] =
        useState<CargoShipperContact | null>(null);

    const handleCompleteTrip = () => {
        if (!activeTrip) return;

        setActiveTrip((currentTrip) =>
            currentTrip
                ? {
                      ...currentTrip,
                      currentStatus: 'completed',
                  }
                : currentTrip
        );
        setSteps((currentSteps) =>
            buildTripSteps(currentSteps, currentSteps.length - 1, true)
        );
        setIsTripCompleted(true);
        toast.success('Рейс завершен');
    };

    const handleStepChange = (stepIndex: number) => {
        if (!activeTrip) return;

        const selectedStep = steps[stepIndex];
        const currentIndex = steps.findIndex(
            (step) => step.state === 'current'
        );

        if (!selectedStep) return;
        if (!isTripCompleted && currentIndex === stepIndex) return;

        if (selectedStep.status === 'completed') {
            handleCompleteTrip();
            return;
        }

        setActiveTrip((currentTrip) =>
            currentTrip
                ? {
                      ...currentTrip,
                      currentStatus: selectedStep.status,
                  }
                : currentTrip
        );
        setSteps((currentSteps) =>
            buildTripSteps(currentSteps, stepIndex, false)
        );
        setIsTripCompleted(false);
        toast.success(`Статус рейса обновлен: ${selectedStep.title}`);
    };

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
            <Topbar backHref="/cargo">Текущий рейс</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                {!activeTrip ? (
                    <EmptyTripState />
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                    <div className="h-70 bg-linear-[180deg,#FFF7F7_0%,#FFFFFF_100%] flex items-center justify-center rounded-[0.625rem] border border-dashed border-[#E7B0B0] p-6 text-center">
                        <div>
                            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E23333]">
                                <Building color="#FFFFFF" />
                            </div>
                            <p className="leading-5.5 mt-4 text-xl font-bold text-[#4A4A4A]">
                                Карта маршрута
                            </p>
                            <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                                Здесь будет отображаться маршрут и позиция
                                транспорта
                            </p>
                        </div>
                    </div>
                </div>
                        <DriverTripCard
                            trip={activeTrip}
                            steps={steps}
                            isTripCompleted={isTripCompleted}
                            onSelectNextPoint={handleSelectNextPoint}
                        />
                        <CargoInfoCard trip={activeTrip} />
                        <ShipperContactsCard
                            contacts={cargoShipperContactsMock}
                            onSelectOrder={setSelectedOrder}
                        />
                        <TripStatusStepper
                            steps={steps}
                            isTripCompleted={isTripCompleted}
                            onStepChange={handleStepChange}
                            onCompleteTrip={handleCompleteTrip}
                        />
                    </div>
                )}
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

export default CargoTripPage;
