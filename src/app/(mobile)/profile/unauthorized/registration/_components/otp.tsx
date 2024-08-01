'use client';

import React, { useState, useEffect } from 'react';
import OTPInput from '@/components/OTPInput';
import Button from '@/components/button';
import NewUser from '@/app/(mobile)/profile/unauthorized/registration/_components/newUser';

const OTPPage: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);

    const handleOtpChange = (newOtp: string[]) => {
        setOtp(newOtp);
    };

    useEffect(() => {
        // Проверяем, заполнены ли все поля
        setIsButtonVisible(otp.every((value) => value !== ''));
    }, [otp]);

    //
    const [showNewUser, setShowNewUser] = useState<boolean>(false);

    const handleContinue = () => {
        setShowNewUser(true);
    };
    //
    return (
        <>
            {!showNewUser ? (
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
                            >
                                Продолжить
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <NewUser />
                </>
            )}
        </>
    );
};

export default OTPPage;
