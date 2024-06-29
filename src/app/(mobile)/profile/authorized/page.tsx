import React from 'react'
import Menu from '@/components/menu';
import ShieldKeyhole from '../../../../../public/assets/shield-keyhole';

const ProfilePage = () => {
    return (
        <div className='bg-[#FFFFFF] p-5 flex-col text-[#4A4A4A] h-screen flex justify-center items-center'>
                <div className='flex-grow flex items-center flex-col'>
                    <div className=''>
                        <div className='font-bold text-[32px] leading-[38.4px]'>Купертино Стив Джобсович</div>
                        <div className='font-bold text-[16px] leading-[17.6px] text-[#E74949] pt-[10px]'>+7 747 787 98 98</div>
                    </div>
                    <div className='w-full pt-[50px]'>
                        <div className='font-bold text-[20px] leading-[22px] pb-[20px]'>
                            Настройки
                        </div>
                        <div className='flex flex-col gap-3'>
                            <Menu text='Мои личные данные' />
                            <div className='border-b h-1 color-[#E9E9E9] w-full'></div>
                            <Menu text='Данные моих пассажиров' />
                            <div className='border-t h-1 color-[#E9E9E9] w-full'></div>
                            <Menu text='Конфиденциальность' />
                            <div className='border-t h-1 color-[#E9E9E9] w-full'></div>
                            <Menu text='FAQ' />
                            <div className='border-t h-1 color-[#E9E9E9] w-full'></div>
                            <Menu text='Служба поддержки' />
                        </div>
                    </div>
                </div>
                <div className='pb-[20px]'>
                    <div className='bg-[#EFEFEF] rounded-[50px] p-2 flex flex-row justify-center items-center w-full gap-3'>
                        <ShieldKeyhole color='#E74949' />
                        <div className='font-semibold text-[#E74949] text-[16px] leading-[17.6px]'>
                            Ваши данные под надежной защитой
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default ProfilePage;