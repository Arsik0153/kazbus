'use client';

import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { dayjsExt } from '@/lib/dayjs';

type BirthDatePickerProps = {
    id: string;
    label: string;
    value?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    invalid?: boolean;
    placeholder?: string;
};

const parseBirthDate = (value?: string) => {
    if (!value) return null;

    const parsedDate = dayjsExt(value, 'DD.MM.YYYY', true);

    return parsedDate.isValid() ? parsedDate.toDate() : null;
};

const currentYear = new Date().getFullYear();

const BirthDatePicker = ({
    id,
    label,
    value,
    onChange,
    onBlur,
    invalid,
    placeholder = 'Выберите дату',
}: BirthDatePickerProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-base font-bold text-[#4A4A4A]">
                {label}
            </label>
            <DatePicker
                id={id}
                value={parseBirthDate(value)}
                onChange={(date) =>
                    onChange(date ? format(date, 'dd.MM.yyyy') : '')
                }
                onBlur={onBlur}
                placeholder={placeholder}
                aria-invalid={invalid}
                className="h-[60px] max-w-none justify-start rounded-[10px] border border-black/60 bg-white px-5 text-xl font-medium text-[#4A4A4A] hover:bg-white data-[empty=true]:text-[#4A4A4A] [&_svg]:mr-2 [&_svg]:size-6"
                popoverContentProps={{
                    align: 'start',
                    className: 'w-auto p-0',
                }}
                calendarProps={{
                    startMonth: new Date(1900, 0),
                    endMonth: new Date(currentYear, 11),
                    disabled: { after: new Date() },
                }}
            />
        </div>
    );
};

export default BirthDatePicker;
