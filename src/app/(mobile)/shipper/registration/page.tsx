'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/button';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
import Topbar from '@/components/topbar';
import { cn } from '@/utils/cn';
import type { ShipperType } from '../_types/shipper';
import { shipperTypeLabel } from '../_utils/shipper-utils';

const REGISTRATION_TYPES: ShipperType[] = ['individual', 'company'];

const ShipperRegistrationPage = () => {
    const router = useRouter();
    const [shipperType, setShipperType] = useState<ShipperType>('company');

    return (
        <>
            <Topbar backHref="/shipper/login">Joool Shipper</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <p className="text-sm font-bold text-[#E74949]">
                        Joool Shipper
                    </p>
                    <h1 className="mt-2 text-[2rem] font-bold leading-[2.4rem] text-[#4A4A4A]">
                        Регистрация заказчика
                    </h1>
                    <p className="leading-4.4 mt-3 text-sm text-[#A0A0A0]">
                        Создайте профиль для заказа грузоперевозок и управления
                        заявками.
                    </p>

                    <div className="mt-6 flex flex-col gap-2">
                        <Input
                            id="shipperName"
                            label="ФИО или название компании"
                            placeholder="ФИО или название компании"
                        />
                        <InputPhone
                            id="shipperRegistrationPhone"
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
                    </div>

                    <div className="mt-5">
                        <p className="text-sm font-semibold text-[#4A4A4A]">
                            Тип заказчика
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            {REGISTRATION_TYPES.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setShipperType(type)}
                                    className={cn(
                                        'rounded-[0.625rem] border px-4 py-4 text-sm font-semibold transition-colors',
                                        {
                                            'border-[#E74949] bg-[#FFF2F2] text-[#E74949]':
                                                shipperType === type,
                                            'border-[#D1D1D1] bg-white text-[#4A4A4A]':
                                                shipperType !== type,
                                        }
                                    )}
                                >
                                    {shipperTypeLabel[type]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-2">
                        <Input
                            id="shipperCity"
                            label="Город"
                            placeholder="Город"
                        />
                        <Input
                            id="shipperBin"
                            label="БИН/ИИН"
                            placeholder="БИН/ИИН"
                        />
                    </div>

                    <Button
                        variant="secondary"
                        className="mt-5"
                        onClick={() => router.push('/shipper')}
                    >
                        Дальше
                    </Button>
                    <button
                        type="button"
                        className="mt-4 w-full text-center text-base font-medium text-[#E23333] underline"
                        onClick={() => router.push('/shipper/login')}
                    >
                        Уже есть аккаунт
                    </button>
                </div>
            </div>
        </>
    );
};

export default ShipperRegistrationPage;
