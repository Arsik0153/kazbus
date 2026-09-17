'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    BUS_DOCUMENT_LABELS,
    BUS_DOCUMENT_STATUS_LABELS,
    MAX_BUS_DOCUMENT_BYTES,
    busDocumentSchema,
    type BusDocument,
    type BusDocumentRow,
} from '@/lib/bus-documents';

type DocumentRowProps = {
    busId: string;
    row: BusDocumentRow;
    onSaved: (document: BusDocument) => void;
    onDeleted: (document: BusDocument) => void;
};

const statusClassName: Record<BusDocumentRow['status'], string> = {
    valid: 'bg-[#DCFCE7] text-[#166534]',
    expiring: 'bg-[#FEF3C7] text-[#92400E]',
    expired: 'bg-[#FEE2E2] text-[#B91C1C]',
    missing: 'bg-[#E2E8F0] text-[#475569]',
};

function formatDate(value: string | null) {
    if (!value) return 'Без срока';
    const [year, month, day] = value.split('-');
    return `${day}.${month}.${year}`;
}

function formatBytes(size: number) {
    if (size < 1024) return `${size} Б`;
    if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} КиБ`;
    return `${(size / (1024 * 1024)).toFixed(1)} МиБ`;
}

async function readError(response: Response, fallback: string) {
    try {
        const body = (await response.json()) as { error?: unknown };
        if (typeof body.error === 'string') return body.error;
    } catch {
        // The fallback describes the failed action.
    }
    return fallback;
}

export default function DocumentRow({
    busId,
    row,
    onSaved,
    onDeleted,
}: DocumentRowProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [hydrated, setHydrated] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [message, setMessage] = useState<string>();
    const [saved, setSaved] = useState(false);
    const busy = isUploading || isDeleting || isDownloading;
    const document = row.document;

    useEffect(() => setHydrated(true), []);

    const upload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (busy) return;
        const form = event.currentTarget;
        const formData = new FormData(form);
        const file = formData.get('file');
        if (!(file instanceof File) || file.size === 0) {
            setMessage('Выберите файл.');
            return;
        }
        if (file.size > MAX_BUS_DOCUMENT_BYTES) {
            setMessage('Файл должен быть не больше 10 МиБ.');
            return;
        }
        if (
            !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
        ) {
            setMessage('Поддерживаются только PDF, JPEG и PNG.');
            return;
        }
        if (
            document &&
            !window.confirm(
                `Заменить текущий документ «${BUS_DOCUMENT_LABELS[row.kind]}»?`
            )
        ) {
            return;
        }

        formData.set('kind', row.kind);
        setIsUploading(true);
        setMessage(undefined);
        setSaved(false);
        try {
            const response = await fetch(
                `/api/admin/buses/${busId}/documents`,
                { method: 'POST', body: formData }
            );
            if (response.status === 401 || response.status === 403) {
                window.location.assign(
                    `/admin/session?reason=${response.status === 401 ? 'expired' : 'forbidden'}`
                );
                return;
            }
            if (!response.ok) {
                setMessage(
                    await readError(response, 'Не удалось загрузить документ.')
                );
                return;
            }
            const result = busDocumentSchema.safeParse(await response.json());
            if (!result.success) {
                setMessage('Сервис вернул некорректные данные документа.');
                return;
            }
            onSaved(result.data);
            form.reset();
            setSelectedFileName('');
            setSaved(true);
        } catch {
            setMessage('Сервис документов временно недоступен.');
        } finally {
            setIsUploading(false);
        }
    };

    const remove = async () => {
        if (!document || busy) return;
        if (!window.confirm(`Удалить файл «${document.name}»?`)) return;

        setIsDeleting(true);
        setMessage(undefined);
        setSaved(false);
        try {
            const response = await fetch(
                `/api/admin/bus-documents/${document.id}`,
                { method: 'DELETE' }
            );
            if (response.status === 401 || response.status === 403) {
                window.location.assign(
                    `/admin/session?reason=${response.status === 401 ? 'expired' : 'forbidden'}`
                );
                return;
            }
            if (!response.ok) {
                setMessage(
                    await readError(response, 'Не удалось удалить документ.')
                );
                return;
            }
            onDeleted(document);
            formRef.current?.reset();
            setSelectedFileName('');
        } catch {
            setMessage('Сервис документов временно недоступен.');
        } finally {
            setIsDeleting(false);
        }
    };

    const download = async () => {
        if (!document || busy) return;
        setIsDownloading(true);
        setMessage(undefined);
        try {
            const response = await fetch(
                `/api/admin/bus-documents/${document.id}`,
                { cache: 'no-store' }
            );
            if (response.status === 401 || response.status === 403) {
                window.location.assign(
                    `/admin/session?reason=${response.status === 401 ? 'expired' : 'forbidden'}`
                );
                return;
            }
            if (!response.ok) {
                setMessage(
                    await readError(response, 'Не удалось скачать документ.')
                );
                return;
            }
            const url = URL.createObjectURL(await response.blob());
            const link = window.document.createElement('a');
            link.href = url;
            link.download = document.name;
            window.document.body.append(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 0);
        } catch {
            setMessage('Сервис документов временно недоступен.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <article className="rounded-[18px] border border-[#E2E8F0] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-[#4A4A4A]">
                        {BUS_DOCUMENT_LABELS[row.kind]}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[#7C8799]">
                        Срок действия: {formatDate(document?.expiresOn ?? null)}
                    </p>
                </div>
                <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClassName[row.status]}`}
                >
                    {BUS_DOCUMENT_STATUS_LABELS[row.status]}
                </span>
            </div>

            {document ? (
                <div className="mt-4 rounded-xl bg-[#F8FAFC] p-4">
                    <p className="font-semibold break-all text-[#4A4A4A]">
                        {document.name}
                    </p>
                    <p className="mt-1 text-sm text-[#7C8799]">
                        {formatBytes(document.size)} · загрузил{' '}
                        {document.uploadedBy.name || 'Администратор'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={busy}
                            onClick={download}
                        >
                            <Download />
                            {isDownloading ? 'Скачиваем…' : 'Скачать'}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={busy}
                            onClick={remove}
                        >
                            <Trash2 />
                            {isDeleting ? 'Удаляем…' : 'Удалить'}
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="mt-4 rounded-xl bg-[#F8FAFC] p-4 text-sm font-medium text-[#7C8799]">
                    Файл этого типа ещё не загружен.
                </p>
            )}

            <form
                ref={formRef}
                method="post"
                encType="multipart/form-data"
                onSubmit={upload}
                className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_190px_auto] lg:items-end"
            >
                <div>
                    <label
                        htmlFor={`file-${row.kind}`}
                        className="mb-2 block text-sm font-semibold text-[#4A4A4A]"
                    >
                        {document ? 'Новый файл' : 'Файл'}
                    </label>
                    <div className="flex h-12 min-w-0 items-center gap-3 rounded-lg border border-[#D1D5DB] bg-white px-3">
                        <label
                            htmlFor={`file-${row.kind}`}
                            className="shrink-0 cursor-pointer rounded-md bg-[#FEE2E2] px-3 py-1.5 text-sm font-semibold text-[#B42318]"
                        >
                            Выбрать файл
                        </label>
                        <span className="truncate text-sm text-[#4A4A4A]">
                            {selectedFileName || 'Файл не выбран'}
                        </span>
                        <input
                            id={`file-${row.kind}`}
                            name="file"
                            type="file"
                            accept="application/pdf,image/jpeg,image/png"
                            disabled={busy}
                            className="sr-only"
                            onChange={(event) =>
                                setSelectedFileName(
                                    event.target.files?.[0]?.name ?? ''
                                )
                            }
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor={`expires-${row.kind}`}
                        className="mb-2 block text-sm font-semibold text-[#4A4A4A]"
                    >
                        Действует до{' '}
                        <span className="font-normal text-[#7C8799]">
                            (необязательно)
                        </span>
                    </label>
                    <input
                        key={document?.id ?? 'missing'}
                        id={`expires-${row.kind}`}
                        name="expires_on"
                        type="date"
                        defaultValue={document?.expiresOn ?? ''}
                        disabled={busy}
                        className="h-12 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#4A4A4A]"
                    />
                </div>
                <Button
                    type="submit"
                    size="lg"
                    disabled={!hydrated || busy}
                    className="bg-[#E74949] px-5 text-white hover:bg-[#CF3C3C]"
                >
                    <Upload />
                    {isUploading
                        ? 'Загружаем…'
                        : document
                          ? 'Заменить'
                          : 'Загрузить'}
                </Button>
            </form>
            <div className="mt-3 min-h-5" aria-live="polite">
                {saved && (
                    <p className="text-sm font-semibold text-[#166534]">
                        Документ сохранён.
                    </p>
                )}
                {message && (
                    <p
                        role="alert"
                        className="text-sm font-semibold text-[#B42318]"
                    >
                        {message}
                    </p>
                )}
            </div>
        </article>
    );
}
