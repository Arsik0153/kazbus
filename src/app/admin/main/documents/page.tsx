'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { BusFront, FileCheck2, Plus, RefreshCw } from 'lucide-react';

import AdminStateCard from '@/components/admin/state-card';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { type Bus } from '@/data/types';
import {
    buildBusDocumentRows,
    busDocumentListSchema,
    type BusDocument,
} from '@/lib/bus-documents';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getBusesAction } from '../buses/actions';
import DocumentRow from './document-row';

async function readError(response: Response) {
    try {
        const body = (await response.json()) as { error?: unknown };
        if (typeof body.error === 'string') return body.error;
    } catch {
        // The fallback below is suitable for all list failures.
    }
    return 'Не удалось загрузить документы автобуса.';
}

function hasBusId(bus: Bus): bus is Bus & { id: string } {
    return typeof bus.id === 'string' && /^\d{6}$/.test(bus.id);
}

export default function AdminDocumentsPage() {
    const {
        data: busData,
        isPending: busesPending,
        error: busesError,
        refetch: refetchBuses,
    } = useServerActionQuery(getBusesAction, {
        input: undefined,
        queryKey: ['getBuses'],
    });
    const buses = useMemo(() => (busData ?? []).filter(hasBusId), [busData]);
    const [selectedBusId, setSelectedBusId] = useState('');
    const [documents, setDocuments] = useState<BusDocument[]>([]);
    const [documentsPending, setDocumentsPending] = useState(false);
    const [documentsError, setDocumentsError] = useState<string>();
    const loadSequence = useRef(0);

    const loadDocuments = useCallback(async (busId: string) => {
        const requestId = ++loadSequence.current;
        setDocumentsPending(true);
        setDocumentsError(undefined);
        setDocuments([]);
        try {
            const response = await fetch(
                `/api/admin/buses/${busId}/documents`,
                {
                    cache: 'no-store',
                }
            );
            if (requestId !== loadSequence.current) return;
            if (response.status === 401 || response.status === 403) {
                window.location.assign(
                    `/admin/session?reason=${response.status === 401 ? 'expired' : 'forbidden'}`
                );
                return;
            }
            if (!response.ok) {
                setDocumentsError(await readError(response));
                setDocuments([]);
                return;
            }
            const result = busDocumentListSchema.safeParse(
                await response.json()
            );
            if (!result.success) {
                setDocumentsError(
                    'Сервис вернул некорректный список документов.'
                );
                setDocuments([]);
                return;
            }
            setDocuments(result.data);
        } catch {
            if (requestId === loadSequence.current) {
                setDocumentsError('Сервис документов временно недоступен.');
                setDocuments([]);
            }
        } finally {
            if (requestId === loadSequence.current) {
                setDocumentsPending(false);
            }
        }
    }, []);

    useEffect(() => {
        if (buses[0] && !buses.some((bus) => bus.id === selectedBusId)) {
            setSelectedBusId(buses[0].id);
        }
    }, [buses, selectedBusId]);

    useEffect(() => {
        if (selectedBusId) void loadDocuments(selectedBusId);
    }, [loadDocuments, selectedBusId]);

    const rows = buildBusDocumentRows(documents);
    const selectedBus = buses.find((bus) => bus.id === selectedBusId);
    const missingCount = rows.filter((row) => row.status === 'missing').length;
    const attentionCount = rows.filter(
        (row) => row.status === 'expiring' || row.status === 'expired'
    ).length;

    const saveDocument = (document: BusDocument) => {
        setDocuments((current) => [
            ...current.filter((item) => item.kind !== document.kind),
            document,
        ]);
    };

    const deleteDocument = (document: BusDocument) => {
        setDocuments((current) =>
            current.filter((item) => item.id !== document.id)
        );
    };

    return (
        <div className="mt-6 flex flex-col gap-5 pb-10">
            <div className="rounded-[20px] bg-white px-5 py-7 md:px-8 md:py-8">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl font-semibold text-[#4A4A4A] md:text-[42px]">
                            Документы автобусов
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#7C8799]">
                            Храните регистрационные документы, страховку и
                            техосмотр для каждого автобуса. Файлы доступны
                            только сотрудникам вашей компании.
                        </p>
                    </div>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/admin/main/buses">
                            <BusFront />К автобусам
                        </Link>
                    </Button>
                </div>
            </div>

            {busesPending ? (
                <div className="flex justify-center rounded-[20px] bg-white py-24">
                    <Spinner />
                </div>
            ) : busesError ? (
                <AdminStateCard
                    title="Не удалось загрузить автобусы"
                    description="Повторите попытку. Если ошибка сохранится, войдите в кабинет снова."
                    action={
                        <Button
                            variant="outline"
                            onClick={() => refetchBuses()}
                        >
                            <RefreshCw />
                            Повторить
                        </Button>
                    }
                />
            ) : buses.length === 0 ? (
                <AdminStateCard
                    title="Сначала добавьте автобус"
                    description="Документы привязываются к автобусу вашей компании."
                    action={
                        <Button asChild size="lg">
                            <Link href="/admin/main/buses/new-bus">
                                <Plus />
                                Добавить автобус
                            </Link>
                        </Button>
                    }
                />
            ) : (
                <>
                    <section className="rounded-[20px] bg-white px-5 py-6 md:px-8">
                        <div className="grid gap-5 lg:grid-cols-[minmax(260px,1fr)_160px_160px] lg:items-end">
                            <div>
                                <label
                                    htmlFor="bus-document-bus"
                                    className="mb-2 block text-sm font-semibold text-[#4A4A4A]"
                                >
                                    Автобус
                                </label>
                                <select
                                    id="bus-document-bus"
                                    value={selectedBusId}
                                    onChange={(event) =>
                                        setSelectedBusId(event.target.value)
                                    }
                                    className="h-12 w-full rounded-lg border border-[#D1D5DB] bg-white px-4 text-base font-medium text-[#4A4A4A]"
                                >
                                    {buses.map((bus) => (
                                        <option key={bus.id} value={bus.id}>
                                            {bus.name || bus.model_stamp} ·{' '}
                                            {bus.state_number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="rounded-xl bg-[#F8FAFC] px-4 py-3">
                                <p className="text-sm text-[#7C8799]">
                                    Не загружено
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-[#4A4A4A]">
                                    {documentsPending ? '—' : missingCount}
                                </p>
                            </div>
                            <div className="rounded-xl bg-[#FFF7ED] px-4 py-3">
                                <p className="text-sm text-[#9A5B13]">
                                    Требуют внимания
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-[#92400E]">
                                    {documentsPending ? '—' : attentionCount}
                                </p>
                            </div>
                        </div>
                        {selectedBus && (
                            <p className="mt-4 text-sm text-[#7C8799]">
                                Гос. номер: {selectedBus.state_number} · ID:{' '}
                                {selectedBus.id}
                            </p>
                        )}
                    </section>

                    {documentsPending ? (
                        <div className="flex justify-center rounded-[20px] bg-white py-20">
                            <Spinner />
                        </div>
                    ) : documentsError ? (
                        <AdminStateCard
                            title="Не удалось загрузить документы"
                            description={documentsError}
                            action={
                                <Button
                                    variant="outline"
                                    onClick={() => loadDocuments(selectedBusId)}
                                >
                                    <RefreshCw />
                                    Повторить
                                </Button>
                            }
                        />
                    ) : (
                        <section className="rounded-[20px] bg-[#F8FAFC] p-3 md:p-5">
                            <div className="mb-4 flex items-center gap-3 px-2">
                                <FileCheck2 className="h-6 w-6 text-[#E74949]" />
                                <div>
                                    <h2 className="text-xl font-semibold text-[#4A4A4A]">
                                        Реестр документов
                                    </h2>
                                    <p className="text-sm text-[#7C8799]">
                                        PDF, JPEG или PNG, не больше 10 МиБ.
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                {rows.map((row) => (
                                    <DocumentRow
                                        key={row.kind}
                                        busId={selectedBusId}
                                        row={row}
                                        onSaved={saveDocument}
                                        onDeleted={deleteDocument}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
