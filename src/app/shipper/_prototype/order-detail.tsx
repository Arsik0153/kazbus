'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from './store';
import { money, dateLabel } from './model';
import { Heading, Status, Section, Back, Empty } from './ui';
import Proposal from './proposal';
import IssueForm from './issue-form';
import RouteProgress from './route-progress';
export default function OrderDetail({ id }: { id: string }) {
    const { state, act } = useStore();
    const [cancel, setCancel] = useState(false);
    const o = state.orders.find((o) => o.id === id);
    if (!o)
        return (
            <>
                <Back />
                <Heading title="Заказ не найден" />
                <Empty>
                    Заказ отсутствует или больше недоступен. Вернитесь к списку.
                </Empty>
            </>
        );
    const company = state.companies.find((c) => c.id === o.companyId);
    return (
        <>
            <Back />
            <Heading
                eyebrow={`Заказ ${o.id} · ${company?.name}`}
                title={`${o.from.split(',')[0]} → ${o.to.split(',')[0]}`}
                action={<Status status={o.status} />}
            >
                {o.cargo} · {o.quantity} {o.unit}
            </Heading>
            {o.delay && (
                <div className="sp-alert">
                    <div>
                        <h2>
                            Доставка задерживается · новый срок{' '}
                            {dateLabel(o.date)}
                        </h2>
                        <p>{o.delay}</p>
                        {o.originalEta && (
                            <p>
                                Ранее: {dateLabel(o.originalEta)}. Уведомление
                                не означает согласие с изменением условий.
                            </p>
                        )}
                    </div>
                </div>
            )}
            <div className="sp-detail-grid">
                <div>
                    {o.offer && <Proposal order={o} offer={o.offer} />}{' '}
                    {o.extra && <Proposal order={o} offer={o.extra} extra />}
                    <RouteProgress o={o} />
                    <Section title="Груз и адреса">
                        <dl className="sp-facts">
                            <div>
                                <dt>Забор груза</dt>
                                <dd>
                                    {o.from}
                                    <p>{dateLabel(o.pickup)}</p>
                                </dd>
                            </div>
                            <div>
                                <dt>Получатель</dt>
                                <dd>{o.to}</dd>
                            </div>
                            <div>
                                <dt>Груз</dt>
                                <dd>
                                    {o.cargo} · {o.quantity} {o.unit}
                                </dd>
                            </div>
                            <div>
                                <dt>Вес и размеры</dt>
                                <dd>
                                    {o.weight
                                        ? `${o.weight} кг`
                                        : 'Компания уточнит'}
                                    {o.dimensions && ` · ${o.dimensions}`}
                                </dd>
                            </div>
                        </dl>
                        {o.comment && <p>{o.comment}</p>}
                        {o.supplyId && (
                            <Link className="sp-link" href="/shipper/supplies">
                                Из регулярной поставки →
                            </Link>
                        )}
                        {o.batchId && (
                            <Link className="sp-link" href="/shipper/storage">
                                Из партии {o.batchId} на складе →
                            </Link>
                        )}
                    </Section>
                    {o.proof && (
                        <Section title="Подтверждение доставки">
                            <p>{o.proof}</p>
                        </Section>
                    )}
                    <IssueForm order={o} />
                </div>
                <aside>
                    <section className="sp-panel">
                        <h2>Ваша компания</h2>
                        <strong>{company?.name}</strong>
                        <p className="sp-caption">
                            Менеджер заказа · все вопросы по доставке
                        </p>
                        <a className="sp-link" href={`tel:${company?.phone}`}>
                            {company?.phone}
                        </a>
                    </section>
                    <section className="sp-panel">
                        <h2>Согласованная стоимость</h2>
                        {o.agreedPrice !== undefined ? (
                            <>
                                <p className="sp-amount">
                                    {money(
                                        o.agreedPrice +
                                            (o.extra?.status === 'accepted'
                                                ? o.extra.amount
                                                : 0)
                                    )}
                                </p>
                                <p className="sp-caption">
                                    Согласованная основа: {money(o.agreedPrice)}
                                </p>
                                {o.extra?.status === 'accepted' && (
                                    <p>
                                        Доплата согласована:{' '}
                                        {money(o.extra.amount)}. Отдельный счёт
                                        ожидается.
                                    </p>
                                )}
                            </>
                        ) : (
                            <p>Ожидаем согласования стоимости</p>
                        )}
                        <p className="sp-caption">
                            Оплата в приложении пока недоступна.
                        </p>
                    </section>
                    {['waiting', 'offer', 'planned'].includes(o.status) && (
                        <section className="sp-panel">
                            {cancel ? (
                                <>
                                    <p>
                                        Отменить заказ? Резерв груза будет
                                        освобождён.
                                    </p>
                                    <div className="sp-actions">
                                        <button
                                            className="sp-secondary"
                                            onClick={async () => {
                                                if (
                                                    await act({
                                                        type: 'cancel',
                                                        id: o.id,
                                                    })
                                                ) {
                                                    setCancel(false);
                                                }
                                            }}
                                        >
                                            Да, отменить
                                        </button>
                                        <button
                                            className="sp-link"
                                            onClick={() => setCancel(false)}
                                        >
                                            Оставить
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
                </aside>
            </div>
        </>
    );
}
