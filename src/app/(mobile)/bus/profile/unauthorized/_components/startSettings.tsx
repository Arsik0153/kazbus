import React from 'react';
import Menu from '@/components/menu';

const StartSettings = () => {
    return (
        <>
            <div className="mt-[50px] w-full rounded-[10px] bg-[#F9F9F9] px-4 pb-1 pt-6">
                <div className="pb-[20px] text-[20px] font-bold leading-[22px]">
                    Настройки
                </div>
                <div className="flex flex-col">
                    <Menu
                        link="/bus/profile/authorized/confidentiality"
                        text="Конфиденциальность"
                    />
                    <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                    <Menu link="/bus/profile/authorized/faq" text="FAQ" />
                    <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                    <Menu link="#" text="Служба поддержки" />
                </div>
            </div>
        </>
    );
};

export default StartSettings;
