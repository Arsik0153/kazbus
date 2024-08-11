'use client';
import React, { useState } from 'react'
import Arrow from '@/assets/admin/Arrow'
import Clock from '@/assets/admin/Clock'
import Calendar from '@/assets/admin/Calendar'
import Button from '@/components/button'


const Table = () => {
    const [isActive, setIsActive] = useState(false);

    const handleButtonClick = () => {
        setIsActive(!isActive);
    };
    return (
        <table className=" rounded-[20px] bg-white w-full px-5 pb-3 mb-28 items-center justify-center mt-[17px] border-separate border-spacing-y-2">
            <tbody>
                <tr className="w-full py-[6px]">
                    <th className="py-5 px-6 w-fit text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Маршрут
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        остановки
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Дата создания
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase flex-end items-start font-bold text-[#A0A0A0] text-[16px]">
                        gfhjkl;
                    </th>
                </tr>

                <tr className="bg-[#F1F5F9] ">
                    <td className="pl-6 w-fit max-w-20 rounded-l-[10px]">
                        <div className="flex flex-row items-center gap-[18px] w-fit">
                            <div className="w-8 h-8 rounded-full bg-[#E74949] flex items-center justify-center text-white text-lg">
                                A
                            </div>
                            <p className='text-base font-medium text-[#4A4A4A]'>Алматы</p>
                        </div>
                    </td>
                    <td>
                        <div className="flex flex-row gap-2 items-center">
                            <Clock color='#E74949' width={16} height={16} />
                            <p className="text-base font-semibold text-[#E74949]">24 часа 30 минут</p>
                        </div>
                    </td>
                    <td>
                        <div className="flex flex-row gap-2 items-center">
                            <Calendar color='#E74949' width={16} height={16} />
                            <p className="text-base font-semibold text-[#4A4A4A]">12.08.2024</p>
                        </div>
                    </td>
                    <td className=" py-4 pr-6 rounded-r-[10px]">
                        {isActive ? (
                            <button className='py-3 ml-auto px-8 flex items-center justify-center rounded-[10px] border bg-[#E74949] text-sm font-semibold text-white' onClick={handleButtonClick}>
                                Редактировать
                            </button>
                        ) : (
                            <button className='py-3 ml-auto px-8 flex items-center justify-center rounded-[10px] border border-[#E74949] text-sm font-semibold text-[#E74949]' onClick={handleButtonClick}>
                                Редактировать
                            </button>
                        )}
                    </td>
                </tr>


            </tbody>
        </table>
    )
}

export default Table;