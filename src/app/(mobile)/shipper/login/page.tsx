'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
import Topbar from '@/components/topbar';

const ShipperLoginPage = () => {
    const router = useRouter();

    return (
        <>
            <Topbar backHref="/shipper">Joool Shipper</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <p className="text-sm font-bold text-[#E74949]">
                        Joool Shipper
                    </p>
                    <h1 className="mt-2 text-[2rem] font-bold leading-[2.4rem] text-[#4A4A4A]">
                        Вход для заказчика
                    </h1>
                    <p className="leading-4.4 mt-3 text-sm text-[#A0A0A0]">
                        Введите рабочий номер телефона и код доступа, чтобы
                        открыть ваш кабинет заказчика.
                    </p>

                    <div className="mt-6 flex flex-col gap-2">
                        <InputPhone
                            id="shipperPhone"
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
                            id="shipperPassword"
                            label="Пароль или код"
                            type="password"
                            placeholder="Пароль или код"
                        />
                    </div>

                    <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => router.push('/shipper')}
                    >
                        Дальше
                    </Button>
                    <button
                        type="button"
                        className="mt-4 w-full text-center text-base font-medium text-[#E23333] underline"
                        onClick={() => router.push('/shipper/registration')}
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </>
    );
};

export default ShipperLoginPage;
