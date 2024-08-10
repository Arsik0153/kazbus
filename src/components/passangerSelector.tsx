import React from 'react'
import User from '@/assets/user'

const passangerSelector = () => {
    return (
        <div className='flex flex-col border border-[#D1D1D1] pt-6 pl-4 pr-6 pb-7 rounded-[10px]'>
            <div className="flex flex-row gap-2  items-center mb-1">
                <User />
                <p className="text-xl font-semibold text-[#4A4A4A]">Купертино Стив Джобсович</p>
            </div>
            <p className="text-sm font-medium">Удостоверение личности</p>
            <div className="flex flex-row items-start justify-between mt-[30px]">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold text-[#A0A0A0]">Номер документа или ИИН</p>
                    <p className="text-base font-medium text-[#4A4A4A]">04040595289782932</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold text-[#A0A0A0]">Дата рождения</p>
                    <p className="text-base font-medium text-[#4A4A4A]">12.11.2004</p>
                </div>
            </div>
        </div>
    )
}

export default passangerSelector