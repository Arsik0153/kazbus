import React from 'react';
import Topbar from '@/components/topbar';
import RadioInput from '@/components/radio-input';
import Button from '@/components/button';
import Link from 'next/link';
import Clock from '@/assets/red-clock';

const page = () => {
    return (
        <>
            <Topbar backHref="/bus/main">
                <h1 className="text-[20px] font-medium leading-[46.2px] tracking-[-3%] text-white">
                    Оформить возврат
                </h1>
            </Topbar>
            <div className="flex flex-col px-5 pt-5">
                <div className="flex w-full flex-col gap-3 rounded-[10px] border border-[#D1D1D1] px-5 pb-7 pt-5">
                    <Clock color="#E23333" />
                    <div className="flex flex-col gap-[6px]">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">
                            Возврат оформлен
                        </p>
                        <p className="text-sm font-normal text-[#4A4A4A]">
                            Подтвердите возврат в течении 30 минут
                        </p>
                    </div>
                    <p className="text-4xl font-semibold text-[#E23333]">
                        29:43
                    </p>
                </div>
                <div className="mt-2 flex w-full flex-col gap-5 rounded-[10px] bg-[#F9F9F9] px-5 pb-7 pt-5">
                    <div className="flex flex-row justify-between">
                        <p className="text-xl font-semibold text-[#4A4A4A]">
                            Сумма возврата
                        </p>
                        <p className="text-xl font-semibold text-[#4A4A4A]">
                            12 050 ₸{' '}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between">
                            <p className="text-sm font-medium text-[#4A4A4A]">
                                Цена билета
                            </p>
                            <p className="text-sm font-medium text-[#4A4A4A]">
                                12 050 ₸
                            </p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-sm font-medium text-[#4A4A4A]">
                                Сервисный сбор
                            </p>
                            <p className="text-sm font-medium text-[#4A4A4A]">
                                -300 ₸
                            </p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-sm font-medium text-[#4A4A4A]">
                                Комиссия за возврат
                            </p>
                            <p className="text-sm font-medium text-[#4A4A4A]">
                                -100 ₸
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex w-full flex-col rounded-[10px] border border-[#D1D1D1] px-5 pb-6 pt-5">
                    <p className="text-xs font-bold text-[#A0A0A0]">Пассажир</p>
                    <p className="mt-2 text-base font-medium text-[#4A4A4A]">
                        Купертино Стив Джобсович
                    </p>
                    <p className="mt-1 text-base font-medium text-[#4A4A4A]">
                        04040595289782932
                    </p>
                </div>
                <div className="mb-32 mt-2 flex w-full flex-row justify-between rounded-[10px] border border-[#D1D1D1] px-5 py-[18px]">
                    <p className="text-base font-normal text-[#4A4A4A]">
                        Место
                    </p>
                    <p className="text-base font-bold text-[#E23333]">06</p>
                </div>
                <Link
                    href="/bus/refund/success"
                    className="fixed bottom-28 left-5 right-5"
                >
                    <Button variant="secondary">Подтвердить возврат</Button>
                </Link>
            </div>
        </>
    );
};

export default page;
