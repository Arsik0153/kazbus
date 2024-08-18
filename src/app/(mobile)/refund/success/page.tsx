import React from 'react'
import Topbar from '@/components/topbar';
import Yes from '@/assets/admin/Yes';

const Success = () => {
    return (
        <>
            <Topbar backHref="/main">
                <h1 className="text-[20px] font-medium leading-[46.2px] tracking-[-3%] text-white">
                    Оформить возврат
                </h1>
            </Topbar>
            <div className="flex flex-col px-5 pt-5 mt-24 items-center">
                <div className="w-[72px] h-[72px] rounded-full pl-1 flex bg-[#E32B2B] justify-center items-center">
                    <Yes color='#FFFFFF' width={30} height={25} />
                </div>
                <p className="text-center mt-6 text-[32px] leading-9 font-semibold text-black">Возврат полностью <br /> оформлен</p>
                <p className="text-center mt-3 text-sm font-semibold text-black">Деньги на карту вернутся вам <br /> в течении 3-х дней</p>
                <p className="fixed bottom-32 left-5 right-5 flex items-center px-[22px] py-3  bg-[#EFEFEF] rounded-[50px] text-base font-semibold text-[#E23333] text-center leading-[20px]">
                    Скорость возврата денег вам на карту <br /> зависит от самого банка
                </p>
            </div>
        </>
    )
}

export default Success;