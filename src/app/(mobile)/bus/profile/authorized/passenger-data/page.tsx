'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Topbar from '@/components/topbar';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import {
    createPassenger,
    getMyPassengersAction,
} from '@/app/(mobile)/bus/main/tickets/actions';
import PassengerCard from '@/components/passenger-card';
import Spinner from '@/components/spinner';
import { documentTypes } from '@/static/constants';
import { deleteSavedPassenger, updateSavedPassenger } from './actions';

export default function PassengerDataPage() {
    const {
        data: passengers = [],
        isPending,
        isError,
        refetch,
    } = useServerActionQuery(getMyPassengersAction, {
        input: undefined,
        queryKey: ['passengers'],
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const editing = passengers.find(
        (passenger) => passenger.user_id === editingId
    );
    const [showForm, setShowForm] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [confirmation, setConfirmation] = useState<number | null>(null);
    useEffect(() => setHydrated(true), []);

    async function create(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;
        const form = event.currentTarget;
        const data = new FormData(form);
        const birthDate = String(data.get('birth_date') ?? '')
            .split('-')
            .reverse()
            .join('.');
        setBusy(true);
        setMessage('');
        try {
            const input = {
                full_name: String(data.get('full_name') ?? '').trim(),
                document_type: String(data.get('document_type') ?? ''),
                document_number_or_iin: String(
                    data.get('document_number_or_iin') ?? ''
                ).trim(),
                birth_date: birthDate,
            };
            if (editingId !== null) {
                const result = await updateSavedPassenger({
                    ...input,
                    id: editingId,
                });
                setMessage(result.message);
                if (!result.ok) return;
            } else {
                const [, error] = await createPassenger(input);
                if (error) {
                    setMessage(
                        'Не удалось добавить пассажира. Проверьте ФИО, документ и дату рождения.'
                    );
                    return;
                }
                setMessage('Пассажир добавлен.');
            }
            form.reset();
            setEditingId(null);
            setShowForm(false);
            await refetch();
        } catch {
            setMessage('Сервер недоступен. Попробуйте ещё раз.');
        } finally {
            setBusy(false);
        }
    }

    async function remove(id: number) {
        if (busy) return;
        setBusy(true);
        try {
            const result = await deleteSavedPassenger(id);
            setMessage(result.message);
            setConfirmation(null);
            if (result.ok && editingId === id) {
                setEditingId(null);
                setShowForm(false);
            }
            await refetch();
        } catch {
            setMessage('Сервер недоступен. Попробуйте ещё раз.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <Topbar backHref="/bus/profile">Данные моих пассажиров</Topbar>
            <main className="space-y-5 px-5 pt-6 pb-24">
                <button
                    disabled={busy}
                    onClick={() => {
                        setEditingId(null);
                        setShowForm(!showForm);
                    }}
                    className="font-semibold text-[#E23333]"
                >
                    Добавить пассажира
                </button>
                {showForm && (
                    <section
                        id="passenger-form"
                        className="rounded-xl border p-4"
                    >
                        <h2 className="font-semibold">
                            {editing
                                ? 'Изменить данные пассажира'
                                : 'Новый пассажир'}
                        </h2>
                        <form
                            key={editingId ?? 'new'}
                            method="post"
                            onSubmit={create}
                            className="mt-4 space-y-4"
                        >
                            <label className="block">
                                ФИО
                                <input
                                    name="full_name"
                                    defaultValue={editing?.full_name ?? ''}
                                    required
                                    minLength={5}
                                    maxLength={255}
                                    autoComplete="name"
                                    className="mt-1 block w-full rounded border p-3"
                                />
                            </label>
                            <label className="block">
                                Тип документа
                                <select
                                    name="document_type"
                                    defaultValue={
                                        editing?.document_type ?? 'id'
                                    }
                                    className="mt-1 block w-full rounded border p-3"
                                >
                                    {documentTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                Номер документа или ИИН
                                <input
                                    name="document_number_or_iin"
                                    defaultValue={
                                        editing?.document_number_or_iin ?? ''
                                    }
                                    required
                                    minLength={5}
                                    maxLength={100}
                                    className="mt-1 block w-full rounded border p-3"
                                />
                            </label>
                            <label className="block">
                                Дата рождения
                                <input
                                    name="birth_date"
                                    defaultValue={editing?.birth_date ?? ''}
                                    type="date"
                                    required
                                    min="1900-01-02"
                                    className="mt-1 block w-full rounded border p-3"
                                />
                            </label>
                            <button
                                disabled={!hydrated || busy}
                                className="rounded-lg bg-[#E23333] px-5 py-3 font-semibold text-white disabled:opacity-50"
                            >
                                {busy ? 'Сохраняем…' : 'Сохранить пассажира'}
                            </button>
                        </form>
                    </section>
                )}
                {message && (
                    <p role="status" className="rounded-lg bg-[#F5F5F5] p-4">
                        {message}
                    </p>
                )}
                {isPending ? (
                    <Spinner size="md" />
                ) : isError ? (
                    <div role="alert">
                        <p>
                            Не удалось загрузить пассажиров. Проверьте
                            соединение и вход в аккаунт.
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="mt-2 underline"
                        >
                            Обновить список
                        </button>
                    </div>
                ) : passengers.length === 0 ? (
                    <p>Сохранённых пассажиров пока нет.</p>
                ) : (
                    passengers.map((passenger) => (
                        <section key={passenger.user_id} className="space-y-2">
                            <PassengerCard user={passenger} />
                            <button
                                disabled={busy}
                                onClick={() => {
                                    setEditingId(passenger.user_id);
                                    setShowForm(true);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                }}
                                className="mr-4 text-sm text-[#E23333] underline"
                            >
                                Изменить данные
                            </button>
                            {confirmation === passenger.user_id ? (
                                <div className="rounded-lg border p-3">
                                    <p>
                                        Удалить пассажира «{passenger.full_name}
                                        »?
                                    </p>
                                    <div className="mt-3 flex gap-5">
                                        <button
                                            disabled={busy}
                                            onClick={() =>
                                                remove(passenger.user_id)
                                            }
                                            className="text-[#E23333] underline"
                                        >
                                            Да, удалить
                                        </button>
                                        <button
                                            disabled={busy}
                                            onClick={() =>
                                                setConfirmation(null)
                                            }
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    disabled={busy}
                                    onClick={() =>
                                        setConfirmation(passenger.user_id)
                                    }
                                    className="text-sm text-[#E23333] underline"
                                >
                                    Удалить пассажира
                                </button>
                            )}
                        </section>
                    ))
                )}
                <p className="text-sm text-[#666]">
                    Данные пассажиров с историей билетов нельзя изменить или
                    удалить. При необходимости добавьте нового пассажира.
                </p>
            </main>
        </>
    );
}
