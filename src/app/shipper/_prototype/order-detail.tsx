'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from './store';
import { money, dateLabel } from './model';
import { Heading, Status, Section, Back, Empty } from './ui';
import { FileLink } from './files';
import Proposal from './proposal';
import IssueForm from './issue-form';
import RouteProgress from './route-progress';
function download(text: string, filename: string) {
    const url = URL.createObjectURL(
        new Blob([text], { type: 'text/plain;charset=utf-8' })
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
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
                    Возможно, демоданные были сброшены. Вернитесь к списку
                    заказов.
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
                        <div className="sp-file-list">
                            {o.files.map((f) => (
                                <FileLink key={f.id} file={f} />
                            ))}
                        </div>
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
                            <button
                                className="sp-link"
                                onClick={() =>
                                    download(
                                        `ДЕМОНСТРАЦИОННЫЙ АКТ\n${o.proof}`,
                                        `Акт-${o.id}.txt`
                                    )
                                }
                            >
                                Скачать демоакт
                            </button>
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
                        <p className="sp-caption">
                            Телефоны в прототипе — демонстрационные.
                        </p>
                    </section>
                    <section className="sp-panel">
                        <h2>Стоимость и оплата</h2>
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
                        {o.invoice && (
                            <>
                                <p style={{ marginTop: 16 }}>
                                    {o.invoice.number} ·{' '}
                                    {money(o.invoice.amount)}
                                </p>
                                <p>
                                    {o.invoice.paid
                                        ? 'Оплачен'
                                        : 'Ожидает оплаты'}
                                </p>
                                <button
                                    className="sp-link"
                                    onClick={() =>
                                        download(
                                            `ДЕМОНСТРАЦИОННЫЙ СЧЁТ — НЕ ДЛЯ ОПЛАТЫ\n${o.invoice!.number}\n${company?.name}\nЗаказ ${o.id}\n${money(o.invoice!.amount)}`,
                                            `${o.invoice!.number}.txt`
                                        )
                                    }
                                >
                                    Скачать демосчёт
                                </button>
                            </>
                        )}
                        <p className="sp-caption">
                            Оплата вне приложения. Статус отмечает логистическая
                            компания.
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
                                            onClick={() =>
                                                act({
                                                    type: 'cancel',
                                                    id: o.id,
                                                })
                                            }
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
