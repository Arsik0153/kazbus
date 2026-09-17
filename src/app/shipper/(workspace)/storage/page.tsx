'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';

import { localDate, reserved, type Batch } from '../../_prototype/model';
import { useStore } from '../../_prototype/store';
import { Empty, Field, Heading } from '../../_prototype/ui';

function StockOrderForm({ batch, close }: { batch: Batch; close: () => void }) {
    const { state, act } = useStore();
    const requestId = useRef(crypto.randomUUID());
    const [to, setTo] = useState('');
    const [pickup, setPickup] = useState(localDate());
    const [date, setDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const available = batch.onHand - reserved(state, batch);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        if (date < pickup) {
            setError('Дата доставки не может быть раньше даты забора.');
            return;
        }
        if (Number(quantity) > available) {
            setError('Количество превышает доступный остаток.');
            return;
        }

        setBusy(true);
        const saved = await act({
            type: 'create-stock-order',
            requestId: requestId.current,
            lotId: batch.id,
            to,
            pickup,
            date,
            quantity: Number(quantity),
            comment,
        });
        setBusy(false);
        if (saved) close();
    }

    return (
        <form className="sp-panel sp-form" onSubmit={submit}>
            <h2>Отправить со склада · {batch.cargo}</h2>
            <p className="sp-muted">
                {batch.warehouse} · доступно {available} {batch.unit}
            </p>
            <div className="sp-form-grid">
                <Field label="Куда доставить">
                    <input
                        required
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                        placeholder="Город, улица, получатель"
                    />
                </Field>
                <Field label="Количество">
                    <input
                        required
                        type="number"
                        min="0.001"
                        max={available}
                        step="0.001"
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                    />
                </Field>
                <Field label="Дата забора">
                    <input
                        required
                        type="date"
                        min={localDate()}
                        value={pickup}
                        onChange={(event) => setPickup(event.target.value)}
                    />
                </Field>
                <Field label="Дата доставки">
                    <input
                        required
                        type="date"
                        min={pickup}
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                    />
                </Field>
                <div className="sp-field-wide">
                    <Field label="Комментарий">
                        <textarea
                            rows={3}
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                        />
                    </Field>
                </div>
            </div>
            {error && (
                <p className="sp-error" role="alert">
                    {error}
                </p>
            )}
            <div className="sp-actions">
                <button className="sp-button" disabled={busy}>
                    {busy ? 'Создаем…' : 'Создать заказ'}
                </button>
                <button type="button" className="sp-secondary" onClick={close}>
                    Отмена
                </button>
            </div>
        </form>
    );
}

export default function StoragePage() {
    const { state, message } = useStore();
    const [search, setSearch] = useState('');
    const [company, setCompany] = useState('');
    const [selected, setSelected] = useState<Batch | null>(null);
    const batches = state.batches.filter(
        (batch) =>
            `${batch.cargo} ${batch.warehouse} ${batch.id}`
                .toLowerCase()
                .includes(search.toLowerCase()) &&
            (!company || batch.companyId === company)
    );

    return (
        <>
            <Heading eyebrow="Ваш груз на складе" title="На хранении">
                Выберите партию и нужное количество для доставки.
            </Heading>
            {message && (
                <p className="sp-alert" role="status">
                    {message}
                </p>
            )}
            {selected && (
                <StockOrderForm
                    key={selected.id}
                    batch={selected}
                    close={() => setSelected(null)}
                />
            )}
            <div className="sp-toolbar">
                <input
                    aria-label="Поиск по складу или грузу"
                    placeholder="Груз, склад или номер партии"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
                <select
                    aria-label="Компания склада"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                >
                    <option value="">Все компании</option>
                    {state.companies
                        .filter((item) => item.relation === 'confirmed')
                        .map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                </select>
            </div>
            {!batches.length ? (
                <Empty>Груза по выбранным условиям нет.</Empty>
            ) : (
                <table className="sp-table">
                    <thead>
                        <tr>
                            <th>ГРУЗ / СКЛАД</th>
                            <th>НА ХРАНЕНИИ</th>
                            <th>В РЕЗЕРВЕ</th>
                            <th>ДОСТУПНО</th>
                            <th>ДЕЙСТВИЕ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batches.map((batch) => {
                            const held = reserved(state, batch);
                            return (
                                <tr key={batch.id}>
                                    <td>
                                        <strong>{batch.cargo}</strong>
                                        <small>
                                            {batch.warehouse} · партия{' '}
                                            {batch.id}
                                        </small>
                                        <small>{batch.source}</small>
                                    </td>
                                    <td>
                                        {batch.onHand} {batch.unit}
                                    </td>
                                    <td>
                                        {held} {batch.unit}
                                    </td>
                                    <td>
                                        <strong>
                                            {batch.onHand - held} {batch.unit}
                                        </strong>
                                    </td>
                                    <td>
                                        {batch.onHand > held ? (
                                            <button
                                                className="sp-secondary"
                                                onClick={() =>
                                                    setSelected(batch)
                                                }
                                            >
                                                Отправить часть
                                            </button>
                                        ) : (
                                            <span className="sp-muted">
                                                Весь груз в резерве
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <section className="sp-section" style={{ marginTop: 32 }}>
                <h2>Отправки со склада</h2>
                {state.orders
                    .filter((order) => order.batchId)
                    .map((order) => (
                        <div className="sp-list-row" key={order.id}>
                            <Link
                                className="sp-link"
                                href={`/shipper/orders/${order.id}`}
                            >
                                {order.id} → {order.to}
                            </Link>
                            <p>
                                {order.quantity} {order.unit} · партия{' '}
                                {order.batchId}
                            </p>
                        </div>
                    ))}
            </section>
        </>
    );
}
