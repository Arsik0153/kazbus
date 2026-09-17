import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { adminFetch } from '@/lib/admin-api';
import { runSchema } from '@/data/trip-run';
import ManifestTable from './table';

export default async function AdminTripPassengersPage({
    params,
    searchParams,
}: {
    params: Promise<{ tripId: string }>;
    searchParams: Promise<{ date?: string }>;
}) {
    const { tripId } = await params;
    if (!/^\d+$/.test(tripId)) notFound();
    const date =
        (await searchParams).date ||
        new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Almaty',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());
    const response = await adminFetch(
        `/trip/trips/${tripId}/admin-details/?date=${encodeURIComponent(date)}`
    );
    if (response.status === 404) notFound();
    if (!response.ok)
        return (
            <section className="mt-6 rounded-xl bg-white p-6" role="alert">
                <h1 className="text-2xl font-semibold">
                    Список пассажиров недоступен
                </h1>
                <p className="my-3">
                    Проверьте дату отправления и повторите запрос.
                </p>
                <Link
                    className="underline"
                    href={`/admin/main/trips/${tripId}/passengers`}
                >
                    Показать сегодняшний рейс
                </Link>
            </section>
        );
    const { current_run: run } = z
        .object({ current_run: runSchema })
        .parse(await response.json());
    return (
        <main className="mt-6 space-y-5 pb-10">
            <section className="rounded-xl bg-white p-6">
                <Link
                    className="text-sm text-[#E23333] underline"
                    href={`/admin/main/trips/${tripId}`}
                >
                    К рейсу
                </Link>
                <h1 className="mt-4 text-3xl font-semibold">
                    Пассажиры: {run.routeLabel}
                </h1>
                <form className="mt-5 flex flex-wrap gap-3">
                    <label className="text-sm">
                        Дата рейса
                        <input
                            className="ml-3 rounded-lg border p-2"
                            type="date"
                            name="date"
                            defaultValue={date}
                            required
                        />
                    </label>
                    <button className="rounded-lg bg-[#E23333] px-4 py-2 text-sm text-white">
                        Показать
                    </button>
                </form>
            </section>
            <ManifestTable run={run} />
        </main>
    );
}
