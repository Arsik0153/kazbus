'use client';
import React, { useState } from 'react';
import Bus from '@/assets/bus';
import Button from '@/components/button';
import Link from 'next/link';
import InputPhone from '@/components/inputPhone';
import Image from 'next/image';
import MenuArrow from '@/assets/menu-arrow';
import toast from 'react-hot-toast';
import { useServerAction } from 'zsa-react';
import { sendOtpAction } from '../actions';
import { sanitizePhone } from '@/utils/helper.';
import Mail from '@/assets/mail';
import { loginAction } from '@/app/(mobile)/profile/registration/actions';
import { useRouter } from 'next/navigation';
import Checkbox from '@/components/checkbox';

const Login = () => {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [isAgree, setIsAgree] = useState<boolean>(false);
    const router = useRouter();
    const { execute: sendOtp, isPending: isOtpLoading } = useServerAction(
        sendOtpAction,
        {
            onSuccess: () => {
                setStep(2);
            },
            onError: (error) => {
                toast.error(error.err.message);
            },
        }
    );
    const { execute, isPending } = useServerAction(loginAction, {
        onSuccess: () => {
            router.push('/main?passenger_count=1');
        },
        onError: (error) => {
            console.log(error);
            if (error.err.name === 'ZodError') {
                toast.error(
                    error.err.fieldErrors?.otp?.[0] ||
                        'Произошла ошибка при подтверждении кода'
                );
                return;
            }
            toast.error(error.err.message);
        },
    });

    const isButtonDisabled = !phone || phone.length < 18 || !isAgree;

    const handleNextStep = () => {
        if (phone.length < 18) {
            toast.error('Введите корректный номер телефона');
            return;
        }
        sendOtp({ phone: sanitizePhone(phone) });
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
                        Окей, давайте зайдем на ваш аккаунт
                    </p>
                    <p className="text-sm font-medium text-white">
                        Введите свой номер телефона, и получите <br /> 4-х
                        значный код для входа
                    </p>
                    <div className="mt-8 flex w-full flex-col items-center gap-2">
                        <InputPhone
                            id="newUserPhone"
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
                                    quality={100}
                                />
                            }
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                            }}
                        />
                        <div className="mt-">
                            <Checkbox
                                label={
                                    <>
                                        Нажмите здесь, чтобы принять{' '}
                                        <Link
                                            href="/start/terms"
                                            className="underline"
                                            rel="prefetch"
                                        >
                                            условия соглашения
                                        </Link>{' '}
                                        и ознакомиться с нашей{' '}
                                        <Link
                                            href="/start/policy"
                                            className="underline"
                                            rel="prefetch"
                                        >
                                            политикой конфиденциальности
                                        </Link>
                                    </>
                                }
                                checked={isAgree}
                                onChange={() => setIsAgree(!isAgree)}
                            />
                        </div>
                        <div className="mt-2 w-full">
                            <Button
                                disabled={isButtonDisabled}
                                onClick={handleNextStep}
                                loading={isOtpLoading}
                            >
                                Продолжить
                            </Button>
                        </div>
                        {/* <Link
                            href="/start/registration"
                            className="mt-11 text-base font-medium text-white underline"
                        >
                            Перейти к регистрации
                        </Link> */}
                    </div>
                </>
            )}

            {step === 2 && (
                <>
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
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value);
                                }}
                            />

                            <Button
                                onClick={() =>
                                    execute({
                                        phone: sanitizePhone(phone),
                                        otp,
                                    })
                                }
                                loading={isPending}
                            >
                                Начать поиск билетов
                            </Button>
                        </div>
                    </div>
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

                    <MenuArrow color="#E74949" />
                </>
            )}
        </div>
    );
};

export default Login;
