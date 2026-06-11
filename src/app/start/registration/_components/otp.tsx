import React from 'react';
import Mail from '@/assets/mail';
import Button from '@/components/button';
import Link from 'next/link';
import InputPhone from '@/components/inputPhone';

// REGISTRATION
const otp = () => {
    return (
        <div className="flex flex-col items-center">
            <Mail color="white" />
            <p className="mb-4 mt-5 text-center text-[32px] font-bold leading-9 text-white">
                На ваш телефон пришел СМС-код
            </p>
            <p className="text-sm font-medium text-white">
                Введите 4-х значный код
            </p>
            <div className="mt-8 flex w-full flex-col items-center gap-2">
                <InputPhone
                    id="newUserPhone"
                    label="None label here"
                    variant="ghostOTP"
                    placeholder="0000"
                    mask="____"
                    type="tel"
                />
                <Link
                    href="/bus/main?passenger_count=1"
                    className="mt-2 w-full"
                >
                    <Button>Начать поиск билетов</Button>
                </Link>
            </div>
        </div>
    );
};

export default otp;
