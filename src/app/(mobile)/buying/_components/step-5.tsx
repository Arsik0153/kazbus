import React from 'react';
import Input from '@/components/input';
import kzFlagUrl from '@/assets/shared/🇰🇿.svg'
import Button from '@/components/button';
import Topbar from '@/components/topbar';
import FlagKz from '../../../../../public/assets/flag-kz';
import Image from 'next/image';

// Buying step 5 from figma 
// тут не хватает icon kz для первого импута 
// label второго импута  на половину серая (я рот шатал дизайнеру)

const StepFive = () => {
    return (
        <>

            {/* change route!!! IMPORTANT */}
            <Topbar backHref="/directions">Покупка билета</Topbar>
            {/* change route!!! IMPORTANT */}


            <div className="h-full bg-[var(--gray)] px-5">
                <div className="mt-10 flex flex-col">
                    <p className="text-3xl font-medium text-[#4A4A4A]">Контактные данные</p>
                    <p className="text-sm font-medium text-[#A0A0A0] mt-2">Мы скинем ваш билет на ваш номер телефона, и на электронную почту</p>
                    <div className="flex flex-col gap-2 my-3">
                        <Input
                            label='+7 (___) ___ - __ - __'
                            id="UserPhone"
                            iconLeft={<Image
                                src='/kz.png'
                                width={24}
                                height={26}
                                alt="KZ"
                              />}
                        />
                        <Input
                            label='Электронная почта (необязательно)'
                        />
                    </div>
                    <Button variant='secondary'>
                        Перейти к оплате
                    </Button>
                </div>
            </div>

        </>

    );
};

export default StepFive;
