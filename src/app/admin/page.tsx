'use client';
import React from 'react';
import Input from '@/components/input';
import Button from '@/components/button';
import Link from 'next/link';
import Image from 'next/image';
import ErrorMessage from '@/components/error-message';
// import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { loginAction } from './action';
import { useServerAction } from 'zsa-react';

import InputPhone from '@/components/inputPhone';
import Topbar from '@/components/topbar';
import { adminLoginSchema } from '@/data/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { sanitizePhone } from '@/utils/helper.';



// bg-[#E32B2B]
const LoginPage = () => {
    const { execute, isPending } = useServerAction(loginAction, {
        onSuccess: () => {
            console.log('success');
        },
        onError: (error) => {
            toast.error(error.err.message);
        },
    });
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<z.output<typeof adminLoginSchema>>({
        resolver: zodResolver(adminLoginSchema),
    });

    const onSubmit = handleSubmit((data) => {
        execute({
            username: sanitizePhone(data.username),
            password: data.password,
        });
    });
    return (
        <form onSubmit={onSubmit} className="flex items-start justify-center min-h-screen overflow-y-hidden bg-[#E32B2B]">
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
                            {...register('username')}

                        />
                        <ErrorMessage message={errors.username?.message} />

                        <Input
                            label='Введите ваш пароль'
                            id="AdminPassword"
                            type="password"

                            {...register('password')}

                        />
                        <ErrorMessage message={errors.password?.message} />

                        <Button
                            // onClick={handleSearchClick} 
                            variant='secondary'
                            loading={isPending}
                        >
                            Войти в таксопарк
                        </Button>
                    </form>
                </div>
            </div>

        </form>
    );
};

export default LoginPage;
