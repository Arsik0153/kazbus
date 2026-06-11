'use client';

import Button from '@/components/button';
import Topbar from '@/components/topbar';
import Link from 'next/link';
import React from 'react';
import { useServerAction } from 'zsa-react';
import { logoutAction } from './actions';
import { useQueryClient } from '@tanstack/react-query';

const LogoutPage = () => {
    const queryClient = useQueryClient();

    const { execute, isPending } = useServerAction(logoutAction, {
        onError: () => {
            console.log('error');
        },
    });

    const handleLogoutClick = () => {
        queryClient.clear();
        queryClient.removeQueries();
        execute();
    };

    return (
        <>
            <Topbar backHref="/bus/profile">Выйти</Topbar>
            <div className="flex h-[calc(100%-200px)] flex-col justify-between px-5">
                <h1 className="mb-4 mt-16 text-balance text-center text-[32px] font-semibold leading-tight text-[#4A4A4A]">
                    Вы уверены, что хотите удалить ваш аккаунт?
                </h1>
                <div className="flex flex-col gap-3">
                    <Link href="/bus/profile">
                        <Button variant="secondary">Вернуться назад</Button>
                    </Link>
                    <Button loading={isPending} onClick={handleLogoutClick}>
                        Да, удалить аккаунт
                    </Button>
                </div>
            </div>
        </>
    );
};

export default LogoutPage;
