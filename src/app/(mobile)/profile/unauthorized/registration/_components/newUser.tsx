'use client'; //был заюзан Use client если что...
import React, { useState } from 'react';
import Input from '@/components/input';
import RadioInput from '@/components/radio-input';
import Image from 'next/image';
import Calendar from '../../../../../../../public/assets/calendar';
import Button from '@/components/button';

const Registration = () => {
    const items: { value: string; label: string }[] = [
        { value: 'udo', label: 'Удостоверение личности' },
        { value: 'pasport', label: 'Пасспорт' },
        { value: 'svid', label: 'Свидетельство о рождении' },
    ];
    const [value, setValue] = useState<string | null>(null);

    return (
        <>
            <div className="mt-10">
                <p className="mb-3 text-3xl font-medium text-[#4A4A4A]">
                    Данные пассажира
                </p>
                <Input label="Фио пассажира" id="UserPhone" />
                <p className="my-3 text-sm font-medium text-[#A0A0A0]">
                    При посадке в автобус ФИО будет сверяться с документом.
                    Пишите без сокращений.
                </p>
                <Input
                    label={
                        // <>
                        //     Электронная почта{' '}
                        //     <span className="text-[#A0A0A0]">(необязательно)</span>
                        // </>
                        'Электронная почта (необязательно)'
                        // Пытался изменить цвета у половины текста, не получилось (смотри ошибку)
                    }
                    id="mail"
                />
                <p className="mb-3 mt-9 text-xl font-medium text-[#4A4A4A]">
                    Выберите тип документа
                </p>
                <RadioInput
                    name="gender"
                    items={items}
                    value={value}
                    onChange={setValue}
                />
                <div className="mb-8 mt-10 flex flex-col gap-2">
                    <Input label="Номер документа или ИИН" id="iin" />
                    <Input
                        label="Дата рождения"
                        id="birth_date"
                        iconLeft={<Calendar color="#E74949" />}
                    />
                </div>
                <Button variant="secondary">Закончить регистрацию</Button>
            </div>
        </>
    );
};

export default Registration;
