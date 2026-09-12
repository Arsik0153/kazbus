'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from './store';
import { dateLabel, money } from './model';
import { Back, Empty, Heading, Section, Status } from './ui';
import { FileLink } from './files';
import Proposal from './proposal';
import IssueForm from './issue-form';
import RouteProgress from './route-progress';
import { selectDecisionTasks, selectOrderPrice } from './selectors';

function download(text: string, filename: string) {
    const url = URL.createObjectURL(
        new Blob([text], { type: 'text/plain;charset=utf-8' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function OrderDetail({ id }: { id: string }) {
    const { state, act } = useStore();
    const [cancel, setCancel] = useState(false);
    const order = state.orders.find((candidate) => candidate.id === id);
    if (!order) {
        return (
            <>
                <Back />
                <Heading title="Заказ не найден" />
                <Empty>
                    Возможно, демоданные были сброшены. Вернитесь к списку
                    заказов.
                </Empty>
            </>
        );
    }

    const company = state.companies.find(
        (candidate) => candidate.id === order.companyId
    );
    const decisions = selectDecisionTasks(state).filter(
        (decision) => decision.order.id === order.id
    );
    const price = selectOrderPrice(order);
    const priceText =
        price.kind === 'pending'
            ? 'Ожидаем расчёт'
            : price.kind === 'proposal'
              ? `${money(price.amount)} предварительно`
              : money(price.amount);
    const payment = order.invoice
        ? order.invoice.paid
            ? 'Оплачен'
            : 'Ожидает оплаты'
        : 'Счёт не выставлен';

    return (
        <>
            <Back />
            <Heading
                eyebrow={`Заказ ${order.id} · ${company?.name ?? 'Компания'}`}
                title={`${order.from.split(',')[0]} → ${order.to.split(',')[0]}`}
            >
                {order.cargo} · {order.quantity} {order.unit}
            </Heading>
            <section className="sp-order-summary" aria-label="Сводка заказа">
                <dl>
                    <div>
                        <dt>Статус</dt>
                        <dd>
                            <Status status={order.status} />
                        </dd>
                    </div>
                    <div>
                        <dt>Стоимость</dt>
                        <dd>{priceText}</dd>
                    </div>
                    <div>
                        <dt>Доставка</dt>
                        <dd>{dateLabel(order.date)}</dd>
                    </div>
                    <div>
                        <dt>Оплата</dt>
                        <dd>{payment}</dd>
                    </div>
                </dl>
            </section>
            {decisions.map((decision) => (
                <Proposal
                    key={`${decision.order.id}-${decision.kind}`}
                    decision={decision}
                />
            ))}
            {order.delay && (
                <div className="sp-alert">
                    <div>
                        <h2>
                            Доставка задерживается · новый срок{' '}
                            {dateLabel(order.date)}
                        </h2>
                        <p>{order.delay}</p>
                        {order.originalEta && (
                            <p>
                                Ранее: {dateLabel(order.originalEta)}.
                                Уведомление не означает согласие с изменением
                                условий.
                            </p>
                        )}
                    </div>
                </div>
            )}
            <div className="sp-detail-flow">
                <RouteProgress o={order} />
                <Section title="Груз и адреса">
                    <dl className="sp-facts">
                        <div>
                            <dt>Забор груза</dt>
                            <dd>
                                {order.from}
                                <p>{dateLabel(order.pickup)}</p>
                            </dd>
                        </div>
                        <div>
                            <dt>Получатель</dt>
                            <dd>{order.to}</dd>
                        </div>
                        <div>
                            <dt>Груз</dt>
                            <dd>
                                {order.cargo} · {order.quantity} {order.unit}
                            </dd>
                        </div>
                        <div>
                            <dt>Вес и размеры</dt>
                            <dd>
                                {order.weight
                                    ? `${order.weight} кг`
                                    : 'Компания уточнит'}
                                {order.dimensions && ` · ${order.dimensions}`}
                            </dd>
                        </div>
                    </dl>
                    {order.comment && <p>{order.comment}</p>}
                    <div className="sp-file-list">
                        {order.files.map((file) => (
                            <FileLink key={file.id} file={file} />
                        ))}
                    </div>
                    {order.supplyId && (
                        <Link className="sp-link" href="/shipper/supplies">
                            Из регулярной поставки →
                        </Link>
                    )}
                    {order.batchId && (
                        <Link className="sp-link" href="/shipper/storage">
                            Из партии {order.batchId} на складе →
                        </Link>
                    )}
                </Section>
                {order.proof && (
                    <Section title="Подтверждение доставки">
                        <p>{order.proof}</p>
                        <button
                            className="sp-link"
                            onClick={() =>
                                download(
                                    `ДЕМОНСТРАЦИОННЫЙ АКТ\n${order.proof}`,
                                    `Акт-${order.id}.txt`
                                )
                            }
                        >
                            Скачать демоакт
                        </button>
                    </Section>
                )}
                <IssueForm order={order} />
            </div>
            <div className="sp-secondary-grid">
                <section className="sp-panel">
                    <h2>Логистическая компания</h2>
                    <strong>{company?.name ?? 'Компания не найдена'}</strong>
                    <p className="sp-caption">
                        Менеджер отвечает на вопросы по доставке.
                    </p>
                    {company && (
                        <a className="sp-link" href={`tel:${company.phone}`}>
                            {company.phone}
                        </a>
                    )}
                    <p className="sp-caption">
                        Телефоны в прототипе демонстрационные.
                    </p>
                </section>
                <section className="sp-panel">
                    <h2>Счёт</h2>
                    {order.invoice ? (
                        <>
                            <p className="sp-amount">
                                {money(order.invoice.amount)}
                            </p>
                            <p>
                                {order.invoice.number} · {payment}
                            </p>
                            <button
                                className="sp-link"
                                onClick={() => {
                                    const invoice = order.invoice;
                                    if (!invoice) return;
                                    download(
                                        `ДЕМОНСТРАЦИОННЫЙ СЧЁТ, НЕ ДЛЯ ОПЛАТЫ\n${invoice.number}\n${company?.name ?? ''}\nЗаказ ${order.id}\n${money(invoice.amount)}`,
                                        `${invoice.number}.txt`
                                    );
                                }}
                            >
                                Скачать демосчёт
                            </button>
                        </>
                    ) : (
                        <p>Счёт появится после согласования стоимости.</p>
                    )}
                    <p className="sp-caption">
                        Оплата проходит вне приложения. Статус отмечает
                        логистическая компания.
                    </p>
                </section>
                {['waiting', 'offer', 'planned'].includes(order.status) && (
                    <section className="sp-panel">
                        <h2>Отмена заказа</h2>
                        {cancel ? (
                            <>
                                <p>
                                    Отменить заказ {order.id}? Резерв груза
                                    будет освобождён.
                                </p>
                                <div className="sp-actions">
                                    <button
                                        className="sp-secondary"
                                        onClick={() => {
                                            const receipt = act(
                                                {
                                                    type: 'cancel',
                                                    id: order.id,
                                                },
                                                {
                                                    success: `Заказ ${order.id} отменён. Резерв освобождён.`,
                                                }
                                            );
                                            if (receipt.ok) setCancel(false);
                                        }}
                                    >
                                        Да, отменить
                                    </button>
                                    <button
                                        className="sp-link"
                                        onClick={() => setCancel(false)}
                                    >
                                        Оставить заказ
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                className="sp-link"
                                onClick={() => setCancel(true)}
                            >
                                Отменить заказ
                            </button>
                        )}
                    </section>
                )}
            </div>
        </>
    );
}
