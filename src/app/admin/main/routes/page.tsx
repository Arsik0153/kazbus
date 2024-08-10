import React from 'react'
import Plus from '@/assets/admin/Plus';
import Table from './_components/table';
import Link from 'next/link';

const Routes = () => {
    return (
        <div className="flex flex-col mt-6">
            <div className="flex flex-row justify-between">
                <p className="text-[42px] font-semibold text-[#4A4A4A]">Маршруты</p>
                <div className="flex flex-row gap-3">
                    {/* TODO: HREF here */}
                    <a href="/admin/main/routes/new-route" className="flex py-[14px] px-12 flex-row rounded-[10px] gap-[10px] items-center justify-center bg-[#E32B2B] text-base font-semibold text-[#FBFBFB]">
                        <Plus color="#fff" width={20} height={20} />
                        Добавить маршрут
                    </a>

                </div>
            </div>

            <div className="flex flex-col rounded-[20px] bg-white w-full py-[108px] items-center justify-center gap-4 mt-[14px]">
                <p className="text-[36px] font-semibold text-[#4A4A4A]">Давайте добавим <br /> первый маршрут</p>
                <a href="/admin/main/routes/new-route" className="flex py-[14px] px-12 flex-row rounded-[10px] gap-[10px] items-center justify-center bg-[#E32B2B] text-base font-semibold text-[#FBFBFB]">
                    <Plus color="#fff" width={20} height={20} />
                    Добавить маршрут
                </a>
            </div>
            <Table />
        </div>
    )
}

export default Routes;