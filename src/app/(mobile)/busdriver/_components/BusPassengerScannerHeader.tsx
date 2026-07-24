'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import BackIcon from '@/assets/shared/back-icon';
import { cn } from '@/utils/cn';
import BusPassengerSearchIcon from './BusPassengerSearchIcon';

type Props = {
    hideGap: boolean;
    isSearchOpen: boolean;
    searchTerm: string;
    onSearchOpen: () => void;
    onSearchClose: () => void;
    onSearchTermChange: (searchTerm: string) => void;
};

const BusPassengerScannerHeader = ({
    hideGap,
    isSearchOpen,
    searchTerm,
    onSearchOpen,
    onSearchClose,
    onSearchTermChange,
}: Props) => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isSearchOpen) return;

        const focusTimeout = window.setTimeout(() => {
            searchInputRef.current?.focus();
        }, 180);

        return () => window.clearTimeout(focusTimeout);
    }, [isSearchOpen]);

    return (
        <div
            className={cn(
                'relative w-full overflow-hidden rounded-b-[10px] bg-linear-to-b from-[#E32828] to-[#E13535] px-5 pb-6.5',
                {
                    'pt-6.5': hideGap,
                    'pt-16.25': !hideGap,
                }
            )}
        >
            <div className="relative h-13">
                <div className="grid h-full grid-cols-[1.5rem_minmax(0,1fr)_1.5rem] items-center gap-4">
                    <div className="col-start-1 flex h-6 w-6 items-center justify-center">
                        {isSearchOpen ? (
                            <button
                                type="button"
                                onClick={onSearchClose}
                                aria-label="Закрыть поиск"
                                className="flex h-6 w-6 items-center justify-center"
                            >
                                <BackIcon color="#fff" width={17} height={22} />
                            </button>
                        ) : (
                            <Link
                                href="/busdriver"
                                aria-label="Вернуться назад"
                                className="flex h-6 w-6 items-center justify-center"
                            >
                                <BackIcon color="#fff" width={17} height={22} />
                            </Link>
                        )}
                    </div>

                    <AnimatePresence initial={false}>
                        {!isSearchOpen && (
                            <motion.button
                                key="search-trigger"
                                type="button"
                                onClick={onSearchOpen}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                aria-label="Открыть поиск"
                                className="col-start-3 flex h-6 w-6 items-center justify-center"
                            >
                                <BusPassengerSearchIcon className="size-6.5" />
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
                            initial={{ opacity: 0, x: 24, scaleX: 0.72 }}
                            animate={{ opacity: 1, x: 0, scaleX: 1 }}
                            exit={{ opacity: 0, x: 24, scaleX: 0.72 }}
                            transition={{
                                duration: 0.24,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{ transformOrigin: 'right center' }}
                            className="absolute inset-y-0 left-10 right-0 min-w-0"
                        >
                            <div className="flex h-13 items-center gap-3 rounded-full bg-[#F0F3F8] px-4">
                                <BusPassengerSearchIcon color="#4A4A4A" />
                                <input
                                    ref={searchInputRef}
                                    id="passenger-search"
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        onSearchTermChange(event.target.value)
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
    );
};

export default BusPassengerScannerHeader;
