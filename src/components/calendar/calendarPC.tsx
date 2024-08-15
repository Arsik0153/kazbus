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

const SelectDate: React.FC<SelectDateProps> = ({ placeholder, variant = 'primary' }) => {
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
            if (dataChooserRef.current && !dataChooserRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={clsx("relative",
            {
                'w-fit': variant === 'primary',
                'w-full': variant === 'secondary',
            }
        )}>
            <div className={clsx(
                "relative  cursor-pointer",
                {
                    'w-fit': variant === 'primary',
                    'w-full': variant === 'secondary',
                }
            )}
            >
                {/* TODO: Календарь не принимает текст в инпут(теряется фокус) */}
                <input
                    key={selectedDate || formattedDate}
                    placeholder={placeholder || "__ - __ - ____"}
                    type="text"
                    name="birthday"
                    value={selectedDate || formattedDate}
                    className={clsx(
                        "py-3 text-base font-medium  pr-3 border rounded-[10px] focus:outline-none",
                        {
                            'text-[#4A4A4A] pl-10 border-[#A0A0A0]  max-w-[141px]': variant === 'primary',
                            'py-5 pl-12 border border-[#4A4A4A] w-full': variant === 'secondary',
                        }
                    )}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
                <div className={clsx("absolute top-0 left-0 p-[16px] cursor-pointer", {
                    'p-[16px]': variant === 'primary',
                    'pl-[20px] p-[25px] pt-[26px]': variant === 'secondary',
                })}
                    onClick={() => setIsOpen(!isOpen)}>

                    <Calendar color="#E74949" width={variant === 'primary' ? 16 : 16} height={16} />
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
