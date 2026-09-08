'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Repeat2 } from 'lucide-react';
import { useStore } from '../_prototype/store';
import {
    Supply,
    occurrences,
    localDate,
    dateLabel,
    money,
} from '../_prototype/model';
import { Heading, Empty, Field } from '../_prototype/ui';
import SupplyForm, { week } from '../_prototype/supply-form';
export default function Supplies() {
    const { state, act } = useStore();
    const [editing, setEditing] = useState<Supply | 'new' | null>(null);
    const [launch, setLaunch] = useState<{
        supply: Supply;
        date: string;
    } | null>(null);
    function create(s: Supply, date: string) {
        const id = `JL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const arrival = new Date(date + 'T12:00:00');
        arrival.setDate(arrival.getDate() + 2);
        if (
            act({
                type: 'create',
                order: {
                    id,
                    companyId: s.companyId,
                    from: s.from,
                    to: s.to,
                    cargo: s.cargo,
                    quantity: s.quantity,
                    unit: s.unit,
                    pickup: date,
                    date: localDate(arrival),
                    status: s.approved ? 'planned' : 'waiting',
                    comment: `Поставка «${s.title}»`,
                    stages: [],
                    files: [],
                    issues: [],
                    updated: new Date().toISOString(),
                    supplyId: s.id,
                    occurrence: date,
                    agreedPrice: s.approved ? s.price : undefined,
                    invoice: s.approved
                        ? { number: `СЧ-${id}`, amount: s.price, paid: false }
                        : undefined,
                },
            })
        )
            setLaunch(null);
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
                Сохраните условия один раз. Повторяйте доставку, когда она
                нужна.
            </Heading>
            {editing && (
                <SupplyForm
                    key={typeof editing === 'string' ? 'new' : editing.id}
                    initial={editing === 'new' ? undefined : editing}
                    close={() => setEditing(null)}
                />
            )}
            {launch && (
                <form
                    className="sp-panel sp-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        create(launch.supply, launch.date);
                    }}
                >
                    <h2>Отправление · {launch.supply.title}</h2>
                    <Field label="Дата забора груза">
                        <input
                            autoFocus
                            type="date"
                            required
                            min={localDate()}
                            value={launch.date}
                            onChange={(e) =>
                                setLaunch({ ...launch, date: e.target.value })
                            }
                        />
                    </Field>
                    <p className="sp-caption">
                        Для демонстрации срок доставки — 2 дня.{' '}
                        {launch.supply.approved
                            ? 'Используются согласованные условия.'
                            : 'Компания сначала подготовит предложение.'}
                    </p>
                    <div className="sp-actions">
                        <button className="sp-button">Создать заказ</button>
                        <button
                            type="button"
                            className="sp-secondary"
                            onClick={() => setLaunch(null)}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}
            {!state.supplies.length && (
                <Empty>
                    <Repeat2 />
                    Сохранённых поставок пока нет.
                </Empty>
            )}
            {state.supplies.map((s) => {
                const dates = occurrences(s);
                const linked = state.orders.filter((o) => o.supplyId === s.id);
                return (
                    <section className="sp-list-row" key={s.id}>
                        <div className="sp-row-head">
                            <div>
                                <h2>{s.title}</h2>
                                <p className="sp-muted">
                                    {s.from} → {s.to}
                                </p>
                                <p className="sp-caption">
                                    {
                                        state.companies.find(
                                            (c) => c.id === s.companyId
                                        )?.name
                                    }{' '}
                                    · {s.quantity} {s.unit} · {s.cargo}
                                </p>
                            </div>
                            <button
                                className="sp-secondary"
                                onClick={() => setEditing(s)}
                            >
                                Настроить
                            </button>
                        </div>
                        <div className="sp-pills">
                            <span>
                                {s.mode === 'manual'
                                    ? 'По потребности'
                                    : s.mode === 'weekly'
                                      ? s.weekdays
                                            .map((d) => week[d])
                                            .join(', ')
                                      : `${s.monthDay}-го числа / последний день`}
                            </span>
                            <span>
                                {s.approved
                                    ? `${money(s.price)} · условия согласованы`
                                    : 'Условия ожидают согласования'}
                            </span>
                            {s.mode !== 'manual' && (
                                <span>
                                    {s.automatic
                                        ? 'Автоматический запуск'
                                        : 'С вашим подтверждением'}
                                </span>
                            )}
                            {s.paused && <span>Приостановлена</span>}
                        </div>
                        {dates.length > 0 && (
                            <div>
                                <p className="sp-caption">
                                    Ближайшие отправления
                                </p>
                                <div className="sp-pills">
                                    {dates.map((d) => {
                                        const order = linked.find(
                                            (o) => o.occurrence === d
                                        );
                                        return (
                                            <span key={d}>
                                                {dateLabel(d)}
                                                {order ? (
                                                    <>
                                                        {' '}
                                                        ·{' '}
                                                        <Link
                                                            className="sp-link"
                                                            href={`/shipper/orders/${order.id}`}
                                                        >
                                                            {order.id}
                                                        </Link>
                                                    </>
                                                ) : (
                                                    ' · запланировано'
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div className="sp-actions">
                            {s.mode === 'manual' ? (
                                <button
                                    className="sp-button"
                                    onClick={() =>
                                        setLaunch({
                                            supply: s,
                                            date: localDate(),
                                        })
                                    }
                                >
                                    Заказать доставку
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="sp-secondary"
                                        onClick={() =>
                                            act({
                                                type: 'supply',
                                                supply: {
                                                    ...s,
                                                    paused: !s.paused,
                                                },
                                            })
                                        }
                                    >
                                        {s.paused
                                            ? 'Возобновить'
                                            : 'Приостановить'}
                                    </button>
                                    {!s.paused &&
                                        dates[0] &&
                                        !linked.some(
                                            (o) => o.occurrence === dates[0]
                                        ) && (
                                            <>
                                                <button
                                                    className="sp-button"
                                                    onClick={() =>
                                                        create(s, dates[0])
                                                    }
                                                >
                                                    {s.automatic
                                                        ? 'Создать ближайшую · демо'
                                                        : 'Подтвердить ближайшую'}
                                                </button>
                                                <button
                                                    className="sp-secondary"
                                                    onClick={() =>
                                                        act({
                                                            type: 'supply',
                                                            supply: {
                                                                ...s,
                                                                skipped: [
                                                                    ...s.skipped,
                                                                    dates[0],
                                                                ],
                                                            },
                                                        })
                                                    }
                                                >
                                                    Пропустить{' '}
                                                    {dateLabel(dates[0])}
                                                </button>
                                            </>
                                        )}
                                </>
                            )}
                        </div>
                        {linked.length > 0 && (
                            <p className="sp-caption">
                                Заказы этой поставки:{' '}
                                {linked.map((o) => (
                                    <Link
                                        key={o.id}
                                        className="sp-link"
                                        style={{ marginRight: 12 }}
                                        href={`/shipper/orders/${o.id}`}
                                    >
                                        {o.id}
                                    </Link>
                                ))}
                            </p>
                        )}
                        {s.skipped.length > 0 && (
                            <p className="sp-caption">
                                Пропущены: {s.skipped.map(dateLabel).join(', ')}
                            </p>
                        )}
                    </section>
                );
            })}
            <p className="sp-caption">
                В прототипе расписание показывает будущие даты. Автоматическая
                отправка при закрытом кабинете появится с подключением сервера.
            </p>
        </>
    );
}
