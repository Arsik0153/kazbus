'use client';

import React, { useState } from 'react';

import FullPageSelector from '@/components/fullpageselector';
import ArrowRightIcon from '../../public/assets/arrow-right-icon';
import RadioInput from '@/components/radio-input';
import Input from '@/components/input';
import Testd from '@/components/test';


export default function Home() {
    const items: { value: string, label: string }[] = [
        { value: 'udo', label: 'Удостоверение личности' },
        { value: 'pasport', label: 'Пасспорт' },
        { value: 'svid', label: 'Свидетельство о рождении' },

    ]
    const [value, setValue] = useState<string | null>(null);

    return (
        <main className="flex min-h-screen flex-col items-center bg-sky-500/100 p-10">
            <FullPageSelector
                icon={<ArrowRightIcon />}
                text={'Откуда вы направляетесь?'}
            />
            <div className="flex flex-col gap-2 ">
                <RadioInput
                    name='gender'
                    items={items}
                    value={value}
                    onChange={setValue}
                />
                <Input
                    // label='ewfwefwefwef'
                    placeholder='ФИО пассажира'
                    />
                {/* <Testd
                    name='gender'
                    items={items}
                    value={value}
                    onChange={setValue}
                    /> */}
            </div>
        </main>
    );
}