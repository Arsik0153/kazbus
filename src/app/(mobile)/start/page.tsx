import React from 'react';
import Topbar from '@/components/topbar';
import Image from 'next/image';
import Button from '@/components/button';
import ShieldKeyhole from '../../../../public/assets/shield-keyhole';
import Link from 'next/link';


import StartSettings from './_components/startSettings';


const Login = () => {
    return (
        <>
            {/* change route!!! IMPORTANT */}
            <Topbar backHref="/start">Профиль</Topbar>
            {/* change route!!! IMPORTANT */}

            <div className="flex flex-col items-center mt-16 m-auto" >
                <Image
                    src="/assets/userCartochka.png"
                    width={500}
                    height={500}
                    alt="Picture of the author"
                />

            </div>

            <div className="px-5 pb-14 gap-1">
                <p className="text-3xl font-medium text-center mt-9 text-[#4A4A4A]">Хотите хранить свои билеты и данные прямо в прилоежнии?</p>
                <p className="text-base font-medium text-[#4A4A4A] text-center mt-4">Зарегистрируйтесь и покупайте билеты всего за пару кликов</p>
                <Link href="/start/registration" passHref>
                    <Button variant='secondary' className='mt-16 mb-3'>Пройти регистрацию</Button>
                </Link>
                <div className="text-center mt-4">
                    {/* change route!!! IMPORTANT */}
                    <a href="#!" className='text-lg font-normal text-[#4A4A4A] mx-auto underline'>Войти</a>
                    {/* change route!!! IMPORTANT */}
                </div>


                {/* change route!!! IMPORTANT */}
                <StartSettings />
                {/* change route!!! IMPORTANT */}

                <div className="mt-11 pb-[20px]">
                    <div className="flex w-full flex-row items-center justify-center gap-3 rounded-[50px] bg-[#EFEFEF] p-2">
                        <ShieldKeyhole color="#E74949" />
                        <div className="text-[16px] font-semibold leading-[17.6px] text-[#E74949]">
                            Ваши данные под надежной защитой
                        </div>
                    </div>
                </div>
            </div >

        </>

    );
};

export default Login;
