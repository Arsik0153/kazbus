'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../_prototype/store';
import { reserved } from '../_prototype/model';
import { Heading, Empty } from '../_prototype/ui';
export default function Storage() {
    const { state } = useStore();
    const [search, setSearch] = useState('');
    const [company, setCompany] = useState('');
    const batches = state.batches.filter(
        (b) =>
            `${b.cargo} ${b.warehouse} ${b.id}`
                .toLowerCase()
                .includes(search.toLowerCase()) &&
            (!company || b.companyId === company)
    );
    return (
        <>
            <Heading eyebrow="Ваш груз на складе" title="На хранении">
                Выберите нужное количество — компания организует доставку до
                магазина.
            </Heading>
            <div className="sp-toolbar">
                <input
                    aria-label="Поиск по складу или грузу"
                    placeholder="Груз, склад или номер партии"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    aria-label="Компания склада"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                >
                    <option value="">Все компании</option>
                    {state.companies
                        .filter((c) => c.relation === 'confirmed')
                        .map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
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
                        {batches.map((b) => {
                            const r = reserved(state, b);
                            return (
                                <tr key={b.id}>
                                    <td>
                                        <strong>{b.cargo}</strong>
                                        <small>
                                            {b.warehouse} ·{' '}
                                            {
                                                state.companies.find(
                                                    (c) => c.id === b.companyId
                                                )?.name
                                            }
                                        </small>
                                        <small>
                                            Партия {b.id} · {b.source}
                                        </small>
                                    </td>
                                    <td>
                                        <span className="sp-mobile-label">
                                            На хранении
                                        </span>
                                        {b.onHand} {b.unit}
                                    </td>
                                    <td>
                                        <span className="sp-mobile-label">
                                            В резерве
                                        </span>
                                        {r} {b.unit}
                                    </td>
                                    <td>
                                        <span className="sp-mobile-label">
                                            Доступно
                                        </span>
                                        <strong>
                                            {b.onHand - r} {b.unit}
                                        </strong>
                                    </td>
                                    <td>
                                        {b.onHand > r ? (
                                            <Link
                                                className="sp-secondary"
                                                href={`/shipper/create-order?batch=${b.id}`}
                                            >
                                                Отправить часть
                                            </Link>
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
            <p className="sp-caption">
                Резерв учитывает открытые заявки. После отмены заявки количество
                снова доступно. Данные приёмки подтверждает логистическая
                компания.
            </p>
            <section className="sp-section" style={{ marginTop: 32 }}>
                <h2>Отправки со склада</h2>
                {state.orders
                    .filter((o) => o.batchId)
                    .map((o) => (
                        <div className="sp-list-row" key={o.id}>
                            <Link
                                className="sp-link"
                                href={`/shipper/orders/${o.id}`}
                            >
                                {o.id} → {o.to}
                            </Link>
                            <p>
                                {o.quantity} {o.unit} · партия {o.batchId}
                            </p>
                        </div>
                    ))}
            </section>
        </>
    );
}
