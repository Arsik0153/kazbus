import Input from '@/components/input';
import React, { useState } from 'react';
import Calendar from '../../../../assets/calendar';
import Topbar from '@/components/topbar';
import InputFromMain from '@/components/inputFromMain';
import DatePicker from './date-picker';
import { Dayjs } from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { dayjsExt } from '@/lib/dayjs';

const SelectDate = () => {
    const [isOpen, setIsOpen] = useState(false);

    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const formattedDate = dateParam
        ? dayjsExt(dateParam).format('DD.MM.YYYY')
        : '';

    const handleSelectDate = () => {
        setIsOpen(false);
    };

    if (isOpen)
        return (
            <div>
                <div className="fixed inset-0 z-30 h-screen w-full overflow-auto bg-[var(--bg)]">
                    <Topbar className="mx-0 w-full">
                        <InputFromMain
                            iconLeft={<Calendar color="white" />}
                            id="whereFrom"
                            label="Откуда вы отправляетесь?"
                        />
                    </Topbar>
                    <div className="relative text-left">
                        <div className="grid w-full grid-cols-7 border-b border-[#dbdbdb] px-5 py-3 text-center text-base font-medium text-[var(--black)]">
                            <div>Пн</div>
                            <div>Вт</div>
                            <div>Ср</div>
                            <div>Чт</div>
                            <div>Пт</div>
                            <div>Сб</div>
                            <div>Вс</div>
                        </div>
                        <DatePicker handleSelectDate={handleSelectDate} />
                    </div>
                </div>
            </div>
        );

    return (
        <div onClick={() => setIsOpen(true)}>
            <div className="pointer-events-none">
                <Input
                    label="Дата отправления"
                    id="date"
                    variant="ghost"
                    iconLeft={<Calendar color="white" />}
                    defaultValue={formattedDate}
                    key={formattedDate}
                    hideKeyboardOnFocus={false}
                    containerClassName="xs:pt-[30px] xs:pb-[16px]"
                />
            </div>
        </div>
    );
};

export default SelectDate;
