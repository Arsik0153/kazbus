'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
import Topbar from '@/components/topbar';

const CargoLoginPage = () => {
    const router = useRouter();

    return (
        <>
            <Topbar backHref="/cargo">Joool Cargo</Topbar>
            <div className="min-h-full bg-[var(--gray)] px-5 pb-28 pt-5">
                <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-5">
                    <p className="text-sm font-bold text-[#E74949]">
                        Joool Cargo
                    </p>
                    <h1 className="mt-2 text-[32px] font-bold leading-[38.4px] text-[#4A4A4A]">
                        Вход для водителя
                    </h1>
                    <p className="mt-3 text-sm leading-[17.6px] text-[#A0A0A0]">
                        Введите рабочий номер телефона и код доступа, чтобы
                        открыть ваш профиль водителя.
                    </p>

                    <div className="mt-6 flex flex-col gap-2">
                        <InputPhone
                            id="cargoPhone"
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
                            id="cargoPassword"
                            label="Пароль или код"
                            type="password"
                            placeholder="Пароль или код"
                        />
                    </div>

                    <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => router.push('/cargo')}
                    >
                        Дальше
                    </Button>
                    <button
                        type="button"
                        className="mt-4 w-full text-center text-base font-medium text-[#E23333] underline"
                        onClick={() => router.push('/cargo/registration')}
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </>
    );
};

export default CargoLoginPage;
