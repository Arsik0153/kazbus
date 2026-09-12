'use client';
import { useState } from 'react';
import { dateLabel, money } from './model';
import { DecisionTask } from './selectors';
import { useStore } from './store';

type Choice = 'accept' | 'decline';

export default function Proposal({ decision }: { decision: DecisionTask }) {
    const { act } = useStore();
    const [choice, setChoice] = useState<Choice | null>(null);
    const { order, proposal } = decision;
    const isSurcharge = decision.kind === 'surcharge';
    const amount = money(proposal.amount);
    const eta = dateLabel(proposal.eta);

    function resultCopy(selected: Choice): string {
        if (selected === 'accept') {
            return isSurcharge
                ? `Доплата ${amount} будет согласована. Перевозка продолжится со сроком ${eta}.`
                : `Стоимость ${amount} будет согласована. Заказ запланируют со сроком ${eta}.`;
        }
        return isSurcharge
            ? `Доплата ${amount} будет отклонена. Перевозка продолжится, а менеджер свяжется с вами. Текущий срок: ${eta}.`
            : `Предложение ${amount} будет отклонено. Компания подготовит новые условия. Предложенный срок: ${eta}.`;
    }

    function confirm(selected: Choice) {
        const receipt = act(
            {
                type: 'decision',
                id: order.id,
                extra: isSurcharge,
                accept: selected === 'accept',
            },
            {
                success:
                    selected === 'accept'
                        ? isSurcharge
                            ? `Доплата ${amount} согласована.`
                            : `Предложение ${amount} принято.`
                        : isSurcharge
                          ? `Доплата ${amount} отклонена.`
                          : `Предложение ${amount} отклонено.`,
            }
        );
        if (receipt.ok) setChoice(null);
    }

    return (
        <section className="sp-panel sp-proposal">
            <h2>
                {isSurcharge ? 'Изменение стоимости' : 'Предложение компании'}
            </h2>
            <p className="sp-muted">{proposal.reason}</p>
            <p className="sp-amount">
                {isSurcharge ? '+ ' : ''}
                {amount}
            </p>
            <p>Ожидаемая доставка: {eta}</p>
            {!isSurcharge && (
                <p className="sp-caption">
                    Дополнительные суммы потребуют отдельного согласования.
                </p>
            )}
            {choice ? (
                <div className="sp-inline-confirm" role="group">
                    <strong>
                        {choice === 'accept'
                            ? 'Подтвердить согласование?'
                            : 'Подтвердить отказ?'}
                    </strong>
                    <p>{resultCopy(choice)}</p>
                    <div className="sp-actions">
                        <button
                            className={
                                choice === 'accept'
                                    ? 'sp-button'
                                    : 'sp-secondary'
                            }
                            onClick={() => confirm(choice)}
                        >
                            {choice === 'accept'
                                ? 'Да, согласовать'
                                : 'Да, отклонить'}
                        </button>
                        <button
                            className="sp-link"
                            onClick={() => setChoice(null)}
                        >
                            Вернуться
                        </button>
                    </div>
                </div>
            ) : (
                <div className="sp-actions">
                    <button
                        className="sp-button"
                        onClick={() => setChoice('accept')}
                    >
                        {isSurcharge
                            ? 'Согласовать доплату'
                            : 'Принять предложение'}
                    </button>
                    <button
                        className="sp-secondary"
                        onClick={() => setChoice('decline')}
                    >
                        Отклонить
                    </button>
                </div>
            )}
        </section>
    );
}
