'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

import type { CargoAttachment } from '@/lib/cargo-contract';

type UploadKind = {
    value: CargoAttachment['kind'];
    label: string;
};

type Props = {
    title: string;
    description?: string;
    endpoint: string;
    fileScope: 'order' | 'driver';
    initialFiles: CargoAttachment[];
    currentUserId: number;
    uploadKinds: [UploadKind, ...UploadKind[]];
    loadOnMount?: boolean;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const kindLabel: Record<CargoAttachment['kind'], string> = {
    document: 'Документ',
    delivery_proof: 'Подтверждение доставки',
    license: 'Водительское удостоверение',
    identity: 'Удостоверение личности',
    medical: 'Медицинская справка',
    other: 'Другой документ',
};

function fileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} байт`;
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} КиБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МиБ`;
}

function fileDate(value: string) {
    return new Date(value).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

async function responseError(response: Response) {
    try {
        const payload = (await response.json()) as { error?: unknown };
        if (typeof payload.error === 'string') return payload.error;
    } catch {
        // Use the stable fallback below for a non-JSON proxy response.
    }
    return 'Не удалось сохранить файл';
}

export default function CargoFileList({
    title,
    description,
    endpoint,
    fileScope,
    initialFiles,
    currentUserId,
    uploadKinds,
    loadOnMount = false,
}: Props) {
    const [files, setFiles] = useState(initialFiles);
    const [busy, setBusy] = useState('');
    const [notice, setNotice] = useState<{
        text: string;
        error: boolean;
    } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!loadOnMount) setFiles(initialFiles);
    }, [initialFiles, loadOnMount]);
    useEffect(() => {
        if (!loadOnMount) return;
        let active = true;
        setBusy('load');
        fetch(endpoint)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(await responseError(response));
                }
                return (await response.json()) as CargoAttachment[];
            })
            .then((items) => {
                if (active) setFiles(items);
            })
            .catch((error: unknown) => {
                if (active) {
                    setNotice({
                        text:
                            error instanceof Error
                                ? error.message
                                : 'Не удалось загрузить список файлов.',
                        error: true,
                    });
                }
            })
            .finally(() => {
                if (active) setBusy('');
            });
        return () => {
            active = false;
        };
    }, [endpoint, loadOnMount]);

    async function upload(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;
        const data = new FormData(event.currentTarget);
        const file = data.get('file');
        if (!(file instanceof File) || file.size === 0) {
            setNotice({ text: 'Выберите файл.', error: true });
            return;
        }
        if (file.size > MAX_FILE_BYTES) {
            setNotice({
                text: 'Файл должен быть не больше 10 МиБ.',
                error: true,
            });
            return;
        }

        setBusy('upload');
        setNotice(null);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: data,
            });
            if (!response.ok) throw new Error(await responseError(response));
            const attachment = (await response.json()) as CargoAttachment;
            setFiles((current) => [
                ...current.filter((item) => item.id !== attachment.id),
                attachment,
            ]);
            formRef.current?.reset();
            setNotice({ text: 'Файл сохранён.', error: false });
        } catch (error) {
            setNotice({
                text:
                    error instanceof Error
                        ? error.message
                        : 'Не удалось сохранить файл.',
                error: true,
            });
        } finally {
            setBusy('');
        }
    }

    async function remove(file: CargoAttachment) {
        if (busy) return;
        setBusy(`delete-${file.id}`);
        setNotice(null);
        try {
            const response = await fetch(
                `/api/cargo/files/${fileScope}/${file.id}`,
                { method: 'DELETE' }
            );
            if (!response.ok) throw new Error(await responseError(response));
            setFiles((current) =>
                current.filter((item) => item.id !== file.id)
            );
            setNotice({ text: 'Файл удалён.', error: false });
        } catch (error) {
            setNotice({
                text:
                    error instanceof Error
                        ? error.message
                        : 'Не удалось удалить файл.',
                error: true,
            });
        } finally {
            setBusy('');
        }
    }

    return (
        <section className="m-0 min-w-0 rounded-[10px] border border-[#d1d1d1] bg-white p-5">
            <h3 className="text-xl leading-[1.1] font-bold">{title}</h3>
            {description && (
                <p className="mt-2 text-sm text-[#a0a0a0]">{description}</p>
            )}
            {files.map((file) => (
                <div
                    className="mt-3 rounded-[10px] border border-[#e9e9e9] bg-white p-4"
                    key={file.id}
                >
                    <a
                        className="font-semibold break-all text-[#e23333] underline"
                        href={`/api/cargo/files/${fileScope}/${file.id}`}
                    >
                        {file.name}
                    </a>
                    <p className="mt-2 text-sm text-[#a0a0a0]">
                        {kindLabel[file.kind]} · {fileSize(file.size)} ·{' '}
                        {fileDate(file.createdAt)} · {file.uploadedBy.name}
                    </p>
                    {file.uploadedBy.id === currentUserId && (
                        <button
                            className="font-semibold text-[#e23333] underline disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            disabled={!!busy}
                            onClick={() => remove(file)}
                        >
                            {busy === `delete-${file.id}`
                                ? 'Удаляем…'
                                : 'Удалить'}
                        </button>
                    )}
                </div>
            ))}
            {!files.length && (
                <p className="mt-2 text-sm text-[#a0a0a0]">
                    Загруженных файлов пока нет.
                </p>
            )}
            <form
                className="mt-5 flex flex-col gap-3 space-y-3"
                ref={formRef}
                onSubmit={upload}
            >
                {uploadKinds.length === 1 ? (
                    <input
                        name="kind"
                        type="hidden"
                        value={uploadKinds[0].value}
                    />
                ) : (
                    <label className="flex min-w-0 flex-col gap-2 text-sm font-medium">
                        <span>Тип документа</span>
                        <select
                            className="w-full min-w-0 rounded-[10px] border border-[#d1d1d1] bg-white p-4"
                            name="kind"
                            defaultValue={uploadKinds[0].value}
                        >
                            {uploadKinds.map((kind) => (
                                <option key={kind.value} value={kind.value}>
                                    {kind.label}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                <label className="flex min-w-0 flex-col gap-2 text-sm font-medium">
                    <span>Файл PDF, JPEG или PNG до 10 МиБ</span>
                    <input
                        className="w-full min-w-0 rounded-[10px] border border-dashed border-[#d1d1d1] bg-[#fff7f7] p-4"
                        name="file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        required
                    />
                </label>
                <button
                    className="w-full rounded-[10px] border border-[#e23333] bg-[#e23333] p-4 text-center font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!!busy}
                >
                    {busy === 'upload' ? 'Загружаем…' : 'Загрузить'}
                </button>
            </form>
            {notice && (
                <p
                    className={
                        notice.error
                            ? 'mt-3 text-[#e23333]'
                            : 'mt-2 text-sm text-[#a0a0a0]'
                    }
                    role="status"
                >
                    {notice.text}
                </p>
            )}
        </section>
    );
}
