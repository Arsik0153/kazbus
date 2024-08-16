'use client';
import React from 'react'
import Plus from '@/assets/admin/Plus';
import Table from '@/app/admin/main/drivers/_components/table';
import Link from 'next/link';

const Buses = () => {
    return (
        <div className="flex flex-col mt-6">
            <div className="flex flex-row justify-between">
                <p className="text-[42px] font-semibold text-[#4A4A4A]">Водители</p>
                <div className="flex flex-row gap-3">
                    <Link href="/admin/main/drivers/new-driver">
                        <p className="flex py-[14px] px-12 flex-row hover:bg-[#F16363] duration-100 rounded-[10px] gap-[10px] items-center justify-center bg-[#E32B2B] text-base font-semibold text-[#FBFBFB]">
                            <Plus color="#fff" width={20} height={20} />
                            Добавить водителя
                        </p>
                    </Link>

                </div>
            </div>

            <div className="flex flex-col rounded-[20px] bg-white w-full py-[108px] items-center justify-center gap-4 mt-[14px]">
                <p className="text-[36px] font-semibold text-center text-[#4A4A4A]">Водители не <br /> зарегистрированы в системе</p>
                <Link href="/admin/main/drivers/new-driver">
                    <p className="flex py-[14px] px-12 flex-row hover:bg-[#F16363] duration-100 rounded-[10px] gap-[10px] items-center justify-center bg-[#E32B2B] text-base font-semibold text-[#FBFBFB]">
                        <Plus color="#fff" width={20} height={20} />
                        Добавить водителя
                    </p>
                </Link>
            </div>

            <Table />
        </div>
    )
}

export default Buses;