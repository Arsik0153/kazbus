import React from 'react';
import Input from '@/components/input';
import kzFlagUrl from '@/assets/shared/🇰🇿.svg';
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import FlagKz from '@/assets/flag-kz';
import Image from 'next/image';

// Buying step 5 from figma
// тут не хватает icon kz для первого импута
// label второго импута  на половину серая (я рот шатал дизайнеру)

const StepFive = () => {
    return (
        <>
            {/* change route!!! IMPORTANT */}
            <Topbar backHref="/bus/directions">Покупка билета</Topbar>
            {/* change route!!! IMPORTANT */}

            <div className="h-full px-5">
                <div className="mt-10 flex flex-col">
                    <p className="text-3xl font-medium text-[#4A4A4A]">
                        Контактные данные
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                        Мы скинем ваш билет на ваш номер телефона, и на
                        электронную почту
                    </p>
                    <div className="my-3 flex flex-col gap-2">
                        <Input
                            label="+7 (___) ___ - __ - __"
                            id="UserPhone"
                            iconLeft={
                                <Image
                                    src={'/assets/main/kz.png'}
                                    width={24}
                                    height={26}
                                    alt="KZ"
                                    quality={100}
                                />
                            }
                        />
                        <Input label="Электронная почта (необязательно)" />
                    </div>
                    <Button variant="secondary">Перейти к оплате</Button>
                </div>
            </div>
        </>
    );
};

export default StepFive;
