'use client';
import React from 'react';
import Input from '@/components/input';
import Button from '@/components/button';
import Link from 'next/link';
import Image from 'next/image';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { toast } from 'react-hot-toast';

// bg-[#E32B2B]
const LoginPage = () => {
    // const router = useRouter();
    // const searchParams = useSearchParams();

    // const userName = searchParams.get('name');
    // const userPassword = searchParams.get('password');

    // const handleSearchClick = () => {
    //     if (!userName || !userPassword) {
    //         // toast.error('Заполните все поля');
    //         return;
    //     }

    //     const updatedSearchParams = new URLSearchParams(searchParams);
    //     router.push('/admin/main?' + updatedSearchParams.toString());
    // };

    return (
        <div className="flex items-start justify-center min-h-screen overflow-y-hidden bg-[#E32B2B]">
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
                        <Button
                            // onClick={handleSearchClick} 
                            variant='secondary' >
                            Войти в таксопарк
                        </Button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
