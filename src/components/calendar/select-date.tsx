'use client';
import React, { useState, useRef, useEffect } from 'react';
import Calendar from '@/assets/calendar';
import DataChooser from '@/components/calendar/data-chooser';
import { cn } from '@/utils/cn';
import { ClassValue } from 'clsx';
import { dayjsExt } from '@/lib/dayjs';

type SelectDateProps = {
    placeholder?: string;
    variant?: 'primary' | 'secondary';
    value: Date | null;
    onChange: (date: Date | null) => void;
    inputClassName?: ClassValue;
};

const SelectDate: React.FC<SelectDateProps> = ({
    placeholder,
    variant = 'primary',
    onChange,
    value,
    inputClassName,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleSelectDate = (date: Date) => {
        onChange(date);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen((prev) => !prev);
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const displayValue = value ? dayjsExt(value).format('DD.MM.YYYY') : '';

    return (
        <div
            ref={containerRef}
            className={cn('relative', {
                'w-fit': variant === 'primary',
                'w-full': variant === 'secondary',
            })}
            onKeyDown={handleKeyDown}
        >
            <div
                className={cn('relative cursor-pointer', {
                    'w-fit': variant === 'primary',
                    'w-full': variant === 'secondary',
                })}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <input
                    placeholder={placeholder || '__ - __ - ____'}
                    type="text"
                    name="birthday"
                    value={displayValue}
                    readOnly
                    className={cn(
                        'w-full rounded-[10px] border py-3 pr-3 text-base font-medium focus:outline-none cursor-pointer',
                        {
                            'max-w-[141px] border-[#A0A0A0] pl-10 text-[#4A4A4A]':
                                variant === 'primary',
                            'border-[#4A4A4A] py-5 pl-12':
                                variant === 'secondary',
                        },
                        inputClassName
                    )}
                />
                <div
                    className={cn(
                        'absolute left-0 top-0 p-[16px] pointer-events-none',
                        {
                            'p-[16px]': variant === 'primary',
                            'p-[25px] pl-[20px] pt-[21px]':
                                variant === 'secondary',
                        }
                    )}
                >
                    <Calendar
                        color="#E74949"
                        width={variant === 'primary' ? 16 : 16}
                        height={16}
                    />
                </div>
            </div>

            {isOpen && (
                <DataChooser handleSelectDate={handleSelectDate} />
            )}
        </div>
    );
};

export default SelectDate;

