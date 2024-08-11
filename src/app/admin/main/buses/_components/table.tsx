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

                <tr className="bg-[#F1F5F9] ">
                    <td className="pl-6 w-fit max-w-20 rounded-l-[10px]">
                        <p className="text-base font-semibold text-black">Mercedes-Benz Sprinter</p>
                    </td>
                    <td>
                        <p className="text-base font-semibold text-black">M218XZY03</p>

                    </td>
                    <td>
                        <p className="text-base font-semibold text-black">50</p>

                    </td>
                    <td className=" py-4 pr-6 rounded-r-[10px]">
                        {/* <button className='py-3 ml-auto px-8 flex hover:bg-[#F16363] hover:text-white duration-100	 items-center justify-center rounded-[10px] border bg-[#E74949] text-sm font-semibold text-white' onClick={handleButtonClick}>
                            Редактировать
                        </button> */}
                        <button className='py-3 ml-auto px-8 flex  hover:bg-[#F16363] hover:text-white duration-100	 items-center justify-center rounded-[10px] border border-[#E74949] text-sm font-semibold text-[#E74949]' onClick={handleButtonClick}>
                            Редактировать
                        </button>

                    </td>
                </tr>


            </tbody>
        </table>
    )
}

export default Table;