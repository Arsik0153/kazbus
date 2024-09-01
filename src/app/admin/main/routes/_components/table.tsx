'use client';
import React, { useState } from 'react'
import Clock from '@/assets/admin/Clock'
import Calendar from '@/assets/admin/Calendar'
import Link from 'next/link';
import Arrow from '@/assets/admin/Arrow';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getCitiesAction } from '@/app/(mobile)/main/actions';
import { getRoutesAction } from '@/app/admin/main/routes/action';
import Spinner from '@/components/spinner';
import { dateTimeToReadable } from '@/utils/helper.';


const Table = () => {
    const [isActive, setIsActive] = useState(false);
    const { data, isPending } = useServerActionQuery(getRoutesAction, {
        input: undefined,
        queryKey: ['getRoutes'],
    });

    const { data: cities } = useServerActionQuery(getCitiesAction, {
        input: undefined,
        queryKey: ['cities'],
    });
    const handleButtonClick = () => {
        setIsActive(!isActive);
        console.log('edit routes activated'); 
    };
    if (isPending) {
        return (
            <div className="flex justify-center py-11">
                <Spinner />
            </div>
        );
    }
    console.log(data);
    return (
        <table className=" rounded-[20px] bg-white w-full px-5 pb-3 mb-28 items-center justify-center mt-[17px] border-separate border-spacing-y-2">
            <tbody>
                <tr className="w-full py-[6px]">
                    <th className="py-5 px-6 w-fit text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Маршрут
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">

                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">

                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        остановки
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Время пути
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Дата создания
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                
                    </th>
                </tr>
                {data?.map((routes) => (

                    <tr className="bg-[#F1F5F9]" key={routes.id}>
                        <td className="pl-6 w-fit max-w-20 rounded-l-[10px]">
                            <div className="flex flex-row items-center gap-[18px] w-fit">
                                <div className="w-8 h-8 rounded-full bg-[#E74949] flex items-center justify-center text-white text-lg">
                                    A
                                </div>
                                <p className='text-base font-medium text-[#4A4A4A]'>{routes.start_city.name}</p>
                            </div>
                        </td>
                        <td className="text-base font-bold text-[#E74949] pr-5">
                            <Arrow color='#4A4A4A' width={26} height={0} />
                        </td>
                        <td className="text-base font-medium">
                            <div className="flex flex-row items-center gap-[18px]">
                                <div className="w-8 h-8 rounded-full bg-[#E74949] flex items-center justify-center text-white text-lg">
                                    В
                                </div>
                                <p className='text-base font-medium text-[#4A4A4A]'>{routes.end_city.name}</p>
                            </div>

                        </td>
                        <td className="text-base font-semibold text-[#4A4A4A]">
                            {routes.stops.length}
                        </td>
                        <td>
                            <div className="flex flex-row gap-2 items-center">
                                <Clock color='#E74949' width={16} height={16} />
                                <p className="text-base font-semibold text-[#E74949]">{routes.total_travel_time}</p>
                            </div>
                        </td>
                        <td>
                            <div className="flex flex-row gap-2 items-center">
                                <Calendar color='#E74949' width={16} height={16} />
                                <p className="text-base font-semibold text-[#4A4A4A]">
                                    {dateTimeToReadable(routes.created_at)}
                                    </p>
                            </div>
                        </td>
                        <td className=" py-4 pr-6 rounded-r-[10px]">

                            <Link href='/admin/main/routes/new-route'>
                                <button className='py-3 ml-auto px-8 flex items-center justify-center rounded-[10px] border border-[#E74949] text-sm font-semibold text-[#E74949] hover:bg-[#F16363] hover:text-white duration-150' onClick={handleButtonClick}>
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