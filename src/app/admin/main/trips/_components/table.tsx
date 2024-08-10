import React from 'react'
import Pulse from '@/components/admin/pulse'

const table = () => {
    return (
        <table className="w-full mt-6 border-separate border-spacing-y-2">
            <tbody>
                <tr className="w-full py-[10px]">
                    <th className="py-5 px-6 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Время
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        маршрут
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        проводится
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        Дни
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        остановка
                    </th>
                    <th className="py-5 text-start leading-[22.4px] uppercase items-start font-bold text-[#A0A0A0] text-[16px]">
                        статус
                    </th>
                </tr>

                <tr className="bg-[#F1F5F9] px-6">
                    <td className="px-6 rounded-l-[10px] text-base font-bold text-[#E74949]">
                        12:00
                    </td>
                    <td className="text-base font-bold text-[#E74949]">
                        Алматы/Сайран - Кызылорда/СК
                    </td>
                    <td className="text-base font-medium">
                        до 12.09.2024
                    </td>
                    <td className="text-base font-medium">
                        Пн, Вт, Ср, Чт, Пт, Сб
                    </td>
                    <td className="text-base font-medium">
                        3 остановки
                    </td>
                    <td className="rounded-r-[10px] py-4 flex flex-row items-start gap-2 text-base font-semibold text-[#4A4A4A]">
                        <div className="mt-[6px]"><Pulse color="#21C01E" pulseRadius={5} /></div>
                        Рейс активен, <br /> идут продажи
                    </td>
                </tr>

                <tr className="bg-[#F1F5F9] px-6">
                    <td className="px-6 rounded-l-[10px] text-base font-bold text-[#E74949]">
                        16:00
                    </td>
                    <td className="text-base font-bold text-[#E74949]">
                        Астана - Кокшетау
                    </td>
                    <td className="text-base font-medium">
                        до 12.09.2024
                    </td>
                    <td className="text-base font-medium">
                        Пн, Вт, Ср, Чт, Пт, Сб
                    </td>
                    <td className="text-base font-medium">
                        12 остановки
                    </td>
                    <td className="rounded-r-[10px] py-4 flex flex-row items-start gap-2 text-base font-semibold text-[#4A4A4A]">
                        <div className="mt-[6px]"><Pulse color="#AD1013" pulseRadius={5} /></div>
                        Рейс не в <br /> продаже
                    </td>
                </tr>

                <tr className="bg-[#F1F5F9] px-6">
                    <td className="px-6 rounded-l-[10px] text-base font-bold text-[#E74949]">
                        16:00
                    </td>
                    <td className="text-base font-bold text-[#E74949]">
                        Астана - Шымкент
                    </td>
                    <td className="text-base font-medium">
                        до 12.09.2024
                    </td>
                    <td className="text-base font-medium">
                        Пн, Вт, Ср
                    </td>
                    <td className="text-base font-medium">
                        12 остановки
                    </td>
                    <td className="rounded-r-[10px] py-4 flex flex-row items-start gap-2 text-base font-semibold text-[#4A4A4A]">
                        <div className="mt-[6px]"><Pulse color="#AD1013" pulseRadius={5} /></div>
                        Рейс отменен, <br />
                        с 12.09 по 14.09
                    </td>
                </tr>

                <tr className="bg-[#F1F5F9] px-6">
                    <td className="px-6 rounded-l-[10px] text-base font-bold text-[#E74949]">
                        16:00
                    </td>
                    <td className="text-base font-bold text-[#E74949]">
                        Астана - Караганда
                    </td>
                    <td className="text-base font-medium">
                        до 12.09.2024
                    </td>
                    <td className="text-base font-medium">
                        Чт, Пт, Сб
                    </td>
                    <td className="text-base font-medium">
                        12 остановки
                    </td>
                    <td className="rounded-r-[10px] py-4 flex flex-row items-start gap-2 text-base font-semibold text-[#4A4A4A]">
                        <div className="mt-[6px]"><Pulse color="#AD1013" pulseRadius={5} /></div>
                        Рейс перенесен, <br />
                        с 12:00 на 16:00
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default table