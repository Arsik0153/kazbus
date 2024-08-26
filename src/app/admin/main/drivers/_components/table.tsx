'use client';
import React, { useState } from 'react';
import Clock from '@/assets/admin/Clock';
import Calendar from '@/assets/admin/Calendar';
import Link from 'next/link';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getDriversAction } from '../actions';
import Spinner from '@/components/spinner';
import { dateToReadable } from '@/utils/helper.';

const Table = () => {
    const [isActive, setIsActive] = useState(false);
    const { data, isPending } = useServerActionQuery(getDriversAction, {
        input: undefined,
        queryKey: ['getDrivers'],
    });

    const handleButtonClick = () => {
        setIsActive(!isActive);
        console.log('edit new-driver activated');
    };
    if (isPending) {
        return (
            <div className="flex justify-center py-11">
                <Spinner />
            </div>
        );
    }

    return (
        <table className="mb-28 mt-[17px] w-full border-separate border-spacing-y-2 items-center justify-center rounded-[20px] bg-white px-5 pb-3">
            <tbody>
                <tr className="w-full py-[6px]">
                    <th className="w-fit items-start py-5 text-start text-[16px] font-bold uppercase leading-[22.4px] text-[#A0A0A0]">
                        ФИО
                    </th>
                    <th className="items-start py-5 text-start text-[16px] font-bold uppercase leading-[22.4px] text-[#A0A0A0]">
                        Дата рождения
                    </th>

                    <th></th>
                </tr>

                {data?.map((driver) => (
                    <tr className="bg-[#F1F5F9]" key={driver.full_name}>
                        <td className="w-fit max-w-[180px] rounded-l-[10px] pl-6">
                            <div className="flex w-fit flex-row items-center gap-4">
                                <img
                                    src="/assets/user-avatar.jpg"
                                    alt="avatar"
                                    className="h-[36px] w-[36px] rounded-full"
                                />
                                <p className="text-base font-semibold text-[#4A4A4A]">
                                    {driver.full_name}
                                </p>
                            </div>
                        </td>

                        <td>
                            <div className="flex flex-row items-center gap-2">
                                <Calendar
                                    color="#E74949"
                                    width={16}
                                    height={16}
                                />
                                <p className="text-base font-semibold text-[#4A4A4A]">
                                    {dateToReadable(driver.date_of_birth)}
                                </p>
                            </div>
                        </td>
                        <td className="rounded-r-[10px] py-4 pr-6">
                            {/* <button className='py-3 ml-auto px-8 flex items-center justify-center rounded-[10px] border bg-[#E74949] text-sm font-semibold text-white' onClick={handleButtonClick}>
                            Редактировать
                        </button> */}
                            <Link href="/admin/main/drivers/new-driver">
                                <button
                                    className="ml-auto flex items-center justify-center rounded-[10px] border border-[#E74949] px-8 py-3 text-sm font-semibold text-[#E74949] duration-100 hover:bg-[#F16363] hover:text-white"
                                    onClick={handleButtonClick}
                                >
                                    Редактировать
                                </button>
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
