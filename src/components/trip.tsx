import React from 'react'
import Bus from '../../public/assets/bus';
import RouteFill from '../../public/assets/route-fill';
import ToiletPaper from '../../public/assets/toilet-paper';
import HotelBed from '../../public/assets/hotel-bed';
import Wifi from '../../public/assets/wifi';

const Trip = () => {
    return (
        <div className='border border-[#D1D1D1] rounded-[10px] w-full bg-[#FFFFFF]'>
            <div className='p-5 flex flex-row items-center justify-between'>
                <div className='flex flex-row gap-2 items-center'>
                    <div>
                        <Bus />
                    </div>
                    <div className='font-normal text-[16px] leading-[17.6px] text-[#4A4A4A]'>
                        Алматы - Кокшетау
                    </div>
                </div>
                <div>
                    <RouteFill />
                </div>
            </div>
            <div className='border-b w-full border-[#D1D1D1]'></div>
            <div className='p-5 flex flex-row justify-between items-center'>
                <div className='flex flex-row gap-5'>
                    <div className='flex flex-col gap-2'>
                        <div className='font-normal text-[14px] leading-[15.4px] text-[#4A4A4A]'>Отправление</div>
                        <div className='font-medium text-[24px] leading-[26.4px] text-[#4A4A4A]'>13:00</div>
                        <div className='font-normal text-[16px] leading-[17.6px] text-[#C8C8C8]'>8 мая</div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='font-normal text-[14px] leading-[15.4px] text-[#4A4A4A]'>Прибытие</div>
                        <div className='font-medium text-[24px] leading-[26.4px] text-[#4A4A4A]'>16:40</div>
                        <div className='font-normal text-[16px] leading-[17.6px] text-[#C8C8C8]'>9 мая</div>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='gap-2 flex flex-row place-content-end'>
                        <ToiletPaper />
                        <HotelBed />
                        <Wifi />
                    </div>
                    <div className='text-right'>
                        <div className='font-normal text-[12px] leading-[13.2px] text-[#A0A0A0]'>1 пассажир</div>
                        <div className='font-medium text-[24px] leading-[26.4px] text-[#4A4A4A]'>12450₸</div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Trip;