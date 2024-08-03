import Input from '@/components/input';
import React, { useState } from 'react';
import Calendar from '../../../../../public/assets/calendar';
import Topbar from '@/components/topbar';
import InputFromMain from '@/components/inputFromMain';
import DatePicker from './date-picker';
import { Dayjs } from 'dayjs';

const SelectDate = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    const handleSelectDate = (date: Dayjs) => {
        setSelectedDate(date);
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
        <Input
            label="Дата отправления"
            id="date"
            variant="ghost"
            iconLeft={<Calendar color="white" />}
            onClick={() => setIsOpen(true)}
            defaultValue={selectedDate?.format('DD.MM.YYYY')}
        />
    );
};

export default SelectDate;
