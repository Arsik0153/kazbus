'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useServerAction } from 'zsa-react';
import Button from '@/components/button';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
import Topbar from '@/components/topbar';
import { sanitizePhone } from '@/utils/helper.';
import {
    initiateBusDriverAction,
    loginBusDriverAction,
    setBusDriverPasswordAction,
    verifyBusDriverCodeAction,
} from './actions';

type Step = 'phone' | 'code' | 'password' | 'set_password';

const BusDriverLoginPage = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [onboardingToken, setOnboardingToken] = useState<string>();

    const error = ({ err }: { err: Error }) => toast.error(err.message);
    const { execute: initiate, isPending: initiating } = useServerAction(
        initiateBusDriverAction,
        {
            onSuccess: ({ data }) =>
                setStep(data.next_step === 'verify_code' ? 'code' : 'password'),
            onError: error,
        }
    );
    const { execute: verify, isPending: verifying } = useServerAction(
        verifyBusDriverCodeAction,
        {
            onSuccess: ({ data }) => {
                setOnboardingToken(data.onboarding_token);
                setStep(data.next_step);
            },
            onError: error,
        }
    );
    const { execute: login, isPending: loggingIn } = useServerAction(
        loginBusDriverAction,
        {
            onSuccess: () => router.replace('/busdriver'),
            onError: error,
        }
    );
    const { execute: setAccountPassword, isPending: settingPassword } =
        useServerAction(setBusDriverPasswordAction, {
            onSuccess: () => router.replace('/busdriver'),
            onError: error,
        });

    const normalizedPhone = sanitizePhone(phone);
    const reset = () => {
        setStep('phone');
        setCode('');
        setPassword('');
        setRepeatPassword('');
        setOnboardingToken(undefined);
    };

    return (
        <>
            <Topbar backHref="/">Bus Driver</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <p className="text-sm font-bold text-[#E74949]">
                        Bus Driver
                    </p>
                    <h1 className="mt-2 text-[2rem] font-bold leading-[2.4rem] text-[#4A4A4A]">
                        {step === 'set_password'
                            ? 'Создайте пароль'
                            : 'Вход для водителя'}
                    </h1>
                    <p className="leading-4.4 mt-3 text-sm text-[#A0A0A0]">
                        {step === 'phone' &&
                            'Введите рабочий номер, указанный вашим автопарком.'}
                        {step === 'code' &&
                            'Введите четырёхзначный код из SMS.'}
                        {step === 'password' &&
                            'Введите пароль от вашего аккаунта.'}
                        {step === 'set_password' &&
                            'Пароль будет использоваться для следующих входов.'}
                    </p>

                    <div className="mt-6 flex flex-col gap-2">
                        {step === 'phone' && (
                            <InputPhone
                                id="busDriverPhone"
                                label="Телефон"
                                placeholder="+7 (___) ___-__-__"
                                mask="+7 (___) ___-__-__"
                                type="tel"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(event.target.value)
                                }
                                iconLeft={
                                    <Image
                                        src="/assets/main/kz.png"
                                        width={24}
                                        height={26}
                                        alt="KZ"
                                    />
                                }
                            />
                        )}
                        {step === 'code' && (
                            <InputPhone
                                id="busDriverCode"
                                label="SMS-код"
                                placeholder="0000"
                                mask="____"
                                type="tel"
                                value={code}
                                onChange={(event) =>
                                    setCode(event.target.value)
                                }
                            />
                        )}
                        {(step === 'password' || step === 'set_password') && (
                            <Input
                                id="busDriverPassword"
                                label="Пароль"
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.currentTarget.value)
                                }
                            />
                        )}
                        {step === 'set_password' && (
                            <Input
                                id="busDriverRepeatPassword"
                                label="Повторите пароль"
                                type="password"
                                placeholder="Повторите пароль"
                                value={repeatPassword}
                                onChange={(event) =>
                                    setRepeatPassword(event.currentTarget.value)
                                }
                            />
                        )}
                    </div>

                    <Button
                        variant="secondary"
                        className="mt-4"
                        loading={
                            initiating ||
                            verifying ||
                            loggingIn ||
                            settingPassword
                        }
                        disabled={
                            (step === 'phone' &&
                                normalizedPhone.length !== 11) ||
                            (step === 'code' && code.length !== 4) ||
                            (step === 'password' && password.length < 8) ||
                            (step === 'set_password' &&
                                (password.length < 8 ||
                                    repeatPassword.length < 8))
                        }
                        onClick={() => {
                            if (step === 'phone')
                                initiate({ phone: normalizedPhone });
                            if (step === 'code')
                                verify({ phone: normalizedPhone, code });
                            if (step === 'password')
                                login({
                                    phone: normalizedPhone,
                                    password,
                                    onboarding_token: onboardingToken,
                                });
                            if (step === 'set_password' && onboardingToken)
                                setAccountPassword({
                                    phone: normalizedPhone,
                                    password,
                                    repeat_password: repeatPassword,
                                    onboarding_token: onboardingToken,
                                });
                        }}
                    >
                        {step === 'phone' && 'Продолжить'}
                        {step === 'code' && 'Подтвердить номер'}
                        {step === 'password' && 'Открыть смену'}
                        {step === 'set_password' && 'Сохранить пароль'}
                    </Button>

                    {step !== 'phone' && (
                        <button
                            type="button"
                            className="mt-4 w-full text-sm text-[#E74949] underline"
                            onClick={reset}
                        >
                            Ввести другой номер
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default BusDriverLoginPage;
