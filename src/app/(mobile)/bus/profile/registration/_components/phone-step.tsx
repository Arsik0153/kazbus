import React, { useState } from 'react';
import Button from '@/components/button';
import Image from 'next/image';
import InputPhone from '@/components/inputPhone';
import { useServerAction } from 'zsa-react';
import { sendOtpAction } from '../actions';
import toast from 'react-hot-toast';
import { sanitizePhone } from '@/utils/helper.';
import { Steps } from '../types';

type Props = {
    setStep: (step: Steps) => void;
    phone: string;
    setPhone: (phone: string) => void;
};

const PhoneStep = (props: Props) => {
    const { setStep, phone, setPhone } = props;
    const { execute, isPending } = useServerAction(sendOtpAction, {
        onSuccess: () => {
            setStep(Steps.OTP);
        },
        onError: (error) => {
            toast.error(error.err.message);
        },
    });

    const handleContinue = () => {
        if (phone.length < 18) {
            toast.error('Введите корректный номер телефона');
            return;
        }
        execute({ phone: sanitizePhone(phone) });
    };

    return (
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
                    type="tel"
                    iconLeft={
                        <Image
                            src={'/assets/main/kz.png'}
                            width={24}
                            height={26}
                            alt="KZ"
                            quality={100}
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
    );
};

export default PhoneStep;
