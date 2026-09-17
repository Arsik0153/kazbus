'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';

import {
    assignCargoOrderAction,
    cargoLogoutAction,
    createCargoDriverAction,
    createCargoOfferAction,
    createCargoStockAction,
    createCargoVehicleAction,
    createCargoWarehouseAction,
    createDriverInviteAction,
    decideCargoRelationAction,
    adjustCargoStockAction,
    rejectCargoOrderAction,
    updateCargoCompanyAction,
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

const relationStatusNames: Record<string, string> = {
    requested: 'Ожидает решения',
    confirmed: 'Сотрудничество подтверждено',
    rejected: 'Запрос отклонен',
    blocked: 'Клиент заблокирован',
};

const tripStatusNames: Record<string, string> = {
    planned: 'Запланирован',
    loading: 'Погрузка',
    in_transit: 'В пути',
    unloading: 'Разгрузка',
    completed: 'Завершен',
};

const driverAccountStatusNames: Record<string, string> = {
    active: 'Аккаунт активен',
    pending: 'Ожидает регистрации',
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
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
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
        if (ok) formElement.reset();
    }

    async function addVehicle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
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
        if (ok) formElement.reset();
    }

    async function addWarehouse(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const ok = await run('warehouse-new', () =>
            createCargoWarehouseAction({
                name: String(form.get('name') ?? ''),
                address: String(form.get('address') ?? ''),
            })
        );
        if (ok) formElement.reset();
    }

    async function addStock(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const ok = await run('stock-new', () =>
            createCargoStockAction({
                warehouseId: Number(form.get('warehouse_id')),
                shipperId: Number(form.get('shipper_id')),
                cargo: String(form.get('cargo') ?? ''),
                sku: String(form.get('sku') ?? ''),
                unit: String(form.get('unit') ?? '') as
                    'шт.' | 'коробок' | 'паллет' | 'кг' | 'т',
                onHand: Number(form.get('on_hand')),
                source: String(form.get('source') ?? ''),
            })
        );
        if (ok) formElement.reset();
    }

    return (
        <main className="mx-auto min-h-screen max-w-7xl bg-[#f8f8f8] px-5 py-10 text-[#4a4a4a]">
            <header className="mb-8">
                <p className="sp-eyebrow">Jol Cargo · диспетчерская</p>
                <h1>{state.company.name}</h1>
                <p className="sp-muted">
                    {state.company.city} · {state.company.contactPhone}
                </p>
                <nav className="sp-actions" aria-label="Разделы диспетчерской">
                    <a className="sp-secondary" href="#orders">
                        Заказы
                    </a>
                    <a className="sp-secondary" href="#warehouse-stock">
                        Складской учет
                    </a>
                    <button
                        className="sp-link"
                        type="button"
                        onClick={async () => {
                            await cargoLogoutAction();
                            router.replace('/admin-cargo/login');
                            router.refresh();
                        }}
                    >
                        Выйти
                    </button>
                </nav>
            </header>

            {message && (
                <p className="sp-alert" role="status">
                    {message}
                </p>
            )}

            <details className="sp-panel mb-6">
                <summary className="cursor-pointer text-lg font-bold">
                    Профиль и публикация компании
                </summary>
                <form
                    className="sp-form mt-4 space-y-3"
                    onSubmit={async (event) => {
                        event.preventDefault();
                        const form = new FormData(event.currentTarget);
                        await run('company-profile', () =>
                            updateCargoCompanyAction({
                                name: String(form.get('name') ?? ''),
                                city: String(form.get('city') ?? ''),
                                contactPhone: String(
                                    form.get('contact_phone') ?? ''
                                ),
                                email: String(form.get('email') ?? ''),
                                description: String(
                                    form.get('description') ?? ''
                                ),
                                isSearchable:
                                    form.get('is_searchable') === 'on',
                            })
                        );
                    }}
                >
                    <input
                        name="name"
                        aria-label="Название компании"
                        defaultValue={state.company.name}
                        placeholder="Название"
                        required
                    />
                    <input
                        name="city"
                        aria-label="Город компании"
                        defaultValue={state.company.city}
                        placeholder="Город"
                        required
                    />
                    <input
                        name="contact_phone"
                        aria-label="Контактный телефон компании"
                        type="tel"
                        defaultValue={state.company.contactPhone}
                        placeholder="Контактный телефон"
                        required
                    />
                    <input
                        name="email"
                        aria-label="Email компании"
                        type="email"
                        defaultValue={state.company.email}
                        placeholder="Email"
                    />
                    <textarea
                        name="description"
                        aria-label="Описание услуг компании"
                        defaultValue={state.company.description}
                        placeholder="Описание услуг"
                        rows={3}
                    />
                    <label className="sp-check">
                        <input
                            name="is_searchable"
                            aria-label="Показывать компанию грузоотправителям"
                            type="checkbox"
                            defaultChecked={state.company.isSearchable}
                        />
                        Показывать компанию грузоотправителям
                    </label>
                    <p className="sp-caption">
                        Пока профиль скрыт, новые клиенты не смогут отправить
                        запрос на сотрудничество.
                    </p>
                    <button className="sp-button" disabled={!!busy}>
                        {busy === 'company-profile'
                            ? 'Сохраняем…'
                            : 'Сохранить профиль'}
                    </button>
                </form>
            </details>

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
                                <p className="sp-caption">
                                    {relationStatusNames[relation.status]}
                                </p>
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
                                {tripStatusNames[trip.status]} · доставка{' '}
                                {trip.eta}
                            </p>
                        </div>
                    ))}
                    {!state.trips.length && (
                        <p className="sp-muted">Назначенных рейсов нет.</p>
                    )}
                </Panel>
            </div>

            <section className="mt-6" id="orders">
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
                                    {order.id} ·{' '}
                                    {order.status === 'planned'
                                        ? assigned
                                            ? 'Рейс назначен'
                                            : 'Согласован'
                                        : statusNames[order.status]}
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
                                        className="sp-form space-y-3"
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
                                        className="sp-form space-y-3"
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
                                            className="sp-form space-y-3"
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
                                ·{' '}
                                {
                                    driverAccountStatusNames[
                                        driver.account_status
                                    ]
                                }
                            </p>
                            {driver.account_status === 'pending' && (
                                <button
                                    className="sp-link"
                                    disabled={!!busy}
                                    onClick={async () => {
                                        const response =
                                            await createDriverInviteAction(
                                                driver.id
                                            );
                                        if (response.ok) {
                                            setInvite(
                                                response.data.invite_token
                                            );
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
                            )}
                        </div>
                    ))}
                    {invite && (
                        <p className="sp-alert wrap-anywhere">
                            Передайте водителю один раз:{' '}
                            <strong>{invite}</strong>
                        </p>
                    )}
                    <form className="sp-form space-y-3" onSubmit={addDriver}>
                        <h3>Добавить водителя</h3>
                        <input
                            name="full_name"
                            aria-label="ФИО водителя"
                            placeholder="ФИО"
                            required
                        />
                        <input
                            name="phone_number"
                            aria-label="Телефон водителя"
                            placeholder="77010000000"
                            required
                        />
                        <input
                            name="license_number"
                            aria-label="Номер удостоверения водителя"
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
                    <form className="sp-form space-y-3" onSubmit={addVehicle}>
                        <h3>Добавить машину</h3>
                        <input
                            name="model"
                            aria-label="Модель машины"
                            placeholder="Модель"
                            required
                        />
                        <input
                            name="plate_number"
                            aria-label="Государственный номер машины"
                            placeholder="Госномер"
                            required
                        />
                        <input
                            name="trailer_number"
                            aria-label="Номер прицепа"
                            placeholder="Номер прицепа"
                        />
                        <input
                            name="kind"
                            aria-label="Тип машины"
                            placeholder="Тип машины"
                            required
                        />
                        <input
                            name="capacity_tons"
                            aria-label="Грузоподъемность в тоннах"
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

            <div
                className="mt-6 grid gap-6 lg:grid-cols-2"
                id="warehouse-stock"
            >
                <Panel title={`Склады · ${state.warehouses.length}`}>
                    {state.warehouses.map((warehouse) => (
                        <div className="sp-list-row" key={warehouse.id}>
                            <strong>{warehouse.name}</strong>
                            <p className="sp-muted">{warehouse.address}</p>
                        </div>
                    ))}
                    {!state.warehouses.length && (
                        <p className="sp-muted">Склады еще не добавлены.</p>
                    )}
                    <form className="sp-form space-y-3" onSubmit={addWarehouse}>
                        <h3>Добавить склад</h3>
                        <input
                            name="name"
                            aria-label="Название склада"
                            placeholder="Название"
                            required
                        />
                        <input
                            name="address"
                            aria-label="Адрес склада"
                            placeholder="Город, улица, номер"
                            required
                        />
                        <button className="sp-button" disabled={!!busy}>
                            {busy === 'warehouse-new'
                                ? 'Сохраняем…'
                                : 'Добавить склад'}
                        </button>
                    </form>
                </Panel>

                <Panel title={`Остатки · ${state.stock.length}`}>
                    {state.stock.map((lot) => {
                        const shipper = state.relations.find(
                            (relation) => relation.shipper.id === lot.shipper_id
                        )?.shipper;
                        return (
                            <article className="sp-list-row" key={lot.id}>
                                <strong>
                                    {lot.cargo_description} · {lot.on_hand}{' '}
                                    {lot.unit}
                                </strong>
                                <p className="sp-muted">
                                    {lot.warehouse} ·{' '}
                                    {shipper?.company ??
                                        `Клиент #${lot.shipper_id}`}
                                </p>
                                <p className="sp-caption">
                                    {lot.sku || 'Без SKU'} · {lot.source}
                                </p>
                                <form
                                    className="sp-form space-y-3"
                                    onSubmit={async (event) => {
                                        event.preventDefault();
                                        const formElement = event.currentTarget;
                                        const form = new FormData(formElement);
                                        const ok = await run(
                                            `stock-adjust-${lot.id}`,
                                            () =>
                                                adjustCargoStockAction({
                                                    lotId: lot.id,
                                                    delta: Number(
                                                        form.get('delta')
                                                    ),
                                                    reason: String(
                                                        form.get('reason') ?? ''
                                                    ),
                                                })
                                        );
                                        if (ok) formElement.reset();
                                    }}
                                >
                                    <h4>Корректировка</h4>
                                    <input
                                        name="delta"
                                        aria-label={`Изменение остатка ${lot.cargo_description}`}
                                        type="number"
                                        step="0.001"
                                        placeholder="+25 или -5"
                                        required
                                    />
                                    <input
                                        name="reason"
                                        aria-label={`Причина корректировки ${lot.cargo_description}`}
                                        placeholder="Приемка, инвентаризация…"
                                        required
                                    />
                                    <button
                                        className="sp-secondary"
                                        disabled={!!busy}
                                    >
                                        {busy === `stock-adjust-${lot.id}`
                                            ? 'Сохраняем…'
                                            : 'Изменить остаток'}
                                    </button>
                                </form>
                            </article>
                        );
                    })}
                    {!state.stock.length && (
                        <p className="sp-muted">Складских партий еще нет.</p>
                    )}
                    <form className="sp-form space-y-3" onSubmit={addStock}>
                        <h3>Принять груз на склад</h3>
                        <select
                            name="warehouse_id"
                            aria-label="Склад"
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>
                                Выберите склад
                            </option>
                            {state.warehouses.map((warehouse) => (
                                <option key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="shipper_id"
                            aria-label="Клиент"
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>
                                Выберите клиента
                            </option>
                            {state.relations
                                .filter(
                                    (relation) =>
                                        relation.status === 'confirmed'
                                )
                                .map((relation) => (
                                    <option
                                        key={relation.shipper.id}
                                        value={relation.shipper.id}
                                    >
                                        {relation.shipper.company}
                                    </option>
                                ))}
                        </select>
                        <input
                            name="cargo"
                            aria-label="Описание груза"
                            placeholder="Груз"
                            required
                        />
                        <input
                            name="sku"
                            aria-label="SKU груза"
                            placeholder="SKU"
                        />
                        <select name="unit" aria-label="Единица измерения">
                            {['шт.', 'коробок', 'паллет', 'кг', 'т'].map(
                                (unit) => (
                                    <option key={unit}>{unit}</option>
                                )
                            )}
                        </select>
                        <input
                            name="on_hand"
                            aria-label="Количество на складе"
                            type="number"
                            min="0"
                            step="0.001"
                            placeholder="Количество"
                            required
                        />
                        <input
                            name="source"
                            aria-label="Источник поступления"
                            placeholder="Приемка, накладная…"
                            required
                        />
                        <button
                            className="sp-button"
                            disabled={
                                !!busy ||
                                !state.warehouses.length ||
                                !state.relations.some(
                                    (relation) =>
                                        relation.status === 'confirmed'
                                )
                            }
                        >
                            {busy === 'stock-new'
                                ? 'Сохраняем…'
                                : 'Добавить партию'}
                        </button>
                    </form>
                </Panel>
            </div>
        </main>
    );
}
