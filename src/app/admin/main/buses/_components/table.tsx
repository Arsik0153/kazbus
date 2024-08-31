'use client';
import React, { useState } from 'react'
import Link from 'next/link';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getBusesAction } from '@/app/admin/main/buses/actions';
import Spinner from '@/components/spinner';

const Table = () => {
    const [isActive, setIsActive] = useState(false);
    const { data, isPending } = useServerActionQuery(getBusesAction, {
        input: undefined,
        queryKey: ['getBuses'],
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
        <table className=" rounded-[20px] bg-white w-full px-5 pb-3 mb-28 items-center justify-center mt-[17px] border-separate border-spacing-y-2">
            <tbody>
                <tr className="w-full py-[6px]">
                    <th className="py-5 w-fit text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Название автобуса
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        гос.  номер
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        кол. Мест
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase flex-end items-start font-bold text-[#A0A0A0] text-[16px]">
                    </th>
                </tr>
                {data?.map((bus) => (

                <tr className="bg-[#F1F5F9]" key={bus.model_stamp}>
                    <td className="pl-6 w-fit max-w-20 rounded-l-[10px]">
                        <p className="text-base font-semibold text-black">{bus.model_stamp}</p>
                    </td>
                    <td>
                        <p className="text-base font-semibold text-black">{bus.state_number}</p>

                    </td>
                    <td>
                        <p className="text-base font-semibold text-black">{bus.count_of_seats}</p>

                    </td>
                    <td className=" py-4 pr-6 rounded-r-[10px]">
                        {/* <button className='py-3 ml-auto px-8 flex hover:bg-[#F16363] hover:text-white duration-100	 items-center justify-center rounded-[10px] border bg-[#E74949] text-sm font-semibold text-white' onClick={handleButtonClick}>
                            Редактировать
                        </button> */}
                        <Link href='/admin/main/buses/new-bus'>
                            <button className='py-3 ml-auto px-8 flex  hover:bg-[#F16363] hover:text-white duration-100 items-center justify-center rounded-[10px] border border-[#E74949] text-sm font-semibold text-[#E74949]' onClick={handleButtonClick}>
                                Редактировать
                            </button>
                        </Link>
                    </td>
                </tr>
                ))}


            </tbody>
        </table>
    )
}

export default Table;