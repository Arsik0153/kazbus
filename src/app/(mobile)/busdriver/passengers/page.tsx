'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import { Drawer } from 'vaul';
import BackIcon from '@/assets/shared/back-icon';
import Button from '@/components/button';
import BusDriverStatsCard from '../_components/BusDriverStatsCard';
import BusPassengerCard from '../_components/BusPassengerCard';
import EmptyPassengersState from '../_components/EmptyPassengersState';
import QRCodeScannerPlaceholder from '../_components/QRCodeScannerPlaceholder';
import { busPassengersMock } from '../_data/bus-driver.mock';
import type { BusPassenger, PassengerBoardingStatus } from '../_types/bus-driver';
import { cn } from '@/utils/cn';

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

const boardingStatusOptions: Array<{
    value: PassengerBoardingStatus;
    label: string;
    description: string;
    activeClassName: string;
    badgeClassName: string;
}> = [
    {
        value: 'boarded',
        label: 'На борту',
        description: 'Пассажир прошел проверку и сел в автобус.',
        activeClassName: 'border-[#B9E27F] bg-[#F4FBEA]',
        badgeClassName: 'bg-[#F3F8EB] text-[#6A9F32]',
    },
    {
        value: 'waiting',
        label: 'Ждет посадки',
        description: 'Пассажир еще не прошел проверку перед рейсом.',
        activeClassName: 'border-[#F4C1C1] bg-[#FFF6F6]',
        badgeClassName: 'bg-[#FFF3F3] text-[#E23333]',
    },
    {
        value: 'missed',
        label: 'Не подошел',
        description: 'Пассажир не появился на посадке к отправлению.',
        activeClassName: 'border-[#D7D7D7] bg-[#F6F6F6]',
        badgeClassName: 'bg-[#F1F1F1] text-[#7E7E7E]',
    },
];

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
    const searchInputRef = useRef<HTMLInputElement>(null);
    const sectionTransition = {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1] as const,
    };

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

    const selectedPassenger =
        passengers.find((passenger) => passenger.id === selectedPassengerId) ??
        null;

    const boardedCount = passengers.filter(
        (passenger) => passenger.boardingStatus === 'boarded'
    ).length;
    const waitingCount = passengers.filter(
        (passenger) => passenger.boardingStatus === 'waiting'
    ).length;
    const missedCount = passengers.filter(
        (passenger) => passenger.boardingStatus === 'missed'
    ).length;

    const passengerStats = [
        {
            id: 'all',
            label: 'Всего',
            value: String(passengers.length),
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

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredPassengers = passengers.filter((passenger) => {
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
            currentPassengers.map((passenger) =>
                passenger.id === selectedPassenger.id
                    ? { ...passenger, boardingStatus: draftStatus }
                    : passenger
            )
        );

        toast.success(`Статус для ${selectedPassenger.fullName} обновлен`);
        setSelectedPassengerId(null);
    };

    const isSearchActive = isSearchOpen;

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
                                Сканнер билетов
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
                            animate={{
                                opacity: 1,
                                y: 0,
                                height: 'auto',
                            }}
                            exit={{ opacity: 0, y: -24, height: 0 }}
                            transition={sectionTransition}
                            className="overflow-hidden"
                        >
                            <QRCodeScannerPlaceholder />

                            <div className="mt-5 grid grid-cols-3 gap-3">
                                {passengerStats.map((stat) => (
                                    <BusDriverStatsCard
                                        key={stat.id}
                                        stat={stat}
                                    />
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
                                    <SearchIcon
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

            <Drawer.Root
                open={!!selectedPassenger}
                onOpenChange={handleStatusDrawerOpenChange}
            >
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
                    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-[1rem] bg-white">
                        {selectedPassenger && (
                            <div className="overflow-y-auto px-5 pb-8 pt-4">
                                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#D6D6D6]" />
                                <Drawer.Title className="text-center text-xl font-bold text-[#4A4A4A]">
                                    Статус посадки
                                </Drawer.Title>
                                <Drawer.Description className="sr-only">
                                    Изменение статуса посадки выбранного пассажира
                                </Drawer.Description>

                                <div className="mt-5 rounded-[0.875rem] border border-[#E8E8E8] bg-[#FBFBFB] p-4">
                                    <p className="text-lg font-bold text-[#4A4A4A]">
                                        {selectedPassenger.fullName}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-[#A0A0A0]">
                                        Билет {selectedPassenger.ticketNumber}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#7F7F7F]">
                                            Место {selectedPassenger.seatNumber}
                                        </span>
                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#7F7F7F]">
                                            {selectedPassenger.fareLabel}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {boardingStatusOptions.map((option) => {
                                        const isSelected =
                                            draftStatus === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    setDraftStatus(option.value)
                                                }
                                                className={cn(
                                                    'w-full rounded-[0.875rem] border p-4 text-left transition-colors',
                                                    isSelected
                                                        ? option.activeClassName
                                                        : 'border-[#E6E6E6] bg-white'
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div
                                                            className={cn(
                                                                'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                                                                option.badgeClassName
                                                            )}
                                                        >
                                                            {option.label}
                                                        </div>
                                                        <p className="mt-2 text-sm leading-[1.225rem] text-[#8E8E8E]">
                                                            {option.description}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={cn(
                                                            'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                                                            isSelected
                                                                ? 'border-[#E23333]'
                                                                : 'border-[#D1D1D1]'
                                                        )}
                                                    >
                                                        {isSelected && (
                                                            <div className="h-2.5 w-2.5 rounded-full bg-[#E23333]" />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStatusDrawerOpenChange(false)
                                        }
                                        className="flex-1 rounded-[0.875rem] border border-[#D9D9D9] px-4 py-4 text-sm font-semibold text-[#7E7E7E]"
                                    >
                                        Отмена
                                    </button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleStatusSave}
                                        className="max-h-none flex-1 rounded-[0.875rem] px-4 py-4 text-sm"
                                    >
                                        Сохранить
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </>
    );
};

export default BusDriverPassengersPage;
