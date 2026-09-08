'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Plus, Package } from 'lucide-react';
import { useStore } from './store';
import { statuses, dateLabel, money } from './model';
import { Heading, Status, Empty } from './ui';
export default function Orders() {
    const { state } = useStore();
    const [search, setSearch] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState('');
    const [attentionOnly, setAttentionOnly] = useState(false);
    const needs = (o: (typeof state.orders)[number]) =>
        !['cancelled', 'rejected', 'delivered'].includes(o.status) &&
        (o.offer?.status === 'pending' || o.extra?.status === 'pending');
    const attention = state.orders.filter(needs);
    const orders = state.orders.filter(
        (o) =>
            `${o.id} ${o.from} ${o.to} ${o.cargo}`
                .toLowerCase()
                .includes(search.toLowerCase()) &&
            (!company || o.companyId === company) &&
            (!status || o.status === status) &&
            (!attentionOnly || needs(o))
    );
    return (
        <>
            <Heading
                eyebrow="Ваши перевозки"
                title="Заказы"
                action={
                    <Link className="sp-button" href="/shipper/create-order">
                        <Plus size={18} />
                        Создать заказ
                    </Link>
                }
            >
                От поставщика до получателя — весь путь груза в одном месте.
            </Heading>
            {attention.length > 0 && (
                <section className="sp-alert">
                    <div>
                        <h2>Нужно ваше решение · {attention.length}</h2>
                        <p>
                            Компании подготовили предложения по доставке и
                            изменению стоимости.
                        </p>
                    </div>
                    <button
                        className="sp-link"
                        onClick={() => setAttentionOnly(!attentionOnly)}
                    >
                        {attentionOnly
                            ? 'Показать все'
                            : 'Посмотреть предложения'}{' '}
                        →
                    </button>
                </section>
            )}
            <div className="sp-toolbar">
                <input
                    aria-label="Поиск заказов"
                    placeholder="Поиск по номеру, грузу или адресу"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    aria-label="Логистическая компания"
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
                <select
                    aria-label="Статус заказа"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Все статусы</option>
                    {Object.entries(statuses).map(([key, text]) => (
                        <option key={key} value={key}>
                            {text}
                        </option>
                    ))}
                </select>
            </div>
            <p className="sp-caption" style={{ marginBottom: 12 }}>
                Заказов: {orders.length}
                {attentionOnly ? ' · Требуют согласования' : ''}
            </p>
            {!orders.length ? (
                <Empty>
                    <Package size={28} style={{ margin: '0 auto 12px' }} />
                    <p>Заказы не найдены</p>
                    <button
                        className="sp-link"
                        onClick={() => {
                            setSearch('');
                            setCompany('');
                            setStatus('');
                            setAttentionOnly(false);
                        }}
                    >
                        Сбросить фильтры
                    </button>
                </Empty>
            ) : (
                <table className="sp-table">
                    <thead>
                        <tr>
                            <th>ЗАКАЗ / МАРШРУТ</th>
                            <th>КОМПАНИЯ</th>
                            <th>СТАТУС</th>
                            <th>ДОСТАВКА</th>
                            <th>СТОИМОСТЬ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o.id}>
                                <td>
                                    <span className="sp-order-id">{o.id}</span>
                                    <Link
                                        className="sp-order-title"
                                        href={`/shipper/orders/${o.id}`}
                                    >
                                        {o.from.split(',')[0]} →{' '}
                                        {o.to.split(',')[0]}{' '}
                                        <ArrowUpRight
                                            size={14}
                                            style={{ display: 'inline' }}
                                        />
                                    </Link>
                                    <small>
                                        {o.cargo} · {o.quantity} {o.unit}
                                    </small>
                                </td>
                                <td>
                                    {
                                        state.companies.find(
                                            (c) => c.id === o.companyId
                                        )?.name
                                    }
                                    <small>
                                        {o.batchId
                                            ? 'Со склада'
                                            : o.supplyId
                                              ? 'Регулярная поставка'
                                              : 'Разовый заказ'}
                                    </small>
                                </td>
                                <td>
                                    <Status status={o.status} />
                                    {o.delay && <small>Срок изменён</small>}
                                    {o.extra?.status === 'pending' && (
                                        <small>Доплата на согласовании</small>
                                    )}
                                </td>
                                <td>
                                    <span className="sp-mobile-label">
                                        Доставка
                                    </span>
                                    {dateLabel(o.date)}
                                </td>
                                <td>
                                    {o.agreedPrice !== undefined
                                        ? money(
                                              o.agreedPrice +
                                                  (o.extra?.status ===
                                                  'accepted'
                                                      ? o.extra.amount
                                                      : 0)
                                          )
                                        : o.offer?.status === 'pending'
                                          ? money(o.offer.amount)
                                          : 'Ожидаем расчёт'}
                                    {o.offer?.status === 'pending' && (
                                        <small>Предварительно</small>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <p className="sp-caption">
                Здесь собраны только ваши заказы. За маршрут и исполнение
                отвечает указанная компания.
            </p>
        </>
    );
}
