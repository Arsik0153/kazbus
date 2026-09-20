'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/button';
import { createSupportRequest, replyToSupportRequest } from './actions';

type TicketOption = {
    id: number;
    label: string;
};

export function RefreshSupportButton() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    return (
        <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => router.refresh())}
            className="rounded-[10px] border border-[#D1D1D1] bg-white px-4 py-3 font-semibold text-[#4A4A4A] disabled:opacity-50"
        >
            {pending ? 'Обновляем…' : 'Обновить'}
        </button>
    );
}

export function CreateSupportForm({
    tickets,
    initialTicketId,
}: {
    tickets: TicketOption[];
    initialTicketId?: number;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState('');

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;

        const form = event.currentTarget;
        const data = new FormData(form);
        setPending(true);
        setMessage('');
        try {
            const result = await createSupportRequest({
                ticketId: Number(data.get('ticketId')),
                subject: String(data.get('subject') ?? ''),
                message: String(data.get('message') ?? ''),
            });
            if (result.ok) {
                router.push(`/bus/support/${result.supportId}`);
                return;
            }
            if (result.needsLogin) {
                router.push('/bus/profile/login');
                return;
            }
            setMessage(result.message);
        } catch {
            setMessage(
                'Не удалось получить ответ сервера. Попробуйте ещё раз.'
            );
        } finally {
            setPending(false);
        }
    }

    return (
        <form method="post" onSubmit={submit} className="space-y-5">
            <label className="block text-sm font-semibold text-[#4A4A4A]">
                Билет
                <select
                    name="ticketId"
                    required
                    defaultValue={initialTicketId ?? tickets[0]?.id}
                    className="mt-2 h-12 w-full rounded-[10px] border border-[#D1D1D1] bg-white px-4 text-base font-normal"
                >
                    {tickets.map((ticket) => (
                        <option key={ticket.id} value={ticket.id}>
                            {ticket.label}
                        </option>
                    ))}
                </select>
            </label>
            <label className="block text-sm font-semibold text-[#4A4A4A]">
                Тема
                <input
                    name="subject"
                    required
                    maxLength={120}
                    autoComplete="off"
                    className="mt-2 h-12 w-full rounded-[10px] border border-[#D1D1D1] bg-white px-4 text-base font-normal"
                    placeholder="Например, вопрос о поездке"
                />
            </label>
            <label className="block text-sm font-semibold text-[#4A4A4A]">
                Сообщение
                <textarea
                    name="message"
                    required
                    maxLength={4000}
                    rows={7}
                    className="mt-2 block w-full resize-y rounded-[10px] border border-[#D1D1D1] bg-white p-4 text-base font-normal"
                    placeholder="Опишите вопрос подробнее"
                />
            </label>
            {message && (
                <p
                    role="alert"
                    className="rounded-[10px] bg-red-50 p-3 text-sm text-[#B42318]"
                >
                    {message}
                </p>
            )}
            <Button type="submit" variant="secondary" loading={pending}>
                Отправить обращение
            </Button>
        </form>
    );
}

export function PassengerReplyForm({ supportId }: { supportId: number }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState('');

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;

        const form = event.currentTarget;
        const body = String(new FormData(form).get('message') ?? '');
        setPending(true);
        setMessage('');
        try {
            const result = await replyToSupportRequest({
                supportId,
                message: body,
            });
            if (result.ok) {
                form.reset();
                setMessage(result.message);
                router.refresh();
                return;
            }
            if (result.needsLogin) {
                router.push('/bus/profile/login');
                return;
            }
            setMessage(result.message);
        } catch {
            setMessage(
                'Не удалось получить ответ сервера. Попробуйте ещё раз.'
            );
        } finally {
            setPending(false);
        }
    }

    return (
        <form method="post" onSubmit={submit} className="space-y-3">
            <label className="block text-sm font-semibold text-[#4A4A4A]">
                Новое сообщение
                <textarea
                    name="message"
                    required
                    maxLength={4000}
                    rows={5}
                    className="mt-2 block w-full resize-y rounded-[10px] border border-[#D1D1D1] bg-white p-4 text-base font-normal"
                />
            </label>
            <Button type="submit" variant="secondary" loading={pending}>
                Отправить
            </Button>
            {message && (
                <p role="status" className="text-sm text-[#4A4A4A]">
                    {message}
                </p>
            )}
        </form>
    );
}

export function PassengerLoginCard() {
    return (
        <div className="mx-5 mt-12 rounded-[16px] bg-[#F9F9F9] p-6 text-center">
            <h1 className="text-2xl font-semibold text-[#4A4A4A]">
                Войдите в аккаунт
            </h1>
            <p className="mt-3 text-base text-[#6B7280]">
                Обращение можно создать по билету из вашего аккаунта.
            </p>
            <Link href="/bus/profile/login" className="mt-6 block">
                <Button variant="secondary">Войти</Button>
            </Link>
        </div>
    );
}
