'use client';
import React, { useState } from 'react';
import Bus from '@/assets/bus';
import InputPhone from '@/components/inputPhone';
import Image from 'next/image';
import Button from '@/components/button';
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
        <div className="relative flex h-full w-screen flex-col justify-center bg-gradient-to-t from-[#E32828] to-[#e44444] px-5">
            {step === 1 && (
                <>
                    <Bus color="white" />
                    <p className="mb-4 mt-5 text-[32px] font-bold leading-9 text-white">
                        Перед тем, как начать поиски, давайте зарегистрируемся
                    </p>
                    <p className="text-sm font-medium text-white">
                        Введите свой номер телефона, и получите <br /> 4-х
                        значный код для входа
                    </p>
                    <div className="mt-8 flex flex-col items-center gap-2">
                        <InputPhone
                            id="oldUserPhone"
                            label="None label here"
                            variant="ghost"
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
                        <div className="mt-2 w-full">
                            <Button onClick={handleNextStep}>Продолжить</Button>
                        </div>
                        <Link
                            href="/start/login"
                            className="mt-11 text-base font-medium text-white underline"
                        >
                            Я уже зарегистрирован
                        </Link>
                    </div>
                </>
            )}
            {step === 2 && (
                <>
                    <Otp />
                    <div className="flex justify-center">
                        <button
                            onClick={handlePrevStep}
                            className="mt-11 flex flex-row items-center gap-2 text-center text-base font-medium text-white underline"
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3.21903 5.33327H11.3334V6.6666H3.21903L6.79501 10.2425L5.85221 11.1853L0.666748 5.99993L5.85221 0.814453L6.79501 1.75726L3.21903 5.33327Z"
                                    fill="white"
                                />
                            </svg>
                            Ввести другой номер
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Registration;
