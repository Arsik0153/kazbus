'use client';

import Button from '@/components/button';
import Topbar from '@/components/topbar';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { useMemo, useState } from 'react';
import CargoInfoCard from '../_components/CargoInfoCard';
import DriverTripCard from '../_components/DriverTripCard';
import EmptyTripState from '../_components/EmptyTripState';
import RouteCard from '../_components/RouteCard';
import TripStatusStepper from '../_components/TripStatusStepper';
import VehicleCard from '../_components/VehicleCard';
import {
    activeTripMock,
    tripStatuses,
    vehicleMock,
} from '../_data/cargo-driver.mock';
import type { CargoTrip, TripStep } from '../_types/cargo';

const cargoTripStatusMeta: Record<
    CargoTrip['currentStatus'],
    { badgeClassName: string; badgeLabel: string; label: string }
> = {
    planned: {
        label: 'Рейс назначен',
        badgeLabel: 'Активно',
        badgeClassName: 'bg-[#E23333] text-white',
    },
    loading: {
        label: 'Погрузка',
        badgeLabel: 'Активно',
        badgeClassName: 'bg-[#E23333] text-white',
    },
    inTransit: {
        label: 'В пути',
        badgeLabel: 'Активно',
        badgeClassName: 'bg-[#E23333] text-white',
    },
    unloading: {
        label: 'Разгрузка',
        badgeLabel: 'Активно',
        badgeClassName: 'bg-[#E23333] text-white',
    },
    completed: {
        label: 'Рейс завершен',
        badgeLabel: 'Завершен',
        badgeClassName: 'bg-[#7CC71C] text-white',
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

    const currentStepIndex = steps.findIndex(
        (step) => step.state === 'current'
    );
    const nextStep = useMemo(
        () =>
            currentStepIndex >= 0 && currentStepIndex < steps.length - 1
                ? steps[currentStepIndex + 1]
                : null,
        [currentStepIndex, steps]
    );
    const status = activeTrip
        ? cargoTripStatusMeta[activeTrip.currentStatus]
        : null;

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

    const handlePrimaryStatusChange = () => {
        if (!nextStep) return;

        if (nextStep.status === 'completed') {
            handleCompleteTrip();
            return;
        }

        handleStepChange(currentStepIndex + 1);
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
                        <RouteCard trip={activeTrip} />
                        <CargoInfoCard trip={activeTrip} />
                        <VehicleCard vehicle={vehicleMock} />

                        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-[#A0A0A0]">
                                        Текущий статус рейса
                                    </p>
                                    <p className="leading-5.5 mt-1 text-xl font-bold text-[#4A4A4A]">
                                        {status?.label}
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        'rounded-full px-3 py-1.5 text-xs font-semibold',
                                        status?.badgeClassName
                                    )}
                                >
                                    {status?.badgeLabel}
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                type="button"
                                className="mt-4"
                                disabled={isTripCompleted || !nextStep}
                                onClick={handlePrimaryStatusChange}
                            >
                                {nextStep?.status === 'completed'
                                    ? 'Завершить рейс'
                                    : nextStep
                                      ? `Перевести в «${nextStep.title}»`
                                      : 'Изменить статус'}
                            </Button>
                        </div>

                        <TripStatusStepper
                            steps={steps}
                            isTripCompleted={isTripCompleted}
                            onStepChange={handleStepChange}
                            onCompleteTrip={handleCompleteTrip}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default CargoTripPage;
