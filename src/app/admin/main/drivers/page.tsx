'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import DriversTable from './_components/table';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getDriversAction } from './actions';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';

const DriversPage = () => {
    const { data, isPending, error, refetch } = useServerActionQuery(
        getDriversAction,
        {
            input: undefined,
            queryKey: ['getDrivers'],
        }
    );

    return (
        <div className="mt-6 flex flex-col">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                    Водители
                </h1>
                <Button asChild size="lg" className="px-8 text-base">
                    <Link href="/admin/main/drivers/new-driver">
                        <Plus />
                        Добавить водителя
                    </Link>
                </Button>
            </div>

            {isPending ? (
                <div className="flex justify-center py-24">
                    <Spinner />
                </div>
            ) : error ? (
                <div className="mt-4 flex flex-col items-center gap-4 rounded-[20px] bg-white py-24">
                    <p className="text-xl font-semibold text-[#4A4A4A]">
                        Не удалось загрузить водителей
                    </p>
                    <Button variant="outline" onClick={() => refetch()}>
                        Повторить
                    </Button>
                </div>
            ) : data && data.length > 0 ? (
                <DriversTable drivers={data} />
            ) : (
                <div className="mt-[14px] flex w-full flex-col items-center justify-center gap-4 rounded-[20px] bg-white py-[108px]">
                    <p className="text-center text-[36px] font-semibold text-[#4A4A4A]">
                        Водители ещё не
                        <br />
                        зарегистрированы в системе
                    </p>
                    <Button asChild size="lg" className="px-8 text-base">
                        <Link href="/admin/main/drivers/new-driver">
                            <Plus />
                            Добавить водителя
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DriversPage;
