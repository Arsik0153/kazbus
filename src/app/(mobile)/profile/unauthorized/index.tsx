import React from 'react';
import Topbar from '@/components/topbar';
import Image from 'next/image';
import Button from '@/components/button';
import ShieldKeyhole from '../../../../assets/shield-keyhole';
import Link from 'next/link';
import StartSettings from './_components/startSettings';

const UnauthorizedProfilePage = () => {
    return (
        <>
            <Topbar>Профиль</Topbar>

            <div className="m-auto mt-16 flex flex-col items-center">
                <Image
                    src="/assets/userCartochka.png"
                    width={590}
                    height={297}
                    alt="Picture of the author"
                />
            </div>

            <div className="gap-1 px-5 pb-14">
                <p className="mt-9 text-center text-3xl font-medium text-[#4A4A4A]">
                    Хотите хранить свои билеты и данные прямо в приложении?
                </p>
                <p className="mt-4 text-center text-base font-medium text-[#4A4A4A]">
                    Зарегистрируйтесь и покупайте билеты всего за пару кликов
                </p>
                <Link href="/profile/registration" passHref>
                    <Button variant="secondary" className="mb-3 mt-16">
                        Пройти регистрацию
                    </Button>
                </Link>
                <div className="mt-4 text-center">
                    <Link
                        href="/profile/login"
                        className="mx-auto text-lg font-normal text-[#4A4A4A] underline"
                    >
                        Войти
                    </Link>
                </div>
                <StartSettings />
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

export default UnauthorizedProfilePage;
