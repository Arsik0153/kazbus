'use client';
import { useState } from 'react';
import { useStore } from '../_prototype/store';
import { Heading, Field, Section } from '../_prototype/ui';
import { clearFiles } from '../_prototype/files';
export default function Profile() {
    const { state, act, reset } = useStore();
    const [form, setForm] = useState(state.profile);
    const [confirm, setConfirm] = useState(false);
    const [error, setError] = useState('');
    async function clear() {
        try {
            await clearFiles();
            reset();
            setForm({
                ...state.profile,
                name: 'Анна Смирнова',
                company: 'Магазин «Дом»',
                phone: '+70000000000',
                city: 'Шымкент',
                bin: '',
                notifications: true,
            });
            setConfirm(false);
            setError('');
        } catch (e) {
            setError((e as Error).message);
        }
    }
    return (
        <>
            <Heading eyebrow="Личный кабинет" title="Профиль">
                Ваши данные для связи с логистическими компаниями.
            </Heading>
            <form
                className="sp-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    act({ type: 'profile', profile: form });
                }}
            >
                <Section title="Данные клиента">
                    <div className="sp-form-grid">
                        <Field label="Контактное лицо">
                            <input
                                required
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />
                        </Field>
                        <Field label="Компания или магазин · если есть">
                            <input
                                value={form.company}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        company: e.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Телефон">
                            <input
                                type="tel"
                                required
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                            />
                        </Field>
                        <Field label="Город">
                            <input
                                required
                                value={form.city}
                                onChange={(e) =>
                                    setForm({ ...form, city: e.target.value })
                                }
                            />
                        </Field>
                        <Field label="БИН / ИИН · необязательно">
                            <input
                                value={form.bin}
                                onChange={(e) =>
                                    setForm({ ...form, bin: e.target.value })
                                }
                            />
                        </Field>
                    </div>
                </Section>
                <Section title="Уведомления">
                    <label className="sp-check">
                        <input
                            type="checkbox"
                            checked={form.notifications}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    notifications: e.target.checked,
                                })
                            }
                        />
                        Получать уведомления о ходе доставки
                    </label>
                    <p className="sp-caption">
                        Предложения на согласование всегда видны в заказах.
                        Настройка сохраняется для будущего подключения
                        уведомлений.
                    </p>
                </Section>
                <button className="sp-button">Сохранить изменения</button>
            </form>
            <section className="sp-section" style={{ marginTop: 40 }}>
                <h2>Демонстрационные данные</h2>
                <p className="sp-muted">
                    Заказы и настройки хранятся в этом браузере. Сброс удалит
                    ваши изменения и фотографии и восстановит примеры.
                </p>
                {confirm ? (
                    <div className="sp-actions">
                        <button className="sp-secondary" onClick={clear}>
                            Подтвердить сброс
                        </button>
                        <button
                            className="sp-link"
                            onClick={() => setConfirm(false)}
                        >
                            Оставить данные
                        </button>
                    </div>
                ) : (
                    <button
                        className="sp-secondary"
                        style={{ marginTop: 16 }}
                        onClick={() => setConfirm(true)}
                    >
                        Сбросить демоданные
                    </button>
                )}
                {error && (
                    <p className="sp-error" role="alert">
                        {error}
                    </p>
                )}
            </section>
        </>
    );
}
