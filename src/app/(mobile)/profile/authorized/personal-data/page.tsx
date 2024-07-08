'use client';
import React, { useState } from 'react';
import Radio from '@/components/radio-input';
import Input from '@/components/input';
import Button from '@/components/button';
import Topbar from '@/components/topbar';

const PersonalDataPage = () => {
    const [selectedValue, setSelectedValue] = useState(null);

    const handleChange = (value: React.SetStateAction<null>) => {
        setSelectedValue(value);
    };
    const [value, setValue] = useState<string | null>(null);

    return (
        <>
            <Topbar backHref="/profile/authorized">Мои личные данные</Topbar>
            <div className="mb-4 mt-8 px-5">
                <div>
                    <div className="pb-3 text-[20px] font-medium leading-[22px] tracking-[-3%]">
                        Тип документа
                    </div>
                    <div>
                        <Radio
                            items={[
                                {
                                    label: 'Удостоверение личности',
                                    value: 'idCard',
                                },
                                {
                                    label: 'Паспорт',
                                    value: 'passport',
                                },
                                {
                                    label: 'Свидетельство о рождении',
                                    value: 'birthCertificate',
                                },
                            ]}
                            value={selectedValue}
                            onChange={setValue}
                            name={''}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2 pt-7">
                    <Input placeholder="Номер документа или ИИН" />
                    <Input placeholder="Дата рождения" />
                    <Input placeholder="Номер телефона" />
                </div>
                <Button variant="ghost" className="mt-7">
                    Изменить данные
                </Button>
            </div>
        </>
    );
};

export default PersonalDataPage;
