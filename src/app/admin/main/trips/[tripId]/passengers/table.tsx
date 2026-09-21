'use client';
import { useState } from 'react';
import { z } from 'zod';
import { runSchema } from '@/data/trip-run';

const labels = {
    waiting: 'Ожидает посадку',
    boarded: 'На рейсе',
    missed: 'Не пришёл',
};
export default function ManifestTable({
    run,
}: {
    run: z.infer<typeof runSchema>;
}) {
    const [query, setQuery] = useState('');
    const passengers = run.passengers.filter((p) =>
        `${p.fullName} ${p.ticketNumber} ${p.seatNumber}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );
    function download() {
        const rows = [
            ['Пассажир', 'Место', 'Билет', 'Оплата', 'Посадка'],
            ...passengers.map((p) => [
                p.fullName,
                p.seatNumber,
                p.ticketNumber,
                p.fareLabel,
                labels[p.status],
            ]),
        ];
        const csv =
            '\uFEFF' +
            rows
                .map((row) =>
                    row
                        .map(
                            (value) =>
                                `"${(/^[=+@\-\t\r]/.test(value) ? "'" + value : value).replaceAll('"', '""')}"`
                        )
                        .join(';')
                )
                .join('\r\n');
        const url = URL.createObjectURL(
            new Blob([csv], { type: 'text/csv;charset=utf-8' })
        );
        const link = document.createElement('a');
        link.href = url;
        link.download = `passengers-${run.dateIso}-${run.id}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }
    return (
        <section className="rounded-xl bg-white p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <p className="font-semibold">
                    {run.tripDate} · {run.departureTime} · Пассажиров:{' '}
                    {run.passengers.length}
                </p>
                <button
                    onClick={download}
                    disabled={passengers.length === 0}
                    className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
                >
                    Скачать CSV
                </button>
            </div>
            <label className="text-sm">
                Поиск
                <input
                    className="mt-2 mb-5 block w-full rounded-lg border p-3"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Имя, место или номер билета"
                />
            </label>
            {passengers.length === 0 ? (
                <p className="py-8 text-center text-[#777]">
                    Пассажиры не найдены.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr>
                                {[
                                    'Пассажир',
                                    'Место',
                                    'Билет',
                                    'Оплата',
                                    'Посадка',
                                ].map((label) => (
                                    <th className="border-b p-3" key={label}>
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {passengers.map((p) => (
                                <tr key={p.id}>
                                    <td className="border-b p-3">
                                        {p.fullName}
                                    </td>
                                    <td className="border-b p-3">
                                        {p.seatNumber}
                                    </td>
                                    <td className="border-b p-3">
                                        {p.ticketNumber}
                                    </td>
                                    <td className="border-b p-3">
                                        {p.fareLabel}
                                    </td>
                                    <td className="border-b p-3">
                                        {labels[p.status]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
