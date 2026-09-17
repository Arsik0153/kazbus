'use client';

import { useEffect, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { resolveIncident } from './actions';

export function RefreshOperations() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible')
                startTransition(() => router.refresh());
        }, 30000);
        return () => clearInterval(interval);
    }, [router]);
    return (
        <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => router.refresh())}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
        >
            {pending ? 'Обновляем…' : 'Обновить'}
        </button>
    );
}

export function ResolutionForm({ id }: { id: number }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState('');
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;
        const form = event.currentTarget;
        const resolution = String(new FormData(form).get('resolution') ?? '');
        setPending(true);
        try {
            const result = await resolveIncident({ id, resolution });
            setMessage(result.message);
            if (result.ok) form.reset();
            if (result.ok || ('conflict' in result && result.conflict))
                router.refresh();
        } catch {
            setMessage(
                'Не удалось получить ответ сервера. Попробуйте ещё раз.'
            );
        } finally {
            setPending(false);
        }
    }
    return (
        <form method="post" onSubmit={submit} className="mt-4 space-y-3">
            <label className="block text-sm">
                Результат обработки
                <textarea
                    name="resolution"
                    required
                    maxLength={2000}
                    className="mt-1 block w-full rounded-lg border p-3"
                />
            </label>
            <button
                disabled={pending}
                className="rounded-lg bg-[#E23333] px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
                {pending ? 'Сохраняем…' : 'Закрыть обращение'}
            </button>
            {message && <p role="status">{message}</p>}
        </form>
    );
}
