'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';

const CargoLoginPage = () => {
    const router = useRouter();

    return (
        <div className="flex min-h-full items-center px-5 pb-28 pt-20">
            <div className="w-full">
                <h1 className="text-[1.75rem] font-bold leading-[2rem] text-[#4A4A4A]">
                    Вход
                </h1>
                <p className="mt-3 text-lg font-bold leading-5 text-[#4A4A4A]">
                    Joool Cargo
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
                    className="mt-6"
                    onClick={() => router.push('/cargo')}
                >
                    Войти
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
    );
};

export default CargoLoginPage;
