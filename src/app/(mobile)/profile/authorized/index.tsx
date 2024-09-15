import React from 'react';
import Menu from '@/components/menu';
import ShieldKeyhole from '../../../../assets/shield-keyhole';
import Topbar from '@/components/topbar';
import { getSession } from '@/lib/auth';
import { readablePhone } from '@/utils/helper.';
import Link from 'next/link';
import TrashCan from '@/assets/trash-can';
import Door from '@/assets/door';

const AuthorizedProfilePage = async () => {
    const session = await getSession();
    if (!session) {
        return null;
    }
    return (
        <>
            <Topbar>Профиль</Topbar>
            <div className="flex flex-col justify-center bg-[#FFFFFF] px-5 text-[#4A4A4A]">
                <div className="flex flex-grow flex-col items-center">
                    <div className="mt-9 self-start">
                        <div className="text-[32px] font-bold leading-[38.4px]">
                            {session.user.full_name}
                        </div>
                        <div className="pt-[10px] text-[16px] font-bold leading-[17.6px] text-[#E74949]">
                            {readablePhone(session.user.phone_number)}
                        </div>
                    </div>
                    <div className="mt-8 w-full rounded-[10px] bg-[#F9F9F9] px-4 pb-1 pt-6">
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
                            <Menu link="#" text="Служба поддержки" />
                            {/* <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                            <Menu
                                link="/profile/authorized/logout/"
                                text="Выйти из аккаунта"
                            />
                            <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                            <Menu
                                link="/profile/authorized/delete-account/"
                                text="Удалить аккаунт"
                            /> */}
                        </div>
                    </div>
                </div>
                <div className="mb-10 mt-8 pb-[20px]">
                    <div className="flex w-full flex-row items-center justify-center gap-3 rounded-[50px] bg-[#EFEFEF] p-2">
                        <ShieldKeyhole color="#E74949" />
                        <div className="text-[16px] font-semibold leading-[17.6px] text-[#E74949]">
                            Ваши данные под надежной защитой
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mb-24">
                    <Link href='/profile/authorized/logout/' className="flex flex-row items-center justify-center gap-2 p-4 border border-[#E23333] rounded-[10px] ">
                        <Door width="20" height="20" color='#D21F1F' />
                        <p className="text-base font-semibold text-[#E23333]">Выйти из аккаунта</p>
                    </Link>
                    <Link href='/profile/authorized/delete-account/' className="flex flex-row items-center justify-center gap-2 p-4 border border-[#E23333] rounded-[10px] ">
                        <TrashCan width="20" height="20" color='#D21F1F' />
                        <p className="text-base font-semibold text-[#E23333]">Удалить аккаунт</p>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default AuthorizedProfilePage;
