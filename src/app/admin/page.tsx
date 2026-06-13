'use client';
import React from 'react';
import Input from '@/components/input';
import Button from '@/components/button';
import Image from 'next/image';
import ErrorMessage from '@/components/error-message';
import { toast } from 'react-hot-toast';
import { loginAction } from './action';
import { useServerAction } from 'zsa-react';
import { adminLoginSchema } from '@/data/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LoginPage = () => {
    const { execute, isPending } = useServerAction(loginAction, {
        onError: (error) => {
            const message = error?.err?.message || 'Произошла ошибка';
            toast.error(message);
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
            username: data.username,
            password: data.password,
        });
    });

    return (
        <div className="flex min-h-screen items-start justify-center overflow-y-hidden bg-[#E32B2B]">
            <Image
                src={'/Ellipse.svg'}
                width={622}
                height={750}
                className="absolute left-0 top-0"
                alt={''}
            />

            <Image
                src={'/Ellipse.svg'}
                width={622}
                height={750}
                className="absolute right-0 top-0"
                alt={''}
            />
            <div className="mt-12 flex flex-col items-center">
                <Image src={'/logo.svg'} width={80} height={80} alt={'Logo'} />
                <div className="flex w-full max-w-[340px] flex-col gap-4 rounded-[20px] bg-white px-6 pb-8 pt-11 shadow-md">
                    <h2 className="text-center text-4xl font-bold text-[#E32B2B]">
                        Авторизация таксопарка
                    </h2>
                    <form onSubmit={onSubmit} className="flex flex-col gap-2">
                        <Input
                            label="Введите ваш логин"
                            id="username"
                            autoComplete="username"
                            {...register('username')}
                        />
                        <ErrorMessage message={errors.username?.message} />

                        <Input
                            label="Введите ваш пароль"
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            {...register('password')}
                        />
                        <ErrorMessage message={errors.password?.message} />

                        <Button variant="secondary" loading={isPending}>
                            Войти в таксопарк
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
