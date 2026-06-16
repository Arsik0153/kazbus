'use client';

import Link from 'next/link';

import Plus from '@/assets/admin/Plus';
import AdminStateCard from '@/components/admin/state-card';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { useServerActionQuery } from '@/lib/server-action-hooks';

import Table from './_components/table';
import { getRoutesAction } from './action';

const RoutesPage = () => {
    const { data, isPending, error, refetch } = useServerActionQuery(
        getRoutesAction,
        {
            input: undefined,
            queryKey: ['getRoutes'],
        }
    );

    return (
        <div className="mt-6 flex flex-col">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                    Маршруты
                </h1>
                <Button asChild size="lg" className="px-8 text-base">
                    <Link href="/admin/main/routes/new-route">
                        <Plus color="#fff" width={20} height={20} />
                        Добавить маршрут
                    </Link>
                </Button>
            </div>

            {isPending ? (
                <div className="flex justify-center py-24">
                    <Spinner />
                </div>
            ) : error ? (
                <AdminStateCard
                    title="Не удалось загрузить маршруты"
                    description="Повторите попытку позже или проверьте доступность backend."
                    action={
                        <Button variant="outline" onClick={() => refetch()}>
                            Повторить
                        </Button>
                    }
                />
            ) : data && data.length > 0 ? (
                <Table routes={data} />
            ) : (
                <AdminStateCard
                    title="Маршруты еще не созданы"
                    description="Создайте маршрут, чтобы затем использовать его при запуске рейсов."
                    action={
                        <Button asChild size="lg" className="px-8 text-base">
                            <Link href="/admin/main/routes/new-route">
                                <Plus color="#fff" width={20} height={20} />
                                Добавить маршрут
                            </Link>
                        </Button>
                    }
                />
            )}
        </div>
    );
};

export default RoutesPage;
