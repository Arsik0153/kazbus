'use client';
import { useState } from 'react';
import { useStore } from '../../_prototype/store';
import { Heading, Empty } from '../../_prototype/ui';
export default function Companies() {
    const { state, act } = useStore();
    const [search, setSearch] = useState('');
    const [pendingId, setPendingId] = useState('');
    const companies = state.companies.filter((c) =>
        `${c.name} ${c.city} ${c.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    return (
        <>
            <Heading eyebrow="Ваши партнёры" title="Логистические компании">
                Работайте с несколькими компаниями. Все ваши заказы остаются в
                одном кабинете.
            </Heading>
            <section className="sp-panel">
                <h2>Подключение компании</h2>
                <p className="sp-muted">
                    Отправьте запрос выбранной компании. Создавать заказы можно
                    после подтверждения запроса компанией.
                </p>
            </section>
            <div className="sp-toolbar">
                <input
                    aria-label="Поиск компании"
                    placeholder="Название, город или специализация"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="sp-company-grid">
                {companies.map((c) => (
                    <article className="sp-panel" key={c.id}>
                        <p className="sp-eyebrow">{c.city}</p>
                        <h2>{c.name}</h2>
                        <p className="sp-muted">{c.description}</p>
                        <details style={{ marginTop: 16 }}>
                            <summary>Профиль и контакты</summary>
                            <p className="sp-caption">
                                Менеджер по работе с клиентами
                            </p>
                            <a className="sp-link" href={`tel:${c.phone}`}>
                                {c.phone}
                            </a>
                        </details>
                        <div className="sp-actions">
                            {c.relation === 'confirmed' ? (
                                <span className="sp-status sp-status-delivered">
                                    Подключена
                                </span>
                            ) : c.relation === 'requested' ? (
                                <span className="sp-status sp-status-offer">
                                    Запрос отправлен · ждём компанию
                                </span>
                            ) : (
                                <button
                                    className="sp-secondary"
                                    disabled={pendingId === c.id}
                                    onClick={async () => {
                                        setPendingId(c.id);
                                        await act({
                                            type: 'connect',
                                            id: c.id,
                                        });
                                        setPendingId('');
                                    }}
                                >
                                    {pendingId === c.id
                                        ? 'Отправляем…'
                                        : 'Запросить сотрудничество'}
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>
            {!companies.length && (
                <Empty>Компании не найдены. Попробуйте другой запрос.</Empty>
            )}
        </>
    );
}
