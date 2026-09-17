'use client';
import { useState } from 'react';
import { useStore } from '../../_prototype/store';
import { Heading, Field, Section } from '../../_prototype/ui';
export default function Profile() {
    const { state, act } = useStore();
    const [form, setForm] = useState(state.profile);
    const [busy, setBusy] = useState(false);
    return (
        <>
            <Heading eyebrow="Личный кабинет" title="Профиль">
                Ваши данные для связи с логистическими компаниями.
            </Heading>
            <form
                className="sp-form"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setBusy(true);
                    await act({ type: 'profile', profile: form });
                    setBusy(false);
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
                        <Field label="Компания или магазин">
                            <input
                                required
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
                                readOnly
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
                <button className="sp-button" disabled={busy}>
                    {busy ? 'Сохраняем…' : 'Сохранить изменения'}
                </button>
            </form>
        </>
    );
}
