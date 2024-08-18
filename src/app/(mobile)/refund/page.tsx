import React from 'react'
import Topbar from '@/components/topbar';
import RadioInput from '@/components/radio-input';
import Button from '@/components/button';
import Link from 'next/link';
import Clock from '@/assets/red-clock';

const page = () => {
    return (
        <>
            <Topbar backHref="/main">
                <h1 className="text-[20px] font-medium leading-[46.2px] tracking-[-3%] text-white">
                    Оформить возврат
                </h1>
            </Topbar>
            <div className="flex flex-col px-5 pt-5">
                <div className='flex flex-col pt-5 px-5 pb-7 gap-3 border border-[#D1D1D1] rounded-[10px] w-full' >
                    <Clock color='#E23333' />
                    <div className="flex flex-col gap-[6px]">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Возврат оформлен</p>
                        <p className="text-sm font-normal text-[#4A4A4A]">Подтвердите возврат в течении 30 минут</p>
                    </div>
                    <p className="text-4xl font-semibold text-[#E23333]">29:43</p>
                </div>
                <div className='flex flex-col pt-5 px-5 pb-7 gap-5 mt-2 bg-[#F9F9F9] rounded-[10px] w-full' >
                    <div className="flex flex-row justify-between">
                        <p className="text-xl font-semibold text-[#4A4A4A]">Сумма возврата</p>
                        <p className="text-xl font-semibold text-[#4A4A4A]">12 050 ₸ </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between">
                            <p className="text-sm font-medium text-[#4A4A4A]">Цена билета</p>
                            <p className="text-sm font-medium text-[#4A4A4A]">12 050 ₸</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-sm font-medium text-[#4A4A4A]">Сервисный сбор</p>
                            <p className="text-sm font-medium text-[#4A4A4A]">-300 ₸</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-sm font-medium text-[#4A4A4A]">Комиссия за возврат</p>
                            <p className="text-sm font-medium text-[#4A4A4A]">-100 ₸</p>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col pt-5 px-5 pb-6 mt-2 border border-[#D1D1D1] rounded-[10px] w-full">
                    <p className="text-xs font-bold text-[#A0A0A0]">Пассажир</p>
                    <p className="text-base font-medium text-[#4A4A4A] mt-2">Купертино Стив Джобсович</p>
                    <p className="text-base font-medium text-[#4A4A4A] mt-1">04040595289782932</p>
                </div>
                <div className="flex flex-row px-5 py-[18px] mb-32 mt-2 justify-between  border border-[#D1D1D1] rounded-[10px] w-full">
                    <p className="text-base font-normal text-[#4A4A4A]">Место</p>
                    <p className="text-base font-bold text-[#E23333]">06</p>
                </div>
                <Link href='/refund/success' className='fixed bottom-28 left-5 right-5'>
                    <Button variant='secondary'>Подтвердить возврат</Button>
                </Link>
            </div>


        </>
    )
}

export default page