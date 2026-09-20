'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { closePassengerSupport, replyToPassengerSupport } from './actions';

export function AdminSupportRefresh() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    return (
        <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => router.refresh())}
            className="rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 font-semibold disabled:opacity-50"
        >
            {pending ? 'Обновляем…' : 'Обновить'}
        </button>
    );
}

export function AdminSupportReply({ supportId }: { supportId: number }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState('');

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;
        const form = event.currentTarget;
        const message = String(new FormData(form).get('message') ?? '');
        setPending(true);
        setResult('');
        try {
            const response = await replyToPassengerSupport({
                supportId,
                message,
            });
            setResult(response.message);
            if (response.ok) form.reset();
            if (response.ok || response.conflict) router.refresh();
            if (!response.ok && response.needsLogin) router.push('/admin');
        } catch {
            setResult('Не удалось получить ответ сервера. Попробуйте ещё раз.');
        } finally {
            setPending(false);
        }
    }

    return (
        <form method="post" onSubmit={submit} className="space-y-3">
            <label className="block text-sm font-semibold">
                Ответ пассажиру
                <textarea
                    name="message"
                    required
                    maxLength={4000}
                    rows={5}
                    className="mt-2 block w-full resize-y rounded-lg border border-[#D1D5DB] p-3 font-normal"
                />
            </label>
            <button
                disabled={pending}
                className="rounded-lg bg-[#E23333] px-5 py-3 font-semibold text-white disabled:opacity-50"
            >
                {pending ? 'Отправляем…' : 'Отправить ответ'}
            </button>
            {result && (
                <p role="status" className="text-sm">
                    {result}
                </p>
            )}
        </form>
    );
}

export function CloseSupportButton({ supportId }: { supportId: number }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [result, setResult] = useState('');

    async function close() {
        if (pending) return;
        setPending(true);
        setResult('');
        try {
            const response = await closePassengerSupport({ supportId });
            setResult(response.message);
            if (response.ok) {
                setConfirming(false);
                router.refresh();
            }
            if (!response.ok && response.needsLogin) router.push('/admin');
        } catch {
            setResult('Не удалось получить ответ сервера. Попробуйте ещё раз.');
        } finally {
            setPending(false);
        }
    }

    if (!confirming) {
        return (
            <button
                type="button"
                onClick={() => setConfirming(true)}
                className="rounded-lg border border-[#E23333] px-4 py-2 font-semibold text-[#E23333]"
            >
                Закрыть обращение
            </button>
        );
    }

    return (
        <div className="rounded-lg border border-[#F5B7B1] bg-red-50 p-4">
            <p className="font-medium">
                Пассажир больше не сможет писать в этот диалог.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
                <button
                    type="button"
                    disabled={pending}
                    onClick={close}
                    className="rounded-lg bg-[#E23333] px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                    {pending ? 'Закрываем…' : 'Подтвердить'}
                </button>
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => setConfirming(false)}
                    className="rounded-lg border bg-white px-4 py-2 font-semibold"
                >
                    Отмена
                </button>
            </div>
            {result && (
                <p role="status" className="mt-3 text-sm">
                    {result}
                </p>
            )}
        </div>
    );
}
