'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
import Topbar from '@/components/topbar';

const BusDriverLoginPage = () => {
    const router = useRouter();

    return (
        <>
            <Topbar backHref="/busdriver">Bus Driver</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <p className="text-sm font-bold text-[#E74949]">
                        Bus Driver
                    </p>
                    <h1 className="mt-2 text-[2rem] font-bold leading-[2.4rem] text-[#4A4A4A]">
                        Вход для водителя
                    </h1>
                    <p className="leading-4.4 mt-3 text-sm text-[#A0A0A0]">
                        Введите рабочий номер телефона и пароль, чтобы открыть
                        рейс, пассажиров и информацию по автобусу.
                    </p>

                    <div className="mt-6 flex flex-col gap-2">
                        <InputPhone
                            id="busDriverPhone"
                            label="Телефон"
                            placeholder="+7 (___) ___ - __ - __"
                            mask="+7 (___) ___-__-__"
                            type="tel"
                            iconLeft={
                                <Image
                                    src="/assets/main/kz.png"
                                    width={24}
                                    height={26}
                                    alt="KZ"
                                    quality={100}
                                />
                            }
                        />
                        <Input
                            id="busDriverPassword"
                            label="Пароль"
                            type="password"
                            placeholder="Пароль"
                        />
                    </div>

                    <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => router.push('/busdriver')}
                    >
                        Открыть смену
                    </Button>
                </div>
            </div>
        </>
    );
};

export default BusDriverLoginPage;
