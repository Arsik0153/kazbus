'use client';

import Link from 'next/link';

import Plus from '@/assets/admin/Plus';
import AdminStateCard from '@/components/admin/state-card';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { useServerActionQuery } from '@/lib/server-action-hooks';

import Table from './_components/table';
import { getTripsAction } from './action';

const TripsPage = () => {
    const { data, isPending, error, refetch } = useServerActionQuery(
        getTripsAction,
        {
            input: undefined,
            queryKey: ['getTrips'],
        }
    );

    return (
        <div className="mt-6 flex flex-col">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                    Рейсы
                </h1>
                <div className="flex gap-3">
                    <Button asChild size="lg" className="px-8 text-base">
                        <Link href="/admin/main/trips/new-trip">
                            <Plus color="#fff" width={20} height={20} />
                            Создать рейс
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" disabled>
                        Массовое редактирование скоро
                    </Button>
                </div>
            </div>

            {isPending ? (
                <div className="flex justify-center py-24">
                    <Spinner />
                </div>
            ) : error ? (
                <AdminStateCard
                    title="Не удалось загрузить рейсы"
                    description="Повторите попытку позже или проверьте доступность backend."
                    action={
                        <Button variant="outline" onClick={() => refetch()}>
                            Повторить
                        </Button>
                    }
                />
            ) : data && data.length > 0 ? (
                <Table trips={data} />
            ) : (
                <AdminStateCard
                    title="Рейсы еще не созданы"
                    description="Создайте первый рейс и запустите его в продажу, когда backend-контракт будет полностью готов."
                    action={
                        <Button asChild size="lg" className="px-8 text-base">
                            <Link href="/admin/main/trips/new-trip">
                                <Plus color="#fff" width={20} height={20} />
                                Создать рейс
                            </Link>
                        </Button>
                    }
                />
            )}
        </div>
    );
};

export default TripsPage;
