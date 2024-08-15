'use client';
import React, { useState } from 'react'
import Clock from '@/assets/admin/Clock'
import Calendar from '@/assets/admin/Calendar'
import Link from 'next/link';


const Table = () => {
    const [isActive, setIsActive] = useState(false);

    const handleButtonClick = () => {
        setIsActive(!isActive);
        console.log('edit new-driver activated');
    };
    return (
        <table className=" rounded-[20px] bg-white w-full px-5 pb-3 mb-28 items-center justify-center mt-[17px] border-separate border-spacing-y-2">
            <tbody>
                <tr className="w-full py-[6px]">
                    <th className="py-5 w-fit text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        ФИО
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Дата рождения
                    </th>

                    <th >
                    </th>
                </tr>

                <tr className="bg-[#F1F5F9] ">
                    <td className="pl-6 rounded-l-[10px] w-fit max-w-[180px]">
                        <div className="flex flex-row w-fit items-center gap-4">
                            <img src="/assets/user-avatar.jpg" alt="avatar" className=' rounded-full w-[36px] h-[36px]' />
                            <p className="text-base font-semibold text-[#4A4A4A] ">Дауренбек Сакен Толегенулы</p>
                        </div>
                    </td>

                    <td>
                        <div className="flex flex-row gap-2 items-center">
                            <Calendar color='#E74949' width={16} height={16} />
                            <p className="text-base font-semibold text-[#4A4A4A]">12.08.2024</p>
                        </div>
                    </td>
                    <td className=" py-4 pr-6 rounded-r-[10px]">
                        {/* <button className='py-3 ml-auto px-8 flex items-center justify-center rounded-[10px] border bg-[#E74949] text-sm font-semibold text-white' onClick={handleButtonClick}>
                            Редактировать
                        </button> */}
                        <Link href='/admin/main/drivers/new-driver'>
                            <button className='py-3 ml-auto px-8 flex items-center hover:bg-[#F16363] hover:text-white duration-100 justify-center rounded-[10px] border border-[#E74949] text-sm font-semibold text-[#E74949]' onClick={handleButtonClick}>
                                Редактировать
                            </button>
                        </Link>
                    </td>
                </tr>


            </tbody>
        </table>
    )
}

export default Table;