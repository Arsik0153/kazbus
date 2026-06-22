'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ru } from 'react-day-picker/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type ButtonProps = React.ComponentProps<typeof Button>;
type CalendarProps = React.ComponentProps<typeof Calendar>;
type PopoverProps = React.ComponentProps<typeof Popover>;
type PopoverContentProps = React.ComponentProps<typeof PopoverContent>;

export interface DatePickerProps
    extends Omit<
        ButtonProps,
        'children' | 'defaultValue' | 'onChange' | 'value'
    > {
    value?: Date | null;
    defaultValue?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: React.ReactNode;
    dateFormat?: string;
    formatDate?: (date: Date) => React.ReactNode;
    locale?: CalendarProps['locale'];
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnSelect?: boolean;
    calendarProps?: Omit<
        CalendarProps,
        'locale' | 'mode' | 'onSelect' | 'selected'
    >;
    popoverProps?: Omit<PopoverProps, 'defaultOpen' | 'onOpenChange' | 'open'>;
    popoverContentProps?: PopoverContentProps;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
    (
        {
            value,
            defaultValue,
            onChange,
            placeholder = 'Выберите дату',
            dateFormat = 'dd.MM.yyyy',
            formatDate,
            locale = ru,
            open,
            defaultOpen,
            onOpenChange,
            closeOnSelect = true,
            calendarProps,
            popoverProps,
            popoverContentProps,
            className,
            disabled,
            size = 'lg',
            variant = 'outline',
            ...buttonProps
        },
        ref
    ) => {
        const isDateControlled = value !== undefined;
        const [internalDate, setInternalDate] = React.useState<
            Date | undefined
        >(defaultValue);
        const date = isDateControlled ? (value ?? undefined) : internalDate;

        const isOpenControlled = open !== undefined;
        const [internalOpen, setInternalOpen] = React.useState(
            defaultOpen ?? false
        );
        const isOpen = isOpenControlled ? open : internalOpen;

        const handleOpenChange = (nextOpen: boolean) => {
            if (!isOpenControlled) {
                setInternalOpen(nextOpen);
            }

            onOpenChange?.(nextOpen);
        };

        const handleSelect = (nextDate: Date | undefined) => {
            if (!isDateControlled) {
                setInternalDate(nextDate);
            }

            onChange?.(nextDate);

            if (nextDate && closeOnSelect) {
                handleOpenChange(false);
            }
        };

        const {
            className: popoverContentClassName,
            ...otherPopoverContentProps
        } = popoverContentProps ?? {};

        return (
            <Popover
                {...popoverProps}
                open={isOpen}
                onOpenChange={handleOpenChange}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        type="button"
                        variant={variant}
                        size={size}
                        disabled={disabled}
                        data-empty={!date}
                        className={cn(
                            'data-[empty=true]:text-muted-foreground w-full max-w-[280px] justify-start text-left font-medium',
                            className
                        )}
                        {...buttonProps}
                    >
                        <CalendarIcon />
                        {date
                            ? (formatDate?.(date) ?? format(date, dateFormat))
                            : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className={cn('w-auto p-0', popoverContentClassName)}
                    {...otherPopoverContentProps}
                >
                    <Calendar
                        locale={locale}
                        mode="single"
                        captionLayout="dropdown"
                        selected={date}
                        onSelect={handleSelect}
                        {...calendarProps}
                    />
                </PopoverContent>
            </Popover>
        );
    }
);

DatePicker.displayName = 'DatePicker';
