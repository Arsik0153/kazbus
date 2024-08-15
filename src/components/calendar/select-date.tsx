'use client';
import React, { useState, useRef, useEffect } from 'react';
import Calendar from '@/assets/calendar';
import DataChooser from '@/components/calendar/data-chooser';
import { useSearchParams } from 'next/navigation';
import { dayjsExt } from '@/lib/dayjs';
import clsx from 'clsx';

interface SelectDateProps {
    placeholder?: string;
    variant?: 'primary' | 'secondary';
}

const SelectDate: React.FC<SelectDateProps> = ({
    placeholder,
    variant = 'primary',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const dataChooserRef = useRef<HTMLDivElement | null>(null);

    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const formattedDate = dateParam
        ? dayjsExt(dateParam).format('DD.MM.YYYY')
        : '';

    const handleSelectDate = (date: string) => {
        setSelectedDate(date);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dataChooserRef.current &&
                !dataChooserRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            className={clsx('relative', {
                'w-fit': variant === 'primary',
                'w-full': variant === 'secondary',
            })}
        >
            <div
                className={clsx('relative cursor-pointer', {
                    'w-fit': variant === 'primary',
                    'w-full': variant === 'secondary',
                })}
            >
                {/* TODO: Календарь не принимает текст в инпут(теряется фокус) */}
                <input
                    key={selectedDate || formattedDate}
                    placeholder={placeholder || '__ - __ - ____'}
                    type="text"
                    name="birthday"
                    value={selectedDate || formattedDate}
                    className={clsx(
                        'rounded-[10px] border py-3 pr-3 text-base font-medium focus:outline-none',
                        {
                            'max-w-[141px] border-[#A0A0A0] pl-10 text-[#4A4A4A]':
                                variant === 'primary',
                            'w-full border border-[#4A4A4A] py-5 pl-12':
                                variant === 'secondary',
                        }
                    )}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
                <div
                    className={clsx(
                        'absolute left-0 top-0 cursor-pointer p-[16px]',
                        {
                            'p-[16px]': variant === 'primary',
                            'p-[25px] pl-[20px] pt-[26px]':
                                variant === 'secondary',
                        }
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Calendar
                        color="#E74949"
                        width={variant === 'primary' ? 16 : 16}
                        height={16}
                    />
                </div>
            </div>

            {isOpen && (
                <div ref={dataChooserRef}>
                    <DataChooser handleSelectDate={handleSelectDate} />
                </div>
            )}
        </div>
    );
};

export default SelectDate;
