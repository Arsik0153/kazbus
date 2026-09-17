'use client';

import Link from 'next/link';
import { Plus, Repeat2 } from 'lucide-react';
import { useState } from 'react';

import {
    dateLabel,
    localDate,
    occurrences,
    type Supply,
} from '../../_prototype/model';
import SupplyForm, { week } from '../../_prototype/supply-form';
import { useStore } from '../../_prototype/store';
import { Empty, Field, Heading } from '../../_prototype/ui';

export default function SuppliesPage() {
    const { state, act, message } = useStore();
    const [editing, setEditing] = useState<Supply | 'new' | null>(null);
    const [manualLaunch, setManualLaunch] = useState<{
        supply: Supply;
        date: string;
    } | null>(null);
    const [busy, setBusy] = useState('');

    async function launch(supply: Supply, date: string) {
        setBusy(`launch-${supply.id}`);
        const saved = await act({
            type: 'launch-supply',
            id: supply.id,
            date,
        });
        setBusy('');
        if (saved) setManualLaunch(null);
    }

    return (
        <>
            <Heading
                eyebrow="Регулярные отправления"
                title="Поставки"
                action={
                    <button
                        className="sp-button"
                        onClick={() => setEditing('new')}
                    >
                        <Plus size={18} />
                        Новая поставка
                    </button>
                }
            >
                {state.capabilities.supplyAutomaticEnabled
                    ? 'Сохраните маршрут и расписание, затем выберите ручной или автоматический запуск.'
                    : 'Сохраните маршрут и расписание, затем подтверждайте каждое отправление.'}
            </Heading>

            {message && (
                <p className="sp-alert" role="status">
                    {message}
                </p>
            )}

            {editing && (
                <SupplyForm
                    key={editing === 'new' ? 'new' : editing.id}
                    initial={editing === 'new' ? undefined : editing}
                    close={() => setEditing(null)}
                />
            )}

            {manualLaunch && (
                <form
                    className="sp-panel sp-form"
                    onSubmit={async (event) => {
                        event.preventDefault();
                        await launch(manualLaunch.supply, manualLaunch.date);
                    }}
                >
                    <h2>Отправление · {manualLaunch.supply.title}</h2>
                    <Field label="Дата отправления">
                        <input
                            type="date"
                            min={localDate()}
                            required
                            value={manualLaunch.date}
                            onChange={(event) =>
                                setManualLaunch({
                                    ...manualLaunch,
                                    date: event.target.value,
                                })
                            }
                        />
                    </Field>
                    <p className="sp-caption">
                        После запуска компания получит обычный заказ и предложит
                        стоимость.
                    </p>
                    <div className="sp-actions">
                        <button className="sp-button" disabled={!!busy}>
                            {busy ? 'Создаем…' : 'Создать заказ'}
                        </button>
                        <button
                            type="button"
                            className="sp-secondary"
                            onClick={() => setManualLaunch(null)}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}

            {!state.supplies.length && (
                <Empty>
                    <Repeat2 />
                    Сохраненных поставок пока нет.
                </Empty>
            )}

            {state.supplies.map((supply) => {
                const dates = occurrences(supply);
                const linked = state.orders.filter(
                    (order) => order.supplyId === supply.id
                );
                const nextDate = dates[0];
                const nextOrder = linked.find(
                    (order) => order.occurrence === nextDate
                );

                return (
                    <section className="sp-list-row" key={supply.id}>
                        <div className="sp-row-head">
                            <div>
                                <h2>{supply.title}</h2>
                                <p className="sp-muted">
                                    {supply.from} → {supply.to}
                                </p>
                                <p className="sp-caption">
                                    {
                                        state.companies.find(
                                            (company) =>
                                                company.id === supply.companyId
                                        )?.name
                                    }{' '}
                                    · {supply.quantity} {supply.unit} ·{' '}
                                    {supply.cargo}
                                </p>
                            </div>
                            <button
                                className="sp-secondary"
                                onClick={() => setEditing(supply)}
                            >
                                Настроить
                            </button>
                        </div>

                        <div className="sp-pills">
                            <span>
                                {supply.mode === 'manual'
                                    ? 'По потребности'
                                    : supply.mode === 'weekly'
                                      ? supply.weekdays
                                            .map((day) => week[day])
                                            .join(', ')
                                      : `${supply.monthDay}-го числа`}
                            </span>
                            {supply.automatic && (
                                <span>
                                    {state.capabilities.supplyAutomaticEnabled
                                        ? 'Автозапуск'
                                        : 'Автозапуск отключён'}
                                </span>
                            )}
                            {supply.paused && <span>Приостановлена</span>}
                        </div>

                        {dates.length > 0 && (
                            <div>
                                <p className="sp-caption">Ближайшие даты</p>
                                <div className="sp-pills">
                                    {dates.map((date) => {
                                        const order = linked.find(
                                            (item) => item.occurrence === date
                                        );
                                        return (
                                            <span key={date}>
                                                {dateLabel(date)}
                                                {order && (
                                                    <>
                                                        {' · '}
                                                        <Link
                                                            className="sp-link"
                                                            href={`/shipper/orders/${order.id}`}
                                                        >
                                                            {order.id}
                                                        </Link>
                                                    </>
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="sp-actions">
                            <button
                                className="sp-secondary"
                                disabled={!!busy}
                                onClick={async () => {
                                    setBusy(`toggle-${supply.id}`);
                                    await act({
                                        type: 'toggle-supply',
                                        id: supply.id,
                                        paused: !supply.paused,
                                    });
                                    setBusy('');
                                }}
                            >
                                {supply.paused
                                    ? 'Возобновить'
                                    : 'Приостановить'}
                            </button>
                            {supply.mode === 'manual' && !supply.paused ? (
                                <button
                                    className="sp-button"
                                    disabled={!!busy}
                                    onClick={() =>
                                        setManualLaunch({
                                            supply,
                                            date: localDate(),
                                        })
                                    }
                                >
                                    Создать отправление
                                </button>
                            ) : supply.mode !== 'manual' ? (
                                <>
                                    {!supply.paused &&
                                        nextDate &&
                                        !nextOrder && (
                                            <>
                                                <button
                                                    className="sp-button"
                                                    disabled={!!busy}
                                                    onClick={() =>
                                                        launch(supply, nextDate)
                                                    }
                                                >
                                                    Подтвердить{' '}
                                                    {dateLabel(nextDate)}
                                                </button>
                                                <button
                                                    className="sp-secondary"
                                                    disabled={!!busy}
                                                    onClick={async () => {
                                                        setBusy(
                                                            `skip-${supply.id}`
                                                        );
                                                        await act({
                                                            type: 'skip-supply',
                                                            id: supply.id,
                                                            date: nextDate,
                                                        });
                                                        setBusy('');
                                                    }}
                                                >
                                                    Пропустить дату
                                                </button>
                                            </>
                                        )}
                                </>
                            ) : null}
                        </div>

                        {linked.length > 0 && (
                            <p className="sp-caption">
                                Заказы:{' '}
                                {linked.map((order) => (
                                    <Link
                                        key={order.id}
                                        className="sp-link"
                                        style={{ marginRight: 12 }}
                                        href={`/shipper/orders/${order.id}`}
                                    >
                                        {order.id}
                                    </Link>
                                ))}
                            </p>
                        )}
                        {supply.skipped.length > 0 && (
                            <p className="sp-caption">
                                Пропущены:{' '}
                                {supply.skipped.map(dateLabel).join(', ')}
                            </p>
                        )}
                    </section>
                );
            })}
        </>
    );
}
