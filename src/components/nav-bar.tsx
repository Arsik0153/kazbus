import React from 'react';
import Bus from '../../public/assets/bus';
import Building from '../../public/assets/building';
import Coupon from '../../public/assets/coupon';
import User from '../../public/assets/user';

const NavBar = () => {
    return (
        <div className="bg-white w-full rounded-t-[10px]">
            <div className="flex items-center p-5 justify-between w-full">
                <div className='flex items-center flex-col gap-2 '>
                    <Bus color='#D21F1F' />
                    <div className='font-normal text-[12px] leading-[13.2px] text-[#D21F1F]'>
                        Поиск
                    </div>
                </div>
                <div className='flex items-center flex-col gap-2'>
                    <Building color='#D21F1F' />
                    <div className='font-normal text-[12px] leading-[13.2px] text-[#D21F1F]'>
                        Направления
                    </div>
                </div>
                <div className='flex items-center flex-col gap-2'>
                    <Coupon color='#D21F1F' />
                    <div className='font-normal text-[12px] leading-[13.2px] text-[#D21F1F]'>
                        Мои билеты
                    </div>
                </div>
                <div className='flex items-center flex-col gap-2'>
                    <User color='#D21F1F' />
                    <div className='font-normal text-[12px] leading-[13.2px] text-[#D21F1F]'>
                        Профиль
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
