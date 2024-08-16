import React from 'react';
import Image from 'next/image';
import Menu from '@/components/menu';
import Topbar from '@/components/topbar';

const FAQPage = () => {
    return (
        <>
            <Topbar backHref="/profile">FAQ</Topbar>
            <div className="mb-4 mt-8 px-5">
                <div className="flex flex-col items-center justify-center rounded-[10px] bg-[#F2F2F2]">
                    <div className="px-5 pt-5 text-center text-[20px] font-semibold leading-[24px] tracking-[-3%] text-[#E74949]">
                        Мануал по использованию приложения и решения проблем
                    </div>
                    <Image
                        src={'/assets/faq/book.png'}
                        width={352}
                        height={159}
                        alt={''}
                        className="pt-5"
                    />
                </div>
                <div className="mt-[20px] flex flex-col">
                    <Menu
                        link="/profile/authorized/faq/return-policy"
                        text="Условия возврата средств"
                    />
                    <div className="color-[#E9E9E9] h-1 w-full border-b"></div>
                    <Menu text="Как приобрести билет?" link="#" />
                    <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                    <Menu text="Как изменить данные пассажира?" link="#" />
                    <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                    <Menu text="Проблема с оплатой" link="#" />
                    <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                    <Menu text="Правила поведения в автобусе" link="#" />
                </div>
            </div>
        </>
    );
};

export default FAQPage;
