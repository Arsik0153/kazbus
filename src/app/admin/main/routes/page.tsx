'use client';
import React, { useState, useEffect } from 'react';
import Plus from '@/assets/admin/Plus';
import Table from './_components/table';
import Link from 'next/link';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getRoutesAction } from './action'; // Предполагается, что этот файл существует
import Spinner from '@/components/spinner';

const Routes = () => {
    const { data, isPending } = useServerActionQuery(getRoutesAction, {
        input: undefined,
        queryKey: ['getRoutes'],
    });
    const [routes, setRoutes] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setRoutes(data);
        }
    }, [data]);

    if (isPending) {
        return (
            <div className="flex justify-center py-11">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col mt-6">
            <div className="flex flex-row justify-between">
                <p className="text-[42px] font-semibold text-[#4A4A4A]">Маршруты</p>
                <div className="flex flex-row gap-3">
                    <Link href="/admin/main/routes/new-route" className="hover:bg-[#F16363] hover:text-white duration-150 flex py-[14px] px-12 flex-row rounded-[10px] gap-[10px] items-center justify-center bg-[#E32B2B] text-base font-semibold text-[#FBFBFB]">
                        <Plus color="#fff" width={20} height={20} />
                        Добавить маршрут
                    </Link>
                </div>
            </div>

            {routes.length > 0 ? (
                <Table />
            ) : (
                <div className="flex flex-col rounded-[20px] bg-white w-full py-[108px] items-center justify-center gap-4 mt-[14px]">
                    <p className="text-[36px] font-semibold text-center text-[#4A4A4A]">Давайте добавим <br /> первый маршрут</p>
                    <Link href="/admin/main/routes/new-route" className="hover:bg-[#F16363] hover:text-white duration-150 flex py-[14px] px-12 flex-row rounded-[10px] gap-[10px] items-center justify-center bg-[#E32B2B] text-base font-semibold text-[#FBFBFB]">
                        <Plus color="#fff" width={20} height={20} />
                        Добавить маршрут
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Routes;
