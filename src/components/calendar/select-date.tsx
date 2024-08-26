'use client';
import React, { useState, useRef, useEffect } from 'react';
import Calendar from '@/assets/calendar';
import DataChooser from '@/components/calendar/data-chooser';
import clsx from 'clsx';

type SelectDateProps = {
    placeholder?: string;
    variant?: 'primary' | 'secondary';
    value: string;
    onChange: (date: string) => void;
};

const SelectDate: React.FC<SelectDateProps> = ({
    placeholder,
    variant = 'primary',
    onChange,
    value,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dataChooserRef = useRef<HTMLDivElement | null>(null);

    const handleSelectDate = (date: string) => {
        onChange(date);
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
                <input
                    placeholder={placeholder || '__ - __ - ____'}
                    type="text"
                    name="birthday"
                    value={value}
                    className={clsx(
                        'rounded-[10px] border py-3 pr-3 text-base font-medium focus:outline-none',
                        {
                            'max-w-[141px] border-[#A0A0A0] pl-10 text-[#4A4A4A]':
                                variant === 'primary',
                            'w-full border border-[#4A4A4A] py-5 pl-12':
                                variant === 'secondary',
                        }
                    )}
                    onChange={(e) => onChange(e.target.value)}
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
