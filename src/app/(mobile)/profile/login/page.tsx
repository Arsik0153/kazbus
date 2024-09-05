'use client';
import Button from '@/components/button';
import ErrorMessage from '@/components/error-message';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
import Topbar from '@/components/topbar';
import { loginSchema } from '@/data/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';
import { loginAction } from './actions';
import toast from 'react-hot-toast';
import { sanitizePhone } from '@/utils/helper.';

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
    } = useForm<z.output<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = handleSubmit((data) => {
        execute({
            phone_number: sanitizePhone(data.phone_number),
            password: data.password,
        });
    });
    return (
        <>
            <Topbar backHref="/profile">Войти</Topbar>
            <form className="px-5" onSubmit={onSubmit}>
                <h1 className="mb-4 mt-16 text-balance text-center text-[42px] font-semibold leading-tight text-[#4A4A4A]">
                    Давайте войдем на ваш аккаунт
                </h1>
                <InputPhone
                    label="Телефон"
                    id="phone_number"
                    placeholder="+7 (___) ___ - __ - __"
                    mask="+7 (___) ___-__-__"
                    type="tel"
                    iconLeft={
                        <Image
                            src={'/assets/main/kz.png'}
                            width={24}
                            height={26}
                            alt="KZ"
                            quality={100}
                        />
                    }
                    {...register('phone_number')}
                />
                <ErrorMessage message={errors.phone_number?.message} />
                <Input
                    label="Введите пароль"
                    id="password"
                    type="password"
                    placeholder="Введите пароль"
                    containerClassName="mt-2"
                    {...register('password')}
                />
                <ErrorMessage message={errors.password?.message} />
                <Button
                    variant="secondary"
                    className="mt-4"
                    loading={isPending}
                >
                    Войти
                </Button>
            </form>
        </>
    );
};

export default LoginPage;
