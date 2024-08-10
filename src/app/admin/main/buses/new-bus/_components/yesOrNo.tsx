import React from 'react'
import Yes from '@/assets/admin/Yes'
import No from '@/assets/admin/No'

const yesOrNo = () => {
    return (
        <div className="flex flex-row gap-2">
            <button type='button' className='px-[26px] flex flex-row text-base font-medium text-[#4A4A4A] gap-[10px] items-center hover:bg-[#F16363] bg-[#ffffff] py-4 border border-[#A0A0A0] rounded-[10px]'><Yes color='#4A4A4A'/> Да</button>
            <button type='button' className='px-[26px] flex flex-row text-base font-medium text-[#FFFFFF] gap-[10px] items-center bg-[#E74949] py-4 border border-none rounded-[10px]'><No color='#FFFFFF'/> Нет</button>

        </div>
    )
}

export default yesOrNo