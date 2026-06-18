'use client';

import Topbar from '@/components/topbar';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Drawer } from 'vaul';
import CargoInfoCard from '../_components/CargoInfoCard';
import DriverTripCard from '../_components/DriverTripCard';
import EmptyTripState from '../_components/EmptyTripState';
import TripStatusStepper from '../_components/TripStatusStepper';
import {
    activeTripMock,
    cargoShipperContactsMock,
    tripStatuses,
} from '../_data/cargo-driver.mock';
import type {
    CargoShipperContact,
    CargoShipperContactStatus,
    CargoTrip,
    TripStep,
} from '../_types/cargo';

const shipperContactStatusMeta: Record<
    CargoShipperContactStatus,
    { className: string; label: string }
> = {
    loaded: {
        label: 'Загружен',
        className: 'bg-[#E8F7D9] text-[#5E9F14]',
    },
    inTransit: {
        label: 'В пути',
        className: 'bg-[#FFF2F2] text-[#E23333]',
    },
    awaitingDelivery: {
        label: 'Ожидает',
        className: 'bg-[#fafafa] text-[#7A7A7A]',
    },
};

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
                    const status = shipperContactStatusMeta[contact.status];

                    return (
                        <button
                            key={contact.id}
                            type="button"
                            onClick={() => onSelectOrder(contact)}
                            className="w-full rounded-[0.625rem] bg-[#F8F8F8] p-4 text-left active:bg-[#F0F0F0]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex flex-row items-center gap-2">
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

const OrderDetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between gap-4 border-t border-[#EFEFEF] py-3 first:border-t-0 first:pt-0 last:pb-0">
        <p className="text-sm font-medium text-[#A0A0A0]">{label}</p>
        <p className="max-w-[62%] text-right text-sm font-semibold leading-5 text-[#4A4A4A]">
            {value}
        </p>
    </div>
);

const ShipperOrderDetails = ({ order }: { order: CargoShipperContact }) => {
    const status = shipperContactStatusMeta[order.status];

    return (
        <div className="space-y-5">
            <div className="rounded-[0.875rem] border border-[#E8E8E8] bg-[#FBFBFB] p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xl font-bold leading-[1.4rem] text-[#4A4A4A]">
                            {order.companyName}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[#A0A0A0]">
                            {order.orderNumber}
                        </p>
                    </div>
                    <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                    >
                        {status.label}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Тип груза
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5 text-[#4A4A4A]">
                        {order.cargoTitle}
                    </p>
                </div>
                <div className="rounded-xl bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Контакт
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5 text-[#4A4A4A]">
                        {order.contactName}
                    </p>
                </div>
            </div>

            <div className="rounded-[0.875rem] border border-[#E8E8E8] bg-white p-4">
                <OrderDetailRow label="Телефон" value={order.phone} />
                <OrderDetailRow label="Забрать" value={order.pickupPoint} />
                <OrderDetailRow
                    label="Адрес забора"
                    value={order.pickupAddress}
                />
                <OrderDetailRow label="Доставить" value={order.dropoffPoint} />
                <OrderDetailRow
                    label="Адрес доставки"
                    value={order.dropoffAddress}
                />
            </div>

            <a
                href={`tel:${order.phone.replaceAll(' ', '')}`}
                className="flex w-full items-center justify-center rounded-[0.625rem] bg-[#E23333] px-4 py-4 text-sm font-semibold text-white active:bg-[#D92727]"
            >
                Позвонить shipper
            </a>
        </div>
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

    return (
        <>
            <Topbar backHref="/cargo">Текущий рейс</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                {!activeTrip ? (
                    <EmptyTripState />
                ) : (
                    <div className="flex flex-col gap-4">
                        <DriverTripCard trip={activeTrip} />
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

            <Drawer.Root
                open={!!selectedOrder}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedOrder(null);
                    }
                }}
            >
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
                    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[88vh] flex-col rounded-t-2xl bg-white">
                        {selectedOrder && (
                            <div className="overflow-y-auto px-5 pb-8 pt-4">
                                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#D6D6D6]" />
                                <Drawer.Title className="text-center text-xl font-bold text-[#4A4A4A]">
                                    Детали заказа
                                </Drawer.Title>
                                <Drawer.Description className="sr-only">
                                    Полная информация по заказу shipper для
                                    водителя
                                </Drawer.Description>

                                <div className="mt-5">
                                    <ShipperOrderDetails
                                        order={selectedOrder}
                                    />
                                </div>
                            </div>
                        )}
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </>
    );
};

export default CargoTripPage;
