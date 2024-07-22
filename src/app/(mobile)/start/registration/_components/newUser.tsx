'use client'; //был заюзан Use client если что...
import React, { useState } from 'react';
import Input from '@/components/input';
import RadioInput from '@/components/radio-input';
import Image from 'next/image';
import Calendar from '../../../../../../public/assets/calendar';
import Button from '@/components/button';

const Registration = () => {

    const items: { value: string, label: string }[] = [
        { value: 'udo', label: 'Удостоверение личности' },
        { value: 'pasport', label: 'Пасспорт' },
        { value: 'svid', label: 'Свидетельство о рождении' },

    ]
    const [value, setValue] = useState<string | null>(null);

    return (
        <>
            <div className="mt-10">
                <p className="text-3xl font-medium text-[#4A4A4A] mb-3">Данные пассажира</p>
                <Input
                    label='Фио пассажира'
                    id="UserPhone"
                />
                <p className="text-sm font-medium text-[#A0A0A0] my-3">При посадке в автобус ФИО будет сверяться с документом. Пишите без сокращений.</p>
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
                <p className="text-xl font-medium text-[#4A4A4A] mt-9 mb-3">Выберите тип документа</p>
                <RadioInput
                    name='gender'
                    items={items}
                    value={value}
                    onChange={setValue}
                />
                <div className="flex flex-col gap-2 mt-10 mb-8">
                    <Input
                        label='Номер документа или ИИН'
                        id="iin"
                    />
                    <Input
                        label="Дата рождения"
                        id="birth_date"
                        iconLeft={<Calendar color="#E74949" />}
                    />
                </div>
                <Button variant='secondary' >
                    Закончить регистрацию
                </Button>

            </div>


        </>
    );
};

export default Registration;
