'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight, Building2, Package, Plus } from 'lucide-react';
import { useStore } from './store';
import { dateLabel, money, Order, statuses } from './model';
import { Empty, Heading, Status } from './ui';
import {
    emptyOrderFilters,
    OrderFilters,
    orderFiltersQuery,
    parseOrderFilters,
} from './order-filters';
import {
    OrderCollection,
    selectCompanyConnection,
    selectOrderCollection,
    selectOrderPrice,
} from './selectors';

function priceLabel(order: Order): string {
    const price = selectOrderPrice(order);
    switch (price.kind) {
        case 'agreed':
            return money(price.amount);
        case 'proposal':
            return `${money(price.amount)} предварительно`;
        case 'pending':
            return 'Ожидаем расчёт';
        default: {
            const exhaustive: never = price;
            return exhaustive;
        }
    }
}

function OrderTable({
    orders,
    detailsQuery,
    companyName,
}: {
    orders: Order[];
    detailsQuery: string;
    companyName: (companyId: string) => string;
}) {
    return (
        <div className="sp-orders-table">
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
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>
                                <span className="sp-order-id">{order.id}</span>
                                <Link
                                    className="sp-order-title"
                                    href={`/shipper/orders/${order.id}${detailsQuery}`}
                                >
                                    {order.from.split(',')[0]} →{' '}
                                    {order.to.split(',')[0]}{' '}
                                    <ArrowUpRight
                                        aria-hidden="true"
                                        size={14}
                                    />
                                </Link>
                                <small>
                                    {order.cargo} · {order.quantity}{' '}
                                    {order.unit}
                                </small>
                            </td>
                            <td>
                                {companyName(order.companyId)}
                                <small>
                                    {order.batchId
                                        ? 'Со склада'
                                        : order.supplyId
                                          ? 'Регулярная поставка'
                                          : 'Разовый заказ'}
                                </small>
                            </td>
                            <td>
                                <Status status={order.status} />
                                {order.delay && <small>Срок изменён</small>}
                                {order.extra?.status === 'pending' && (
                                    <small>Доплата на согласовании</small>
                                )}
                            </td>
                            <td>{dateLabel(order.date)}</td>
                            <td>{priceLabel(order)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function OrderCards({
    orders,
    detailsQuery,
    companyName,
}: {
    orders: Order[];
    detailsQuery: string;
    companyName: (companyId: string) => string;
}) {
    return (
        <div className="sp-order-cards">
            {orders.map((order) => (
                <article className="sp-order-card" key={order.id}>
                    <span className="sp-order-id">{order.id}</span>
                    <Link
                        className="sp-order-title"
                        href={`/shipper/orders/${order.id}${detailsQuery}`}
                    >
                        {order.from.split(',')[0]} → {order.to.split(',')[0]}
                        <ArrowUpRight aria-hidden="true" size={16} />
                    </Link>
                    <p className="sp-caption">
                        {order.cargo} · {order.quantity} {order.unit}
                    </p>
                    <dl className="sp-card-facts">
                        <div>
                            <dt>Компания</dt>
                            <dd>{companyName(order.companyId)}</dd>
                        </div>
                        <div>
                            <dt>Статус</dt>
                            <dd>
                                <Status status={order.status} />
                            </dd>
                        </div>
                        <div>
                            <dt>Доставка</dt>
                            <dd>{dateLabel(order.date)}</dd>
                        </div>
                        <div>
                            <dt>Стоимость</dt>
                            <dd>{priceLabel(order)}</dd>
                        </div>
                    </dl>
                    {order.delay && (
                        <p className="sp-warning-text">Срок доставки изменён</p>
                    )}
                    {order.extra?.status === 'pending' && (
                        <p className="sp-warning-text">
                            Доплата ждёт согласования
                        </p>
                    )}
                </article>
            ))}
        </div>
    );
}

function OrderResults({
    collection,
    detailsQuery,
    companyName,
    connected,
    resetFilters,
}: {
    collection: OrderCollection;
    detailsQuery: string;
    companyName: (companyId: string) => string;
    connected: boolean;
    resetFilters: () => void;
}) {
    switch (collection.kind) {
        case 'empty-account':
            return (
                <Empty>
                    <Package aria-hidden="true" size={28} />
                    <h2>Заказов пока нет</h2>
                    <p>
                        {connected
                            ? 'Создайте первую заявку на перевозку.'
                            : 'Сначала подключите логистическую компанию.'}
                    </p>
                    <Link
                        className="sp-button"
                        href={
                            connected
                                ? '/shipper/create-order'
                                : '/shipper/companies'
                        }
                    >
                        {connected ? 'Создать заказ' : 'Открыть компании'}
                    </Link>
                </Empty>
            );
        case 'no-matches':
            return (
                <Empty>
                    <Package aria-hidden="true" size={28} />
                    <h2>По этим фильтрам заказов нет</h2>
                    <button className="sp-secondary" onClick={resetFilters}>
                        Сбросить фильтры
                    </button>
                </Empty>
            );
        case 'results':
            return (
                <>
                    <OrderTable
                        orders={collection.orders}
                        detailsQuery={detailsQuery}
                        companyName={companyName}
                    />
                    <OrderCards
                        orders={collection.orders}
                        detailsQuery={detailsQuery}
                        companyName={companyName}
                    />
                </>
            );
        default: {
            const exhaustive: never = collection;
            return exhaustive;
        }
    }
}

export default function Orders() {
    const { state } = useStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const connection = selectCompanyConnection(state);
    const knownCompanyIds =
        connection.kind === 'connected'
            ? connection.companies.map((company) => company.id)
            : [];
    const filters = parseOrderFilters(searchParams, knownCompanyIds);
    const collection = selectOrderCollection(state, filters);
    const query = orderFiltersQuery(filters);
    const detailsQuery = query ? `?${query}` : '';

    function updateFilters(next: Partial<OrderFilters>) {
        const updated = { ...filters, ...next };
        const nextQuery = orderFiltersQuery(updated);
        router.replace(
            nextQuery ? `/shipper/orders?${nextQuery}` : '/shipper/orders',
            { scroll: false }
        );
    }

    const resultCount =
        collection.kind === 'results' ? collection.orders.length : 0;
    return (
        <>
            <Heading
                eyebrow="Ваши перевозки"
                title="Заказы"
                action={
                    <Link
                        className="sp-button"
                        href={
                            connection.kind === 'connected'
                                ? '/shipper/create-order'
                                : '/shipper/companies'
                        }
                    >
                        {connection.kind === 'connected' ? (
                            <Plus aria-hidden="true" size={18} />
                        ) : (
                            <Building2 aria-hidden="true" size={18} />
                        )}
                        {connection.kind === 'connected'
                            ? 'Создать заказ'
                            : 'Подключить компанию'}
                    </Link>
                }
            >
                Весь путь груза от поставщика до получателя.
            </Heading>
            <div className="sp-toolbar">
                <input
                    aria-label="Поиск заказов"
                    placeholder="Номер, груз или адрес"
                    value={filters.q}
                    onChange={(event) =>
                        updateFilters({ q: event.target.value })
                    }
                />
                <select
                    aria-label="Логистическая компания"
                    value={filters.companyId}
                    onChange={(event) =>
                        updateFilters({ companyId: event.target.value })
                    }
                >
                    <option value="">Все компании</option>
                    {connection.kind === 'connected' &&
                        connection.companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                </select>
                <select
                    aria-label="Статус заказа"
                    value={filters.status}
                    onChange={(event) => {
                        const status = parseOrderFilters(
                            new URLSearchParams([
                                ['status', event.target.value],
                            ]),
                            []
                        ).status;
                        updateFilters({ status });
                    }}
                >
                    <option value="">Все статусы</option>
                    {Object.entries(statuses).map(([key, text]) => (
                        <option key={key} value={key}>
                            {text}
                        </option>
                    ))}
                </select>
                <label className="sp-filter-check">
                    <input
                        type="checkbox"
                        checked={filters.attentionOnly}
                        onChange={(event) =>
                            updateFilters({
                                attentionOnly: event.target.checked,
                            })
                        }
                    />
                    Ждут решения
                </label>
            </div>
            <p className="sp-caption sp-results-count">
                Найдено заказов: {resultCount}
            </p>
            <OrderResults
                collection={collection}
                detailsQuery={detailsQuery}
                companyName={(companyId) =>
                    state.companies.find((company) => company.id === companyId)
                        ?.name ?? 'Компания не найдена'
                }
                connected={connection.kind === 'connected'}
                resetFilters={() => updateFilters(emptyOrderFilters)}
            />
        </>
    );
}
