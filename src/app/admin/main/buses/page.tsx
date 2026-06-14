'use client';

import Link from 'next/link';

import Plus from '@/assets/admin/Plus';
import AdminStateCard from '@/components/admin/state-card';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { useServerActionQuery } from '@/lib/server-action-hooks';

import Table from './_components/table';
import { getBusesAction } from './actions';

const BusesPage = () => {
    const { data, isPending, error, refetch } = useServerActionQuery(
        getBusesAction,
        {
            input: undefined,
            queryKey: ['getBuses'],
        }
    );

    return (
        <div className="mt-6 flex flex-col">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                    Автобусы
                </h1>
                <Button asChild size="lg" className="px-8 text-base">
                    <Link href="/admin/main/buses/new-bus">
                        <Plus color="#fff" width={20} height={20} />
                        Добавить автобус
                    </Link>
                </Button>
            </div>

            {isPending ? (
                <div className="flex justify-center py-24">
                    <Spinner />
                </div>
            ) : error ? (
                <AdminStateCard
                    title="Не удалось загрузить автобусы"
                    description="Проверьте доступ к API или повторите попытку еще раз."
                    action={
                        <Button variant="outline" onClick={() => refetch()}>
                            Повторить
                        </Button>
                    }
                />
            ) : data && data.length > 0 ? (
                <Table buses={data} />
            ) : (
                <AdminStateCard
                    title="Автобусы еще не добавлены"
                    description="Добавьте первый автобус, чтобы потом назначать его на рейсы."
                    action={
                        <Button asChild size="lg" className="px-8 text-base">
                            <Link href="/admin/main/buses/new-bus">
                                <Plus color="#fff" width={20} height={20} />
                                Добавить автобус
                            </Link>
                        </Button>
                    }
                />
            )}
        </div>
    );
};

export default BusesPage;
