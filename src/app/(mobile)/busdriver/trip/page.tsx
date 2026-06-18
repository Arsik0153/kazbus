'use client';

import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';
import Topbar from '@/components/topbar';
import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import BusDriverTripCard from '../_components/BusDriverTripCard';
import BusDriverTripStatusStepper from '../_components/BusDriverTripStatusStepper';
import {
    busDriverTripMock,
    busDriverTripsMock,
} from '../_data/bus-driver.mock';
import type {
    BusDriverStat,
    BusDriverTrip,
    BusDriverTripStep,
    BusTripStepState,
} from '../_types/bus-driver';

const buildTripPageStats = (trip: BusDriverTrip): BusDriverStat[] => {
    const waitingPassengers = Math.max(
        trip.passengerCapacity - trip.boardedPassengers - trip.freeSeats,
        0
    );

    return [
        {
            id: 'checked',
            label: 'Проверено',
            value: String(trip.boardedPassengers),
            description: 'билетов сканировано',
            tone: 'brand',
        },
        {
            id: 'waiting',
            label: 'Ожидают',
            value: String(waitingPassengers),
            description: 'пассажиров к посадке',
            tone: 'neutral',
        },
        {
            id: 'free-seats',
            label: 'Свободно',
            value: String(trip.freeSeats),
            description: 'мест в салоне',
            tone: 'success',
        },
    ];
};

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
): BusDriverTripStep[] =>
    steps.map((step, index) => {
        let state: BusTripStepState;

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

const BusDriverTripPage = () => {
    const searchParams = useSearchParams();
    const tripId = searchParams.get('tripId');
    const selectedTrip = useMemo(
        () =>
            busDriverTripsMock.find(
                (availableTrip) => availableTrip.id === tripId
            ) ?? busDriverTripMock,
        [tripId]
    );
    const [trip, setTrip] = useState(selectedTrip);
    const [isTripCompleted, setIsTripCompleted] = useState(
        selectedTrip.currentStatus === 'completed'
    );
    const tripPageStats = buildTripPageStats(trip);

    useEffect(() => {
        setTrip(selectedTrip);
        setIsTripCompleted(selectedTrip.currentStatus === 'completed');
    }, [selectedTrip]);

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
