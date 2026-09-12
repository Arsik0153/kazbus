'use client';
import Link from 'next/link';
import { ArrowUpRight, Building2, Plus } from 'lucide-react';
import { ReactNode } from 'react';
import { useStore } from './_prototype/store';
import {
    selectCompanyConnection,
    selectDashboard,
    selectOrderPrice,
} from './_prototype/selectors';
import { dateLabel, money } from './_prototype/model';
import { Heading, Status } from './_prototype/ui';

function TaskSection({
    title,
    count,
    empty,
    children,
}: {
    title: string;
    count: number;
    empty: string;
    children: ReactNode;
}) {
    return (
        <section className="sp-dashboard-section">
            <div className="sp-section-heading">
                <h2>{title}</h2>
                <span aria-label={`Количество: ${count}`}>{count}</span>
            </div>
            {count ? children : <p className="sp-dashboard-empty">{empty}</p>}
        </section>
    );
}

export default function Dashboard() {
    const { state } = useStore();
    const dashboard = selectDashboard(state);
    const connection = selectCompanyConnection(state);
    const companyName = (companyId: string) =>
        state.companies.find((company) => company.id === companyId)?.name ??
        'Компания не найдена';

    return (
        <>
            <Heading
                eyebrow="Кабинет заказчика"
                title="Обзор"
                action={
                    connection.kind === 'connected' ? (
                        <Link
                            className="sp-button"
                            href="/shipper/create-order"
                        >
                            <Plus aria-hidden="true" size={18} />
                            Создать заказ
                        </Link>
                    ) : (
                        <Link className="sp-button" href="/shipper/companies">
                            <Building2 aria-hidden="true" size={18} />
                            Подключить компанию
                        </Link>
                    )
                }
            >
                Сначала решения, которые ждут вас, затем текущая работа и
                ближайшие поставки.
            </Heading>
            {connection.kind === 'not-connected' && (
                <div className="sp-alert">
                    <div>
                        <h2>Для нового заказа нужна логистическая компания</h2>
                        <p>
                            Подключите компанию по приглашению или отправьте
                            запрос на сотрудничество.
                        </p>
                    </div>
                    <Link className="sp-secondary" href="/shipper/companies">
                        Открыть компании
                    </Link>
                </div>
            )}
            <div className="sp-dashboard">
                <TaskSection
                    title="Решения по стоимости"
                    count={dashboard.decisions.length}
                    empty="Новых предложений и доплат нет."
                >
                    {dashboard.decisions.map((decision) => (
                        <Link
                            className="sp-task-row"
                            key={`${decision.order.id}-${decision.kind}`}
                            href={`/shipper/orders/${decision.order.id}`}
                        >
                            <div>
                                <strong>
                                    {decision.kind === 'price'
                                        ? 'Согласовать стоимость'
                                        : 'Согласовать доплату'}
                                </strong>
                                <p>
                                    {decision.order.id} ·{' '}
                                    {companyName(decision.order.companyId)}
                                </p>
                            </div>
                            <div className="sp-task-value">
                                <strong>
                                    {money(decision.proposal.amount)}
                                </strong>
                                <span>
                                    до {dateLabel(decision.proposal.eta)}
                                </span>
                            </div>
                            <ArrowUpRight aria-hidden="true" size={18} />
                        </Link>
                    ))}
                </TaskSection>
                <TaskSection
                    title="Задержки"
                    count={dashboard.delays.length}
                    empty="Открытых задержек нет."
                >
                    {dashboard.delays.map((order) => (
                        <Link
                            className="sp-task-row"
                            href={`/shipper/orders/${order.id}`}
                            key={order.id}
                        >
                            <div>
                                <strong>
                                    {order.from.split(',')[0]} →{' '}
                                    {order.to.split(',')[0]}
                                </strong>
                                <p>{order.delay}</p>
                            </div>
                            <div className="sp-task-value">
                                <strong>{dateLabel(order.date)}</strong>
                                <span>новый срок</span>
                            </div>
                            <ArrowUpRight aria-hidden="true" size={18} />
                        </Link>
                    ))}
                </TaskSection>
                <TaskSection
                    title="Запланированы и в пути"
                    count={dashboard.active.length}
                    empty="Активных перевозок нет."
                >
                    {dashboard.active.map((order) => {
                        const price = selectOrderPrice(order);
                        return (
                            <Link
                                className="sp-task-row"
                                href={`/shipper/orders/${order.id}`}
                                key={order.id}
                            >
                                <div>
                                    <strong>
                                        {order.from.split(',')[0]} →{' '}
                                        {order.to.split(',')[0]}
                                    </strong>
                                    <p>
                                        {order.id} ·{' '}
                                        {companyName(order.companyId)}
                                    </p>
                                </div>
                                <div className="sp-task-value">
                                    <Status status={order.status} />
                                    <span>
                                        доставка {dateLabel(order.date)}
                                        {price.kind === 'agreed'
                                            ? ` · ${money(price.amount)}`
                                            : ''}
                                    </span>
                                </div>
                                <ArrowUpRight aria-hidden="true" size={18} />
                            </Link>
                        );
                    })}
                </TaskSection>
                <TaskSection
                    title="Счета к оплате"
                    count={dashboard.unpaid.length}
                    empty="Неоплаченных счетов нет."
                >
                    {dashboard.unpaid.map((order) => (
                        <Link
                            className="sp-task-row"
                            href={`/shipper/orders/${order.id}`}
                            key={order.id}
                        >
                            <div>
                                <strong>{order.invoice?.number}</strong>
                                <p>
                                    Заказ {order.id} ·{' '}
                                    {companyName(order.companyId)}
                                </p>
                            </div>
                            <div className="sp-task-value">
                                <strong>
                                    {order.invoice
                                        ? money(order.invoice.amount)
                                        : ''}
                                </strong>
                                <span>ожидает оплаты</span>
                            </div>
                            <ArrowUpRight aria-hidden="true" size={18} />
                        </Link>
                    ))}
                </TaskSection>
                <TaskSection
                    title="Ближайшие регулярные поставки"
                    count={dashboard.supplies.length}
                    empty="Запланированных регулярных поставок нет."
                >
                    {dashboard.supplies.map(({ supply, date }) => (
                        <Link
                            className="sp-task-row"
                            href="/shipper/supplies"
                            key={supply.id}
                        >
                            <div>
                                <strong>{supply.title}</strong>
                                <p>
                                    {supply.cargo} ·{' '}
                                    {companyName(supply.companyId)}
                                </p>
                            </div>
                            <div className="sp-task-value">
                                <strong>{dateLabel(date)}</strong>
                                <span>
                                    {supply.paused
                                        ? 'приостановлена'
                                        : 'ближайшая дата'}
                                </span>
                            </div>
                            <ArrowUpRight aria-hidden="true" size={18} />
                        </Link>
                    ))}
                </TaskSection>
            </div>
        </>
    );
}
