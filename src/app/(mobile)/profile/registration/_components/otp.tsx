'use client';

import React, { useState, useEffect } from 'react';
import OTPInput from '@/components/OTPInput';
import Button from '@/components/button';
import NewUser from '@/app/(mobile)/profile/registration/_components/new-user';
import { useServerAction } from 'zsa-react';
import { loginAction } from '../actions';
import { sanitizePhone } from '@/utils/helper.';

const OTPPage = ({ phone }: { phone: string }) => {
    const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
    const [showNewUser, setShowNewUser] = useState<boolean>(false);
    const { execute, isPending } = useServerAction(loginAction, {
        onSuccess: (data) => {
            console.log(data);
            setShowNewUser(true);
        },
        onError: (error) => {
            console.log('Error happened', error);
        },
    });

    const handleOtpChange = (newOtp: string[]) => {
        setOtp(newOtp);
    };

    const handleContinue = () => {
        execute({ otp: otp.join(''), phone: sanitizePhone(phone) });
    };

    useEffect(() => {
        setIsButtonVisible(otp.every((value) => value !== ''));
    }, [otp]);

    if (showNewUser) return <NewUser />;

    return (
        <div className="mt-24 flex flex-col gap-6">
            <p className="text-4xl font-medium text-[#4A4A4A]">
                Введите 4-х <br /> значный код с <br /> смс-сообщения
            </p>

            <OTPInput onChange={handleOtpChange} />

            {isButtonVisible && (
                <div
                    className={`transition-opacity duration-500 ease-in-out ${isButtonVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{
                        transition:
                            'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                    }}
                >
                    <Button
                        variant="secondary"
                        className="mb-3"
                        onClick={handleContinue}
                        loading={isPending}
                    >
                        Продолжить
                    </Button>
                </div>
            )}
        </div>
    );
};

export default OTPPage;
