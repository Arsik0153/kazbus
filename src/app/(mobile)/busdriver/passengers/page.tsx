'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import BackIcon from '@/assets/shared/back-icon';
import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import BusPassengerCard from '../_components/BusPassengerCard';
import EmptyPassengersState from '../_components/EmptyPassengersState';
import { busPassengersMock } from '../_data/bus-driver.mock';
import { cn } from '@/utils/cn';

const boardedCount = busPassengersMock.filter(
    (passenger) => passenger.boardingStatus === 'boarded'
).length;
const waitingCount = busPassengersMock.filter(
    (passenger) => passenger.boardingStatus === 'waiting'
).length;
const missedCount = busPassengersMock.filter(
    (passenger) => passenger.boardingStatus === 'missed'
).length;

const passengerStats = [
    {
        id: 'all',
        label: 'Всего',
        value: String(busPassengersMock.length),
        description: 'пассажиров в списке',
        tone: 'neutral' as const,
    },
    {
        id: 'boarded',
        label: 'На борту',
        value: String(boardedCount),
        description: 'уже прошли посадку',
        tone: 'success' as const,
    },
    {
        id: 'waiting',
        label: 'Ожидают',
        value: String(waitingCount + missedCount),
        description: 'нужно проверить',
        tone: 'brand' as const,
    },
];

const SearchIcon = ({
    color = 'white',
    className,
}: {
    color?: string;
    className?: string;
}) => (
    <svg
        className={cn('h-[18px] w-[18px] shrink-0', className)}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15.75 15.75L12.4875 12.4875"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const BusDriverPassengersPage = () => {
    const [hideGap, setHideGap] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const gap = !!localStorage.getItem('hideGap');
        setHideGap(gap);
    }, []);

    useEffect(() => {
        if (!isSearchOpen) return;

        const focusTimeout = window.setTimeout(() => {
            searchInputRef.current?.focus();
        }, 180);

        return () => window.clearTimeout(focusTimeout);
    }, [isSearchOpen]);

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredPassengers = busPassengersMock.filter((passenger) => {
        if (!normalizedSearchTerm) return true;

        return [
            passenger.fullName,
            passenger.ticketNumber,
            passenger.seatNumber,
            passenger.boardingPoint,
            passenger.destination,
            passenger.fareLabel,
        ].some((field) => field.toLowerCase().includes(normalizedSearchTerm));
    });

    const handleSearchOpen = () => {
        setIsSearchOpen(true);
    };

    const handleSearchClose = () => {
        setIsSearchOpen(false);
        setSearchTerm('');
    };

    return (
        <>
            <div
                className={cn(
                    'relative w-full overflow-hidden rounded-b-[10px] bg-gradient-to-b from-[#E32828] to-[#E13535] px-5 pb-[26px]',
                    {
                        'pt-[26px]': hideGap,
                        'pt-[65px]': !hideGap,
                    }
                )}
            >
                <div className="relative h-[52px]">
                    <div className="grid h-full grid-cols-[1.5rem_minmax(0,1fr)_1.5rem] items-center gap-4">
                        <div className="col-start-1 flex h-6 w-6 items-center justify-center">
                            {isSearchOpen ? (
                                <button
                                    type="button"
                                    onClick={handleSearchClose}
                                    aria-label="Закрыть поиск"
                                    className="flex h-6 w-6 items-center justify-center"
                                >
                                    <BackIcon
                                        color="#fff"
                                        width={17}
                                        height={22}
                                    />
                                </button>
                            ) : (
                                <Link
                                    href="/busdriver"
                                    aria-label="Вернуться назад"
                                    className="flex h-6 w-6 items-center justify-center"
                                >
                                    <BackIcon
                                        color="#fff"
                                        width={17}
                                        height={22}
                                    />
                                </Link>
                            )}
                        </div>

                        <AnimatePresence initial={false}>
                            {!isSearchOpen && (
                                <motion.button
                                    key="search-trigger"
                                    type="button"
                                    onClick={handleSearchOpen}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{
                                        duration: 0.18,
                                        ease: 'easeOut',
                                    }}
                                    aria-label="Открыть поиск"
                                    className="col-start-3 flex h-6 w-6 items-center justify-center"
                                >
                                    <SearchIcon className="size-6.5" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence initial={false}>
                        {!isSearchOpen && (
                            <motion.h1
                                key="title"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xl font-medium tracking-[-0.03em] text-white"
                            >
                                Пассажиры
                            </motion.h1>
                        )}
                    </AnimatePresence>

                    <AnimatePresence initial={false}>
                        {isSearchOpen && (
                            <motion.div
                                key="search-mode"
                                initial={{
                                    opacity: 0,
                                    x: 24,
                                    scaleX: 0.72,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scaleX: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: 24,
                                    scaleX: 0.72,
                                }}
                                transition={{
                                    duration: 0.24,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                style={{ transformOrigin: 'right center' }}
                                className="absolute inset-y-0 left-10 right-0 min-w-0"
                            >
                                <div className="flex h-[52px] items-center gap-3 rounded-full bg-[#F0F3F8] px-4">
                                    <SearchIcon color="#4A4A4A" />
                                    <input
                                        ref={searchInputRef}
                                        id="passenger-search"
                                        type="search"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="Поиск"
                                        enterKeyHint="search"
                                        autoComplete="off"
                                        aria-label="Поиск пассажира"
                                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#4A4A4A] outline-none placeholder:text-[#A0A0A0]"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="grid grid-cols-3 gap-3">
                    {passengerStats.map((stat) => (
                        <BusDriverStatsCard key={stat.id} stat={stat} />
                    ))}
                </div>

                <div className="mt-5">
                    {busPassengersMock.length === 0 ? (
                        <EmptyPassengersState
                            title="Список пассажиров пока пуст"
                            description="Как только появятся подтвержденные билеты, они отобразятся здесь."
                            actionHref="/busdriver/scanner"
                            actionLabel="Перейти к сканеру"
                        />
                    ) : filteredPassengers.length === 0 ? (
                        <EmptyPassengersState
                            title="Ничего не найдено"
                            description="Попробуйте изменить запрос: можно искать по имени, билету или месту."
                        />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filteredPassengers.map((passenger) => (
                                <BusPassengerCard
                                    key={passenger.id}
                                    passenger={passenger}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BusDriverPassengersPage;
