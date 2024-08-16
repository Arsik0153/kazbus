'use client';
import React, { useState } from 'react';
import Topbar from '@/components/topbar';
import OTPPage from './_components/otp';
import PhoneStep from './_components/phone-step';
import NewUser from './_components/new-user';
import SetPassword from './_components/set-password';
import { Steps } from './types';

const Registration = () => {
    const [step, setStep] = useState<Steps>(Steps.PHONE);
    const [phone, setPhone] = useState<string>('');

    return (
        <>
            <Topbar backHref="/profile">Регистрация</Topbar>

            <div className="h-full px-5">
                <div className="flex flex-col gap-1">
                    {step === Steps.PHONE && (
                        <PhoneStep
                            setStep={setStep}
                            phone={phone}
                            setPhone={setPhone}
                        />
                    )}
                    {step === Steps.OTP && (
                        <OTPPage phone={phone} setStep={setStep} />
                    )}
                    {step === Steps.PASSWORD && (
                        <SetPassword setStep={setStep} />
                    )}
                    {step === Steps.NEW_USER && <NewUser />}
                </div>
            </div>
        </>
    );
};

export default Registration;
