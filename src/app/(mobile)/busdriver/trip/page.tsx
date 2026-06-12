'use client';

import toast from 'react-hot-toast';
import { useState } from 'react';
import Topbar from '@/components/topbar';
import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import BusDriverTripCard from '../_components/BusDriverTripCard';
import BusDriverTripStatusStepper from '../_components/BusDriverTripStatusStepper';
import {
    busDriverStatsMock,
    busDriverTripMock,
} from '../_data/bus-driver.mock';
import type { BusDriverTrip, BusDriverTripStep } from '../_types/bus-driver';

const tripPageStats = busDriverStatsMock.slice(0, 3);

const getTripStatusByStepId = (
    stepId: BusDriverTripStep['id']
): BusDriverTrip['currentStatus'] => {
    const statusMap: Record<string, BusDriverTrip['currentStatus']> = {
        arrival: 'preTrip',
        boarding: 'boarding',
        departure: 'onRoute',
        enroute: 'onRoute',
        'arrival-finish': 'arriving',
    };

    return statusMap[stepId] ?? 'preTrip';
};

const buildTripSteps = (
    steps: BusDriverTripStep[],
    currentStepIndex: number,
    isCompleted: boolean
) =>
    steps.map((step, index) => ({
        ...step,
        state: isCompleted
            ? 'done'
            : index < currentStepIndex
              ? 'done'
              : index === currentStepIndex
                ? 'current'
                : 'upcoming',
    }));

const BusDriverTripPage = () => {
    const [trip, setTrip] = useState(busDriverTripMock);
    const [isTripCompleted, setIsTripCompleted] = useState(
        busDriverTripMock.currentStatus === 'completed'
    );

    const handleStepChange = (stepIndex: number) => {
        const selectedStep = trip.steps[stepIndex];
        const currentStepIndex = trip.steps.findIndex(
            (step) => step.state === 'current'
        );

        if (!selectedStep) return;
        if (!isTripCompleted && currentStepIndex === stepIndex) return;

        const updatedStatus = getTripStatusByStepId(selectedStep.id);

        setTrip((currentTrip) => ({
            ...currentTrip,
            currentStatus: updatedStatus,
            steps: buildTripSteps(currentTrip.steps, stepIndex, false),
        }));
        setIsTripCompleted(false);
        toast.success(`Статус рейса обновлен: ${selectedStep.title}`);
    };

    const handleCompleteTrip = () => {
        setTrip((currentTrip) => ({
            ...currentTrip,
            currentStatus: 'completed',
            steps: buildTripSteps(
                currentTrip.steps,
                currentTrip.steps.length - 1,
                true
            ),
        }));
        setIsTripCompleted(true);
        toast.success('Рейс завершен');
    };

    return (
        <>
            <Topbar backHref="/busdriver">Рейс</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <BusDriverTripCard trip={trip} />

                <div className="mt-4 grid grid-cols-3 gap-3">
                    {tripPageStats.map((stat) => (
                        <BusDriverStatsCard key={stat.id} stat={stat} />
                    ))}
                </div>

                <div className="mt-4">
                    <BusDriverTripStatusStepper
                        steps={trip.steps}
                        isTripCompleted={isTripCompleted}
                        onStepChange={handleStepChange}
                        onCompleteTrip={handleCompleteTrip}
                    />
                </div>
            </div>
        </>
    );
};

export default BusDriverTripPage;
