import React from 'react'

const phaseA = () => {
    return (
        <>
            {/* А - Алматы старт*/}

            <div className="p-[6px] flex flex-row w-full bg-[#EEF2F6] items-center gap-5 rounded-[5px] mt-11">
                <div className="w-8 h-8 rounded-full bg-[#E74949] flex items-center justify-center text-white text-lg">
                    A
                </div>
                <p className='text-base font-medium text-[#4A4A4A]'>Алматы</p>
            </div>
            <div className="flex flex-col my-[22px] gap-[22px] max-w-72">
                <p className="text-base font-medium text-[#4A4A4A] border border-[#A0A0A0] rounded-[10px] p-3">Каскелен</p>
                <p className="text-base font-medium text-[#4A4A4A] border border-[#A0A0A0] rounded-[10px] p-3">Каскыр</p>
                <p className="text-base font-medium text-[#4A4A4A] border border-[#A0A0A0] rounded-[10px] p-3">Калкаман</p>
                <p className="text-base font-medium text-[#4A4A4A] border border-[#A0A0A0] rounded-[10px] p-3">Сайран</p>
            </div>
        </>
    )
}

export default phaseA