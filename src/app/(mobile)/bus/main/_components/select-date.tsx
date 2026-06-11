import Input from '@/components/input';
import React, { useState } from 'react';
import Calendar from '@/assets/calendar';
import Topbar from '@/components/topbar';
import InputFromMain from '@/components/inputFromMain';
import DatePicker from './date-picker';
import { Dayjs } from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { dayjsExt } from '@/lib/dayjs';
import ArrowLeft from '@/assets/shared/arrow-left';
import { AnimatePresence, motion } from 'framer-motion';
import { slideAnimation, overlayAnimation } from '@/static/animation';

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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="overlay"
                    className="fixed inset-0 z-20 bg-black"
                    {...overlayAnimation}
                />
            )}
            {isOpen && (
                <motion.div
                    key="select-date-modal"
                    className="fixed inset-0 z-30 h-full min-h-screen w-full overflow-hidden bg-[var(--bg)]"
                    {...slideAnimation}
                >
                    <Topbar className="mx-0 w-full">
                        <InputFromMain
                            iconLeft={<Calendar color="white" />}
                            id="whereFrom"
                            label="Дата отправления"
                            disabled
                        />
                    </Topbar>
                    <div
                        className="flex w-full items-center justify-between border-b-[1px] border-b-[#CDCDCD] px-5 py-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <ArrowLeft color="#4a4a4a" />
                        <p className="text-[14px] font-medium text-[#4A4A4A]">
                            Вернуться назад
                        </p>
                        <div />
                    </div>
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
                </motion.div>
            )}
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
        </AnimatePresence>
    );
};

export default SelectDate;
