'use client';
import React, { useState } from 'react';
import Topbar from '@/components/topbar';
import RadioInput from '@/components/radio-input';
import Button from '@/components/button';
import Link from 'next/link';

const Reason = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleRadioChange = (value: string) => {
        setSelectedOption(value);
        console.log("Selected option:", value); // Выводим выбранный ответ в консоль
    };

    return (
        <>
            <Topbar backHref="/main">
                <h1 className="text-[20px] font-medium leading-[46.2px] tracking-[-3%] text-white">
                    Оформить возврат
                </h1>
            </Topbar>
            <div className="flex flex-col px-5 pt-9 gap-2">
                <RadioInput 
                    label='Изменились планы' 
                    name='return-reason' 
                    value='Изменились планы' 
                    checked={selectedOption === 'Изменились планы'} 
                    onChange={() => handleRadioChange('Изменились планы')} 
                />
                <RadioInput 
                    label='Купил по ошибке' 
                    name='return-reason' 
                    value='Купил по ошибке' 
                    checked={selectedOption === 'Купил по ошибке'} 
                    onChange={() => handleRadioChange('Купил по ошибке')} 
                />
                <RadioInput 
                    label='Перепутал маршруты' 
                    name='return-reason' 
                    value='Перепутал маршруты' 
                    checked={selectedOption === 'Перепутал маршруты'} 
                    onChange={() => handleRadioChange('Перепутал маршруты')} 
                />
                <RadioInput 
                    label='Не успеваю на Рейс' 
                    name='return-reason' 
                    value='Не успеваю на Рейс' 
                    checked={selectedOption === 'Не успеваю на Рейс'} 
                    onChange={() => handleRadioChange('Не успеваю на Рейс')} 
                />
                <RadioInput 
                    label='Другое' 
                    name='return-reason' 
                    value='Другое' 
                    checked={selectedOption === 'Другое'} 
                    onChange={() => handleRadioChange('Другое')} 
                />
            </div>

            {selectedOption && (
                <Link href='/next-step' className='fixed bottom-28 left-5 right-5'>
                    <Button variant='secondary'>Продолжить</Button>
                </Link>
            )}
        </>
    );
}

export default Reason;
