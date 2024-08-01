'use client'; //был заюзан Use client если что...
import React, { useState } from 'react';
import Input from '@/components/input';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import Image from 'next/image';
import OTPPage from './_components/otp';
import InputPhone from '@/components/inputPhone';

const Registration = () => {
    const [showOTP, setShowOTP] = useState<boolean>(false);

    const handleContinue = () => {
        setShowOTP(true);
    };

    return (
        <>
            {/* Учти что при нажатий кнопки назад при входе в OTP она будет выбрасывать тебя на /start (начальная страница регистрации) */}
            <Topbar backHref="/start">Регистрация</Topbar>

            <div className="h-full px-5">
                <div className="flex flex-col gap-1">
                    {!showOTP ? (
                        <>
                            <p className="mt-24 text-4xl font-medium text-[#4A4A4A]">
                                Введите ваш <br /> номер телефона
                            </p>
                            <div className="my-3 flex flex-col gap-2">
                                <InputPhone
                                    id="userPhone"
                                    label="None label here"
                                    placeholder="+7 (___) ___ - __ - __"
                                    mask="+7 (___) ___-__-__"
                                    iconLeft={
                                        <Image
                                            src={'/assets/main/kz.png'}
                                            width={24}
                                            height={26}
                                            alt="KZ"
                                        />
                                    }
                                />
                            </div>
                            <Button
                                variant="secondary"
                                onClick={handleContinue}
                            >
                                Продолжить
                            </Button>
                            {/* если нажал на кнопку то все это нахер стирается и рендерится <OTPPage /> */}
                        </>
                    ) : (
                        <>
                            <OTPPage />
                            {/* Регистрация рендерится внутри OTPPage */}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Registration;
