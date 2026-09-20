'use client';
import { useState } from 'react';
import { useStore } from './store';
import { Order, Offer, money, dateLabel } from './model';
export default function Proposal({
    order,
    offer,
    extra = false,
}: {
    order: Order;
    offer: Offer;
    extra?: boolean;
}) {
    const { act } = useStore();
    const [busy, setBusy] = useState(false);
    const closed = ['cancelled', 'rejected', 'delivered'].includes(
        order.status
    );
    return (
        <section className="sp-panel">
            <h2>{extra ? 'Изменение стоимости' : 'Предложение компании'}</h2>
            <p className="sp-muted">{offer.reason}</p>
            <p className="sp-amount">
                {extra ? '+ ' : ''}
                {money(offer.amount)}
            </p>
            <p>Ожидаемая доставка: {dateLabel(offer.eta)}</p>
            {!extra && (
                <p className="sp-caption">
                    Предварительная стоимость. Любая дополнительная сумма
                    требует отдельного согласования.
                </p>
            )}
            {offer.status === 'pending' && !closed ? (
                <div className="sp-actions">
                    <button
                        className="sp-button"
                        disabled={busy}
                        onClick={async () => {
                            setBusy(true);
                            await act({
                                type: 'decision',
                                id: order.id,
                                extra,
                                accept: true,
                            });
                            setBusy(false);
                        }}
                    >
                        {extra ? 'Согласовать доплату' : 'Принять предложение'}
                    </button>
                    <button
                        className="sp-secondary"
                        disabled={busy}
                        onClick={async () => {
                            setBusy(true);
                            await act({
                                type: 'decision',
                                id: order.id,
                                extra,
                                accept: false,
                            });
                            setBusy(false);
                        }}
                    >
                        Отклонить
                    </button>
                </div>
            ) : (
                <p className="sp-caption">
                    {offer.status === 'accepted'
                        ? 'Вы согласовали предложение.'
                        : offer.status === 'declined'
                          ? extra
                              ? 'Доплата отклонена. Вопрос передан менеджеру, перевозка продолжается.'
                              : 'Предложение отклонено. Ожидаем новые условия от компании.'
                          : 'Заказ закрыт. Согласование недоступно.'}
                </p>
            )}
        </section>
    );
}
