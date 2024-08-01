import React from 'react';
import Menu from '@/components/menu';
import ShieldKeyhole from '../../../../../public/assets/shield-keyhole';
import Topbar from '@/components/topbar';

const AuthorizedProfilePage = () => {
    return (
        <>
            <Topbar>Профиль</Topbar>
            <div className="flex flex-col justify-center bg-[#FFFFFF] px-5 text-[#4A4A4A]">
                <div className="flex flex-grow flex-col items-center">
                    <div className="mt-9">
                        <div className="text-[32px] font-bold leading-[38.4px]">
                            Купертино Стив Джобсович
                        </div>
                        <div className="pt-[10px] text-[16px] font-bold leading-[17.6px] text-[#E74949]">
                            +7 747 787 98 98
                        </div>
                    </div>
                    <div className="mt-[50px] w-full rounded-[10px] bg-[#F9F9F9] px-4 pb-1 pt-6">
                        <div className="pb-[20px] text-[20px] font-bold leading-[22px]">
                            Настройки
                        </div>
                        <div className="flex flex-col">
                            <Menu
                                link="/profile/authorized/personal-data"
                                text="Мои личные данные"
                            />
                            <div className="color-[#E9E9E9] h-1 w-full border-b"></div>
                            <Menu
                                link="/profile/authorized/passenger-data"
                                text="Данные моих пассажиров"
                            />
                            <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                            <Menu
                                link="/profile/authorized/confidentiality"
                                text="Конфиденциальность"
                            />
                            <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                            <Menu link="/profile/authorized/faq" text="FAQ" />
                            <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                            <Menu
                                link="/profile/authorized/"
                                text="Служба поддержки"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-11 pb-[20px]">
                    <div className="flex w-full flex-row items-center justify-center gap-3 rounded-[50px] bg-[#EFEFEF] p-2">
                        <ShieldKeyhole color="#E74949" />
                        <div className="text-[16px] font-semibold leading-[17.6px] text-[#E74949]">
                            Ваши данные под надежной защитой
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthorizedProfilePage;
