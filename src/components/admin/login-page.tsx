'use client';

import React from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useServerAction } from 'zsa-react';

import Button from '@/components/button';
import ErrorMessage from '@/components/error-message';
import Input from '@/components/input';
import { adminLoginSchema } from '@/data/schemas';

import { loginAction } from '@/app/admin/action';

type AdminLoginPageProps = {
    sessionIssue?: 'expired' | 'forbidden';
};

const AdminLoginPage = ({ sessionIssue }: AdminLoginPageProps) => {
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => setReady(true), []);
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
                src="/Ellipse.svg"
                width={622}
                height={750}
                className="pointer-events-none absolute top-0 left-0"
                alt=""
            />

            <Image
                src="/Ellipse.svg"
                width={622}
                height={750}
                className="pointer-events-none absolute top-0 right-0"
                alt=""
            />
            <div className="relative z-10 mt-12 flex flex-col items-center">
                <Image src="/logo.svg" width={80} height={80} alt="Logo" />
                <div className="flex w-full max-w-[340px] flex-col gap-4 rounded-[20px] bg-white px-6 pt-11 pb-8 shadow-md">
                    <h2 className="text-center text-4xl font-bold text-[#E32B2B]">
                        Авторизация автопарка
                    </h2>
                    {sessionIssue && (
                        <p
                            role="alert"
                            className="rounded-lg bg-[#FEE2E2] px-4 py-3 text-center text-sm font-medium text-[#B42318]"
                        >
                            {sessionIssue === 'expired'
                                ? 'Сессия истекла. Войдите снова.'
                                : 'Доступ администратора отозван. Войдите под другой учётной записью.'}
                        </p>
                    )}
                    <form
                        method="post"
                        onSubmit={onSubmit}
                        className="flex flex-col gap-2"
                    >
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

                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={!ready}
                            loading={isPending}
                        >
                            Войти в кабинет
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
