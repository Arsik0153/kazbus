import React from 'react'
import Image from 'next/image';
import Menu from '@/components/menu';

const FAQPage = () => {
    return (
        <div className='p-5'>
            <div className='flex items-center justify-center flex-col rounded-[10px] bg-[#F2F2F2]'>
                <div className='font-semibold tracking-[-3%] text-center leading-[24px] text-[20px] text-[#E74949] pt-5 px-5'>
                    Мануал по использованию приложения и решения проблем
                </div>
                    <Image
                        src={'/assets/faq/book.png'}
                        width={352}
                        height={154} alt={''}
                        className='pt-5' />
            </div>
            <div className='flex flex-col gap-3 pt-[20px]'>
                <Menu text='Условия возврата средств' />
                <div className='border-b h-1 color-[#E9E9E9] w-full'></div>
                <Menu text='Как приобрести билет?' />
                <div className='border-t h-1 color-[#E9E9E9] w-full'></div>
                <Menu text='Как изменить данные пассажира?' />
                <div className='border-t h-1 color-[#E9E9E9] w-full'></div>
                <Menu text='Проблема с оплатой' />
                <div className='border-t h-1 color-[#E9E9E9] w-full'></div>
                <Menu text='Правила поведения в автобусе' />
            </div>
        </div>
    )
}

export default FAQPage;