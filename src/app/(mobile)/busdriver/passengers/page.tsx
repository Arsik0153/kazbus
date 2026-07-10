'use client';

import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import BusPassengerCard from '../_components/BusPassengerCard';
import BusPassengerScannerHeader from '../_components/BusPassengerScannerHeader';
import BusPassengerSearchIcon from '../_components/BusPassengerSearchIcon';
import BusPassengerStatusDrawer from '../_components/BusPassengerStatusDrawer';
import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import EmptyPassengersState from '../_components/EmptyPassengersState';
import QRCodeScannerPlaceholder from '../_components/QRCodeScannerPlaceholder';
import { busPassengersMock } from '../_data/bus-driver.mock';
import type { BusPassenger, PassengerBoardingStatus } from '../_types/bus-driver';
import {
    filterPassengersBySearchTerm,
    getPassengerStats,
    updatePassengerBoardingStatus,
} from '../_utils/passengers';
import { cn } from '@/utils/cn';

const BusDriverPassengersPage = () => {
    const [hideGap, setHideGap] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [passengers, setPassengers] = useState(busPassengersMock);
    const [selectedPassengerId, setSelectedPassengerId] = useState<
        BusPassenger['id'] | null
    >(null);
    const [draftStatus, setDraftStatus] =
        useState<PassengerBoardingStatus>('waiting');
    const sectionTransition = {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1] as const,
    };

    useEffect(() => {
        const gap = !!localStorage.getItem('hideGap');
        setHideGap(gap);
    }, []);

    const selectedPassenger =
        passengers.find((passenger) => passenger.id === selectedPassengerId) ??
        null;
    const passengerStats = getPassengerStats(passengers);
    const filteredPassengers = filterPassengersBySearchTerm(
        passengers,
        searchTerm
    );
    const isSearchActive = isSearchOpen;

    const handleSearchClose = () => {
        setIsSearchOpen(false);
        setSearchTerm('');
    };

    const handlePassengerCardClick = (passenger: BusPassenger) => {
        setSelectedPassengerId(passenger.id);
        setDraftStatus(passenger.boardingStatus);
    };

    const handleStatusDrawerOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedPassengerId(null);
        }
    };

    const handleStatusSave = () => {
        if (!selectedPassenger) return;

        setPassengers((currentPassengers) =>
            updatePassengerBoardingStatus(
                currentPassengers,
                selectedPassenger.id,
                draftStatus
            )
        );
        toast.success(`Статус для ${selectedPassenger.fullName} обновлен`);
        setSelectedPassengerId(null);
    };

    return (
        <>
            <BusPassengerScannerHeader
                hideGap={hideGap}
                isSearchOpen={isSearchOpen}
                searchTerm={searchTerm}
                onSearchOpen={() => setIsSearchOpen(true)}
                onSearchClose={handleSearchClose}
                onSearchTermChange={setSearchTerm}
            />
            <motion.div
                layout
                transition={sectionTransition}
                className="bg-(--gray) min-h-full px-5 pb-28 pt-5"
            >
                <AnimatePresence initial={false}>
                    {!isSearchActive && (
                        <motion.div
                            key="passenger-top-sections"
                            initial={{ opacity: 0, y: -24, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -24, height: 0 }}
                            transition={sectionTransition}
                            className="overflow-hidden"
                        >
                            <QRCodeScannerPlaceholder />

                            <div className="mt-5 grid grid-cols-3 gap-3">
                                {passengerStats.map((stat) => (
                                    <BusDriverStatsCard key={stat.id} stat={stat} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    layout
                    transition={sectionTransition}
                    className={cn(
                        'mb-3 flex items-center justify-between gap-3',
                        {
                            'mt-8': !isSearchActive,
                            'mt-0': isSearchActive,
                        }
                    )}
                >
                    <h2 className="text-xl font-bold leading-[1.4rem] text-[#4A4A4A]">
                        Список пассажиров
                    </h2>
                    {/* <p className="text-xs font-medium text-[#A0A0A0]">
                        {filteredPassengers.length} из {busPassengersMock.length}
                    </p> */}
                </motion.div>

                <motion.div layout transition={sectionTransition}>
                    {passengers.length === 0 ? (
                        <EmptyPassengersState
                            title="Список пассажиров пока пуст"
                            description="Как только появятся подтвержденные билеты, они отобразятся ниже. Проверка билетов уже доступна в блоке сканирования выше."
                        />
                    ) : filteredPassengers.length === 0 ? (
                        <EmptyPassengersState
                            title="Ничего не найдено"
                            description="Попробуйте изменить запрос: можно искать по имени, билету или месту."
                            icon={
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3F5F8]">
                                    <BusPassengerSearchIcon
                                        color="#7E8A98"
                                        className="h-7 w-7"
                                    />
                                </div>
                            }
                        />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filteredPassengers.map((passenger) => (
                                <BusPassengerCard
                                    key={passenger.id}
                                    passenger={passenger}
                                    onClick={() =>
                                        handlePassengerCardClick(passenger)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>

            <BusPassengerStatusDrawer
                passenger={selectedPassenger}
                draftStatus={draftStatus}
                onOpenChange={handleStatusDrawerOpenChange}
                onDraftStatusChange={setDraftStatus}
                onSave={handleStatusSave}
            />
        </>
    );
};

export default BusDriverPassengersPage;
