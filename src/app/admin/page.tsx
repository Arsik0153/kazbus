import React from 'react';
import Input from '@/components/input';
import Button from '@/components/button';
import Link from 'next/link';
import Image from 'next/image';
// bg-[#E32B2B]
const LoginPage = () => {
    return (
        <div className="flex items-start justify-center h-screen bg-[#E32B2B]">
            <Image
                src={'/Ellipse.svg'}
                width={622}
                height={750}
                className='absolute top-0 left-0'
                alt={''}
            />

            <Image
                src={'/Ellipse.svg'}
                width={622}
                height={750}
                className='absolute top-0 right-0'
                alt={''}
            />
            <div className="flex flex-col items-center mt-12">
                <Image
                    src={'/logo.svg'}
                    width={80}
                    height={80}
                    alt={'Logo'}

                />
                <div className="flex flex-col gap-4 bg-white px-6 pt-11 pb-8 rounded-[20px] shadow-md w-full max-w-[340px]">
                    <h2 className="text-4xl font-bold text-center text-[#E32B2B]">Авторизация таксопарка</h2>
                    <form className='flex flex-col gap-2'>
                        <Input
                            label='Введите ваш логин'
                            id="AdminLogin"
                        />
                        <Input
                            label='Введите ваш пароль'
                            id="AdminPassword"
                        />
                        <Link href="admin/main" className='flex items-center justify-center rounded-[10px] px-2 py-6 text-[18px] font-semibold leading-[19.8px] max-h-[72px] w-full bg-[#E74949] text-white active:bg-[#F45A5A]'>Войти в таксопарк</Link>
                        {/* <Button variant='secondary' >Войти в таксопарк</Button> */}
                    </form>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
