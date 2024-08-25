import React from 'react'
import Mail from '@/assets/mail';
import Button from '@/components/button';
import Link from 'next/link';
import InputPhone from '@/components/inputPhone';

// LOGIN
const otp = () => {
  return (
    <div className="flex flex-col items-center">
                <Mail color='white' />
                <p className="mt-5 mb-4 text-[32px] text-center leading-9 font-bold text-white">На ваш телефон пришел СМС-код</p>
                <p className=" text-sm font-medium text-white">Введите 4-х значный код</p>
                <div className="flex flex-col w-full items-center gap-2 mt-8">
                    <InputPhone
                        id="newUserPhone"
                        label="None label here"
                        variant='ghostOTP'
                        placeholder="0000"
                        mask="____"
                        type="tel"
                    />
                    <Link href='/main' className="w-full mt-2">
                        
                        <Button>Начать поиск билетов</Button>
                    </Link>
                </div>
            </div>
  )
}

export default otp