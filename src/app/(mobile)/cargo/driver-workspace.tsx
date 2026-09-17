'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import {
    cargoLogoutAction,
    reportDriverIncidentAction,
    updateDriverTripStatusAction,
} from '@/actions/cargo';
import type { DriverState, DriverTrip } from '@/lib/cargo-contract';
import CargoFileList from '@/components/cargo/cargo-file-list';

const statusLabel: Record<DriverTrip['status'], string> = {
    planned: 'Назначен',
    loading: 'Погрузка',
    in_transit: 'В пути',
    unloading: 'Разгрузка',
    completed: 'Завершен',
};

const nextStatus: Partial<
    Record<DriverTrip['status'], Exclude<DriverTrip['status'], 'planned'>>
> = {
    planned: 'loading',
    loading: 'in_transit',
    in_transit: 'unloading',
    unloading: 'completed',
};

export default function DriverWorkspace({
    state,
    currentUserId,
}: {
    state: DriverState;
    currentUserId: number;
}) {
    const router = useRouter();
    const [busy, setBusy] = useState('');
    const [message, setMessage] = useState('');

    async function advance(trip: DriverTrip) {
        const target = nextStatus[trip.status];
        if (!target || trip.status === 'completed') return;
        setBusy(`status-${trip.id}`);
        setMessage('');
        const response = await updateDriverTripStatusAction({
            tripId: trip.id,
            expected: trip.status,
            target,
        });
        setBusy('');
        if (!response.ok) {
            setMessage(response.error);
            return;
        }
        setMessage('Статус рейса обновлен.');
        router.refresh();
    }

    async function incident(event: FormEvent<HTMLFormElement>, tripId: number) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        setBusy(`incident-${tripId}`);
        setMessage('');
        const response = await reportDriverIncidentAction({
            tripId,
            text: String(form.get('text') ?? ''),
            newEta: String(form.get('new_eta') ?? '') || undefined,
        });
        setBusy('');
        if (!response.ok) {
            setMessage(response.error);
            return;
        }
        formElement.reset();
        setMessage('Инцидент передан диспетчеру и грузоотправителю.');
        router.refresh();
    }

    return (
        <main className="min-h-full bg-(--gray) px-5 pt-16 pb-32 text-[#4a4a4a]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[#a0a0a0]">
                        {state.profile.company.name}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold">
                        {state.profile.fullName}
                    </h1>
                </div>
                <button
                    className="text-sm font-semibold text-[#e23333]"
                    onClick={async () => {
                        await cargoLogoutAction();
                        router.replace('/cargo/login');
                        router.refresh();
                    }}
                >
                    Выйти
                </button>
            </div>

            {message && (
                <p
                    className="mt-5 rounded-xl border border-[#f3cdcd] bg-[#fff2f2] p-4 text-sm"
                    role="status"
                >
                    {message}
                </p>
            )}

            <div className="mt-6">
                <CargoFileList
                    title="Личные документы"
                    description="Вы и ваш диспетчер видите эти файлы."
                    endpoint="/api/cargo/driver/documents"
                    fileScope="driver"
                    initialFiles={state.documents}
                    currentUserId={currentUserId}
                    uploadKinds={[
                        {
                            value: 'license',
                            label: 'Водительское удостоверение',
                        },
                        {
                            value: 'identity',
                            label: 'Удостоверение личности',
                        },
                        {
                            value: 'medical',
                            label: 'Медицинская справка',
                        },
                        { value: 'other', label: 'Другой документ' },
                    ]}
                />
            </div>

            <section className="mt-6 space-y-4">
                <h2 className="text-xl font-bold">Назначенные рейсы</h2>
                {!state.trips.length && (
                    <div className="rounded-xl border border-[#d1d1d1] bg-white p-6 text-center">
                        <strong>Сейчас нет назначенных рейсов</strong>
                        <p className="mt-2 text-sm text-[#a0a0a0]">
                            Новый рейс появится после назначения диспетчером.
                        </p>
                    </div>
                )}
                {state.trips.map((trip) => {
                    const target = nextStatus[trip.status];
                    return (
                        <article
                            className="rounded-xl border border-[#d1d1d1] bg-white p-5"
                            key={trip.id}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold text-[#e23333]">
                                        {trip.order.id}
                                    </p>
                                    <h3 className="mt-1 text-lg font-bold">
                                        {trip.order.from} → {trip.order.to}
                                    </h3>
                                </div>
                                <span className="rounded-full bg-[#fff2f2] px-3 py-1 text-xs font-semibold text-[#e23333]">
                                    {statusLabel[trip.status]}
                                </span>
                            </div>

                            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg bg-[#f8f8f8] p-3">
                                    <dt className="text-[#a0a0a0]">Груз</dt>
                                    <dd className="mt-1 font-semibold">
                                        {trip.order.cargo} ·{' '}
                                        {trip.order.quantity} {trip.order.unit}
                                    </dd>
                                </div>
                                <div className="rounded-lg bg-[#f8f8f8] p-3">
                                    <dt className="text-[#a0a0a0]">Машина</dt>
                                    <dd className="mt-1 font-semibold">
                                        {trip.vehicle.model} ·{' '}
                                        {trip.vehicle.plateNumber}
                                    </dd>
                                </div>
                                <div className="col-span-2 rounded-lg bg-[#f8f8f8] p-3">
                                    <dt className="text-[#a0a0a0]">
                                        Срок доставки
                                    </dt>
                                    <dd className="mt-1 font-semibold">
                                        {trip.eta}
                                    </dd>
                                </div>
                            </dl>

                            {trip.order.comment && (
                                <p className="mt-4 text-sm">
                                    <strong>Комментарий:</strong>{' '}
                                    {trip.order.comment}
                                </p>
                            )}

                            {trip.status === 'completed' && (
                                <div className="mt-4">
                                    <CargoFileList
                                        title="Подтверждение доставки"
                                        description="После завершения рейса добавьте фото или PDF."
                                        endpoint={`/api/cargo/orders/${trip.order.recordId}/attachments`}
                                        fileScope="order"
                                        initialFiles={trip.order.files}
                                        currentUserId={currentUserId}
                                        uploadKinds={[
                                            {
                                                value: 'delivery_proof',
                                                label: 'Подтверждение доставки',
                                            },
                                        ]}
                                    />
                                </div>
                            )}

                            {target && (
                                <button
                                    className="mt-5 w-full rounded-xl bg-[#e23333] px-4 py-3 font-semibold text-white disabled:opacity-50"
                                    disabled={!!busy}
                                    onClick={() => advance(trip)}
                                >
                                    {busy === `status-${trip.id}`
                                        ? 'Обновляем…'
                                        : `Перейти: ${statusLabel[target]}`}
                                </button>
                            )}

                            {trip.status !== 'completed' && (
                                <details className="mt-4">
                                    <summary className="cursor-pointer text-sm font-semibold text-[#e23333]">
                                        Сообщить об инциденте
                                    </summary>
                                    <form
                                        className="mt-3 flex flex-col gap-3"
                                        onSubmit={(event) =>
                                            incident(event, trip.id)
                                        }
                                    >
                                        <textarea
                                            className="rounded-xl border border-[#d1d1d1] p-3"
                                            name="text"
                                            rows={3}
                                            placeholder="Опишите проблему"
                                            required
                                        />
                                        <label className="text-sm">
                                            Новый срок, если изменился
                                            <input
                                                className="mt-1 w-full rounded-xl border border-[#d1d1d1] p-3"
                                                name="new_eta"
                                                type="date"
                                            />
                                        </label>
                                        <button
                                            className="rounded-xl border border-[#e23333] px-4 py-3 font-semibold text-[#e23333] disabled:opacity-50"
                                            disabled={!!busy}
                                        >
                                            {busy === `incident-${trip.id}`
                                                ? 'Отправляем…'
                                                : 'Отправить'}
                                        </button>
                                    </form>
                                </details>
                            )}
                        </article>
                    );
                })}
            </section>
        </main>
    );
}
