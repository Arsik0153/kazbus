'use client';

import React, { useState } from 'react';

import FullPageSelector from '@/components/fullpageselector';
import ArrowRightIcon from '../../public/assets/arrow-right-icon';
import RadioInput from '@/components/radio-input';
import Input from '@/components/input';

export default function Home() {
    const items: { value: string; label: string }[] = [
        { value: 'udo', label: 'Удостоверение личности' },
        { value: 'pasport', label: 'Пасспорт' },
        { value: 'svid', label: 'Свидетельство о рождении' },
    ];
    const [value, setValue] = useState<string | null>(null);

    return (
        <main className="flex min-h-screen w-full flex-col items-center p-10">
            <FullPageSelector
                icon={<ArrowRightIcon />}
                text={'Откуда вы направляетесь?'}
            />
            <div className="mb-10 flex flex-col gap-10">
                <RadioInput
                    name="gender"
                    items={items}
                    value={value}
                    onChange={setValue}
                />
            </div>
            <Input id="email" label="Фио пассажира" type="email" />
        </main>
    );
}
