'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';

import {
    assignCargoOrderAction,
    createCargoDriverAction,
    createCargoOfferAction,
    createCargoVehicleAction,
    createDriverInviteAction,
    decideCargoRelationAction,
    rejectCargoOrderAction,
} from '@/actions/cargo';
import type { AdminCargoState } from '@/lib/cargo-contract';

const statusNames: Record<string, string> = {
    waiting: 'Ждет предложения',
    offer: 'Предложение отправлено',
    planned: 'Рейс назначен',
    transit: 'В пути',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
    rejected: 'Отклонен',
};

function Panel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="sp-panel">
            <h2>{title}</h2>
            {children}
        </section>
    );
}

export default function AdminCargoDashboard({
    state,
}: {
    state: AdminCargoState;
}) {
    const router = useRouter();
    const [busy, setBusy] = useState('');
    const [message, setMessage] = useState('');
    const [invite, setInvite] = useState('');

    async function run(
        key: string,
        operation: () => Promise<{ ok: boolean; error?: string }>
    ) {
        if (busy) return false;
        setBusy(key);
        setMessage('');
        const response = await operation();
        setBusy('');
        if (!response.ok) {
            setMessage(response.error ?? 'Не удалось выполнить действие');
            return false;
        }
        setMessage('Изменения сохранены.');
        router.refresh();
        return true;
    }

    async function addDriver(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const ok = await run('driver-new', () =>
            createCargoDriverAction({
                full_name: String(form.get('full_name') ?? ''),
                phone_number: String(form.get('phone_number') ?? '').replace(
                    /\D/g,
                    ''
                ),
                license_number: String(form.get('license_number') ?? ''),
                status: 'active',
            })
        );
        if (ok) event.currentTarget.reset();
    }

    async function addVehicle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const ok = await run('vehicle-new', () =>
            createCargoVehicleAction({
                model: String(form.get('model') ?? ''),
                plate_number: String(form.get('plate_number') ?? ''),
                trailer_number: String(form.get('trailer_number') ?? ''),
                kind: String(form.get('kind') ?? ''),
                capacity_tons: Number(form.get('capacity_tons')),
                status: 'active',
            })
        );
        if (ok) event.currentTarget.reset();
    }

    return (
        <main className="mx-auto min-h-screen max-w-7xl bg-[#f8f8f8] px-5 py-10 text-[#4a4a4a]">
            <header className="mb-8">
                <p className="sp-eyebrow">Jol Cargo · диспетчерская</p>
                <h1>{state.company.name}</h1>
                <p className="sp-muted">
                    {state.company.city} · {state.company.contactPhone}
                </p>
            </header>

            {message && (
                <p className="sp-alert" role="status">
                    {message}
                </p>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <Panel title={`Запросы клиентов · ${state.relations.length}`}>
                    <div className="space-y-3">
                        {state.relations.map((relation) => (
                            <article className="sp-list-row" key={relation.id}>
                                <strong>{relation.shipper.company}</strong>
                                <p className="sp-muted">
                                    {relation.shipper.name} ·{' '}
                                    {relation.shipper.city} ·{' '}
                                    {relation.shipper.phone}
                                </p>
                                <p className="sp-caption">{relation.status}</p>
                                {relation.status === 'requested' && (
                                    <div className="sp-actions">
                                        <button
                                            className="sp-button"
                                            disabled={!!busy}
                                            onClick={() =>
                                                run(
                                                    `relation-${relation.id}`,
                                                    () =>
                                                        decideCargoRelationAction(
                                                            {
                                                                relationId:
                                                                    relation.id,
                                                                decision:
                                                                    'confirm',
                                                                comment: '',
                                                            }
                                                        )
                                                )
                                            }
                                        >
                                            Подтвердить
                                        </button>
                                        <button
                                            className="sp-secondary"
                                            disabled={!!busy}
                                            onClick={() =>
                                                run(
                                                    `relation-${relation.id}`,
                                                    () =>
                                                        decideCargoRelationAction(
                                                            {
                                                                relationId:
                                                                    relation.id,
                                                                decision:
                                                                    'reject',
                                                                comment:
                                                                    'Запрос отклонен компанией',
                                                            }
                                                        )
                                                )
                                            }
                                        >
                                            Отклонить
                                        </button>
                                    </div>
                                )}
                            </article>
                        ))}
                        {!state.relations.length && (
                            <p className="sp-muted">Новых запросов нет.</p>
                        )}
                    </div>
                </Panel>

                <Panel title={`Рейсы · ${state.trips.length}`}>
                    {state.trips.map((trip) => (
                        <div className="sp-list-row" key={trip.id}>
                            <strong>{trip.orderId}</strong>
                            <p>
                                {trip.status} · доставка {trip.eta}
                            </p>
                        </div>
                    ))}
                    {!state.trips.length && (
                        <p className="sp-muted">Назначенных рейсов нет.</p>
                    )}
                </Panel>
            </div>

            <section className="mt-6">
                <h2 className="mb-4 text-2xl font-bold">
                    Заказы · {state.orders.length}
                </h2>
                <div className="grid gap-5 xl:grid-cols-2">
                    {state.orders.map((order) => {
                        const assigned = state.trips.some(
                            (trip) => trip.orderRecordId === order.recordId
                        );
                        return (
                            <article className="sp-panel" key={order.recordId}>
                                <p className="sp-eyebrow">
                                    {order.id} · {statusNames[order.status]}
                                </p>
                                <h3>
                                    {order.from} → {order.to}
                                </h3>
                                <p className="sp-muted">
                                    {order.shipper.company} · {order.cargo} ·{' '}
                                    {order.quantity} {order.unit}
                                </p>

                                {['waiting', 'offer'].includes(
                                    order.status
                                ) && (
                                    <form
                                        className="sp-form"
                                        onSubmit={async (event) => {
                                            event.preventDefault();
                                            const form = new FormData(
                                                event.currentTarget
                                            );
                                            await run(
                                                `offer-${order.recordId}`,
                                                () =>
                                                    createCargoOfferAction({
                                                        orderId: order.recordId,
                                                        kind: 'offer',
                                                        amount: String(
                                                            form.get(
                                                                'amount'
                                                            ) ?? ''
                                                        ),
                                                        eta: String(
                                                            form.get('eta') ??
                                                                ''
                                                        ),
                                                        routeText: `${order.from} - ${order.to}`,
                                                        reason: String(
                                                            form.get(
                                                                'reason'
                                                            ) ?? ''
                                                        ),
                                                    })
                                            );
                                        }}
                                    >
                                        <h4>Предложить перевозку</h4>
                                        <input
                                            name="amount"
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            placeholder="Стоимость, ₸"
                                            required
                                        />
                                        <input
                                            name="eta"
                                            type="date"
                                            required
                                        />
                                        <input
                                            name="reason"
                                            placeholder="Что входит в стоимость"
                                            required
                                        />
                                        <button
                                            className="sp-button"
                                            disabled={!!busy}
                                        >
                                            Отправить предложение
                                        </button>
                                    </form>
                                )}

                                {order.status === 'planned' && !assigned && (
                                    <form
                                        className="sp-form"
                                        onSubmit={async (event) => {
                                            event.preventDefault();
                                            const form = new FormData(
                                                event.currentTarget
                                            );
                                            await run(
                                                `assign-${order.recordId}`,
                                                () =>
                                                    assignCargoOrderAction({
                                                        orderId: order.recordId,
                                                        driverId: Number(
                                                            form.get(
                                                                'driver_id'
                                                            )
                                                        ),
                                                        vehicleId: Number(
                                                            form.get(
                                                                'vehicle_id'
                                                            )
                                                        ),
                                                        eta: String(
                                                            form.get('eta') ??
                                                                ''
                                                        ),
                                                    })
                                            );
                                        }}
                                    >
                                        <h4>Назначить рейс</h4>
                                        <select name="driver_id" required>
                                            <option value="">Водитель</option>
                                            {state.drivers
                                                .filter(
                                                    (driver) =>
                                                        driver.status ===
                                                            'active' &&
                                                        driver.account_status ===
                                                            'active'
                                                )
                                                .map((driver) => (
                                                    <option
                                                        key={driver.id}
                                                        value={driver.id}
                                                    >
                                                        {driver.full_name}
                                                    </option>
                                                ))}
                                        </select>
                                        <select name="vehicle_id" required>
                                            <option value="">Машина</option>
                                            {state.vehicles
                                                .filter(
                                                    (vehicle) =>
                                                        vehicle.status ===
                                                        'active'
                                                )
                                                .map((vehicle) => (
                                                    <option
                                                        key={vehicle.id}
                                                        value={vehicle.id}
                                                    >
                                                        {vehicle.model} ·{' '}
                                                        {vehicle.plate_number}
                                                    </option>
                                                ))}
                                        </select>
                                        <input
                                            name="eta"
                                            type="date"
                                            defaultValue={order.date}
                                            required
                                        />
                                        <button
                                            className="sp-button"
                                            disabled={!!busy}
                                        >
                                            Назначить
                                        </button>
                                    </form>
                                )}

                                {['planned', 'transit'].includes(
                                    order.status
                                ) && (
                                    <details className="mt-4">
                                        <summary>Добавить доплату</summary>
                                        <form
                                            className="sp-form"
                                            onSubmit={async (event) => {
                                                event.preventDefault();
                                                const form = new FormData(
                                                    event.currentTarget
                                                );
                                                await run(
                                                    `surcharge-${order.recordId}`,
                                                    () =>
                                                        createCargoOfferAction({
                                                            orderId:
                                                                order.recordId,
                                                            kind: 'surcharge',
                                                            amount: String(
                                                                form.get(
                                                                    'amount'
                                                                ) ?? ''
                                                            ),
                                                            eta: String(
                                                                form.get(
                                                                    'eta'
                                                                ) ?? ''
                                                            ),
                                                            routeText: '',
                                                            reason: String(
                                                                form.get(
                                                                    'reason'
                                                                ) ?? ''
                                                            ),
                                                        })
                                                );
                                            }}
                                        >
                                            <input
                                                name="amount"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                placeholder="Сумма, ₸"
                                                required
                                            />
                                            <input
                                                name="eta"
                                                type="date"
                                                defaultValue={order.date}
                                                required
                                            />
                                            <input
                                                name="reason"
                                                placeholder="Причина"
                                                required
                                            />
                                            <button
                                                className="sp-secondary"
                                                disabled={!!busy}
                                            >
                                                Отправить на согласование
                                            </button>
                                        </form>
                                    </details>
                                )}

                                {['waiting', 'offer'].includes(
                                    order.status
                                ) && (
                                    <button
                                        className="sp-link mt-4"
                                        disabled={!!busy}
                                        onClick={() =>
                                            run(
                                                `reject-${order.recordId}`,
                                                () =>
                                                    rejectCargoOrderAction({
                                                        orderId: order.recordId,
                                                        reason: 'Компания не может выполнить заказ',
                                                    })
                                            )
                                        }
                                    >
                                        Отклонить заказ
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Panel title={`Водители · ${state.drivers.length}`}>
                    {state.drivers.map((driver) => (
                        <div className="sp-list-row" key={driver.id}>
                            <strong>{driver.full_name}</strong>
                            <p className="sp-muted">
                                {driver.phone_number} · {driver.license_number}{' '}
                                · {driver.account_status}
                            </p>
                            <button
                                className="sp-link"
                                disabled={!!busy}
                                onClick={async () => {
                                    const response =
                                        await createDriverInviteAction(
                                            driver.id
                                        );
                                    if (response.ok) {
                                        setInvite(response.data.invite_token);
                                        setMessage(
                                            `Приглашение для ${driver.full_name} создано.`
                                        );
                                    } else {
                                        setMessage(response.error);
                                    }
                                }}
                            >
                                Создать приглашение
                            </button>
                        </div>
                    ))}
                    {invite && (
                        <p className="sp-alert wrap-anywhere">
                            Передайте водителю один раз:{' '}
                            <strong>{invite}</strong>
                        </p>
                    )}
                    <form className="sp-form" onSubmit={addDriver}>
                        <h3>Добавить водителя</h3>
                        <input name="full_name" placeholder="ФИО" required />
                        <input
                            name="phone_number"
                            placeholder="77010000000"
                            required
                        />
                        <input
                            name="license_number"
                            placeholder="Номер удостоверения"
                            required
                        />
                        <button className="sp-button" disabled={!!busy}>
                            Добавить
                        </button>
                    </form>
                </Panel>

                <Panel title={`Автопарк · ${state.vehicles.length}`}>
                    {state.vehicles.map((vehicle) => (
                        <div className="sp-list-row" key={vehicle.id}>
                            <strong>
                                {vehicle.model} · {vehicle.plate_number}
                            </strong>
                            <p className="sp-muted">
                                {vehicle.kind} · {vehicle.capacity_tons} т
                            </p>
                        </div>
                    ))}
                    <form className="sp-form" onSubmit={addVehicle}>
                        <h3>Добавить машину</h3>
                        <input name="model" placeholder="Модель" required />
                        <input
                            name="plate_number"
                            placeholder="Госномер"
                            required
                        />
                        <input
                            name="trailer_number"
                            placeholder="Номер прицепа"
                        />
                        <input name="kind" placeholder="Тип машины" required />
                        <input
                            name="capacity_tons"
                            type="number"
                            min="0.001"
                            step="0.001"
                            placeholder="Грузоподъемность, т"
                            required
                        />
                        <button className="sp-button" disabled={!!busy}>
                            Добавить
                        </button>
                    </form>
                </Panel>
            </div>
        </main>
    );
}
