import React from 'react';
import Topbar from '@/components/topbar';
import Yes from '@/assets/admin/Yes';

const Success = () => {
    return (
        <>
            <Topbar backHref="/bus/main">
                <h1 className="text-[20px] font-medium leading-[46.2px] tracking-[-3%] text-white">
                    Оформить возврат
                </h1>
            </Topbar>
            <div className="mt-24 flex flex-col items-center px-5 pt-5">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E32B2B] pl-1">
                    <Yes color="#FFFFFF" width={30} height={25} />
                </div>
                <p className="mt-6 text-center text-[32px] font-semibold leading-9 text-black">
                    Возврат полностью <br /> оформлен
                </p>
                <p className="mt-3 text-center text-sm font-semibold text-black">
                    Деньги на карту вернутся вам <br /> в течении 3-х дней
                </p>
                <p className="fixed bottom-32 left-5 right-5 flex items-center rounded-[50px] bg-[#EFEFEF] px-[22px] py-3 text-center text-base font-semibold leading-[20px] text-[#E23333]">
                    Скорость возврата денег вам на карту <br /> зависит от
                    самого банка
                </p>
            </div>
        </>
    );
};

export default Success;
