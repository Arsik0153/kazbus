'use client';
import React, { useState } from 'react';
import Bus from '@/assets/bus';
import InputFromMain from '@/components/inputFromMain';
import InputPhone from '@/components/inputPhone';
import Image from 'next/image';
import Button from '@/components/button';
import EllipsStart from '@/assets/EllipsStart';
import Link from 'next/link';
import Otp from './_components/otp';

const Registration = () => {
    const [step, setStep] = useState(1);
    const handleNextStep = () => {
        setStep(2);
    };
    const handlePrevStep = () => {
        setStep(1);
    };
    return (
        <div className='flex flex-col relative px-5 justify-center bg-gradient-to-t from-[#E32828] to-[#e44444] w-screen h-full'>
            {/* <div className="absolute w-full top-0 left-0">
                <EllipsStart />
            </div> */}
            {step === 1 && (
                <>
                    <Bus color='white' />
                    <p className="mt-5 mb-4 text-[32px] leading-9 font-bold text-white">Перед тем, как начать поиски, давайте зарегистрируемся</p>
                    <p className=" text-sm font-medium text-white">Введите свой номер телефона, и получите <br /> 4-х значный код для входа</p>
                    <div className="flex flex-col items-center gap-2 mt-8">
                        <InputPhone
                            id="oldUserPhone"
                            label="None label here"
                            variant='ghost'
                            placeholder="+7 (___) ___ - __ - __"
                            mask="+7 (___) ___-__-__"
                            type="tel"
                            iconLeft={
                                <Image
                                    src={'/assets/main/kz.png'}
                                    width={24}
                                    height={26}
                                    alt="KZ"
                                />
                            }
                        />
                        <div className="w-full mt-2">
                            <Button onClick={handleNextStep}>Продолжить</Button>
                        </div>
                        <Link href='/main/start/login' className=' underline text-base font-medium text-white mt-11'>Я уже зарегистрирован</Link>
                    </div>
                </>
            )}
            {step === 2 && (
                <>
                    <Otp />
                    <div className="flex justify-center">
                        <button onClick={handlePrevStep} className='flex flex-row gap-2 items-center underline text-center text-base font-medium text-white mt-11'>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.21903 5.33327H11.3334V6.6666H3.21903L6.79501 10.2425L5.85221 11.1853L0.666748 5.99993L5.85221 0.814453L6.79501 1.75726L3.21903 5.33327Z" fill="white" />
                            </svg>
                            Ввести другой номер
                        </button>
                    </div>
                </>

            )}
        </div>
    )
}

export default Registration;