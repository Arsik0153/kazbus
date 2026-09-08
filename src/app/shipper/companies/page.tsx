'use client';
import { useState } from 'react';
import { useStore } from '../_prototype/store';
import { Heading, Empty, Field } from '../_prototype/ui';
export default function Companies() {
    const { state, act } = useStore();
    const [search, setSearch] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
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
            <form
                className="sp-panel"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (code.trim().toUpperCase() !== 'NOMAD-DEMO') {
                        setError(
                            'Код не найден. Для демо используйте NOMAD-DEMO.'
                        );
                        return;
                    }
                    act({ type: 'connect', id: 'c3', invited: true });
                    setCode('');
                    setError('');
                }}
            >
                <h2>Есть приглашение?</h2>
                <div className="sp-toolbar">
                    <Field label="Код от логистической компании">
                        <input
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Введите код"
                        />
                    </Field>
                    <button
                        className="sp-secondary"
                        style={{ alignSelf: 'end' }}
                    >
                        Подключиться
                    </button>
                </div>
                <p className="sp-caption">
                    Демонстрационное приглашение: NOMAD-DEMO. Оно подключает
                    Nomad Freight без ожидания.
                </p>
                {error && (
                    <p className="sp-error" role="alert">
                        {error}
                    </p>
                )}
            </form>
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
                            <p className="sp-caption">
                                Демонстрационный телефон.
                            </p>
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
                                    onClick={() =>
                                        act({ type: 'connect', id: c.id })
                                    }
                                >
                                    Запросить сотрудничество
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
