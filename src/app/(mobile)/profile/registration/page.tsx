'use client'; //был заюзан Use client если что...
import React, { useEffect, useState } from 'react';
import Input from '@/components/input';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import Image from 'next/image';
import OTPPage from './_components/otp';
import InputPhone from '@/components/inputPhone';
import { useServerAction } from 'zsa-react';
import { sendOtpAction } from './actions';
import { sanitizePhone } from '@/utils/helper.';

const Registration = () => {
    const [showOTP, setShowOTP] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>('');
    const { execute, isPending } = useServerAction(sendOtpAction, {
        onSuccess: (data) => {
            console.log(data);
            setShowOTP(true);
        },
        onError: (error) => {
            console.log('Error happened', error);
        },
    });

    const handleContinue = () => {
        execute({ phone: sanitizePhone(phone) });
    };

    return (
        <>
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
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                    }}
                                />
                            </div>
                            <Button
                                variant="secondary"
                                onClick={handleContinue}
                                loading={isPending}
                            >
                                Продолжить
                            </Button>
                        </>
                    ) : (
                        <OTPPage phone={phone} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Registration;
