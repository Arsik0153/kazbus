'use client';

import { useState, type FormEvent } from 'react';

import type { Supply, Unit } from './model';
import { units } from './model';
import { useStore } from './store';
import { Field } from './ui';

export const week = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function SupplyForm({
    initial,
    close,
}: {
    initial?: Supply;
    close: () => void;
}) {
    const { state, act } = useStore();
    const [form, setForm] = useState<Supply>(
        initial ?? {
            id: '',
            title: '',
            companyId:
                state.companies.find(
                    (company) => company.relation === 'confirmed'
                )?.id ?? '',
            from: '',
            to: '',
            cargo: '',
            quantity: 1,
            unit: 'коробок',
            mode: 'weekly',
            weekdays: [1],
            monthDay: 1,
            automatic: false,
            paused: false,
            skipped: [],
            price: 0,
            approved: false,
        }
    );
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const update = <Key extends keyof Supply>(key: Key, value: Supply[Key]) =>
        setForm((current) => ({ ...current, [key]: value }));

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        if (form.mode === 'weekly' && form.weekdays.length === 0) {
            setError('Выберите хотя бы один день недели.');
            return;
        }

        setBusy(true);
        const saved = await act({
            type: 'save-supply',
            supply: form,
            creating: !initial,
        });
        setBusy(false);
        if (saved) close();
    }

    const companies = state.companies.filter(
        (company) => company.relation === 'confirmed'
    );

    return (
        <form className="sp-panel sp-form" onSubmit={submit}>
            <h2>{initial ? 'Настройки поставки' : 'Новая поставка'}</h2>
            <div className="sp-form-grid">
                <Field label="Название">
                    <input
                        autoFocus
                        required
                        value={form.title}
                        onChange={(event) =>
                            update('title', event.target.value)
                        }
                    />
                </Field>
                <Field label="Логистическая компания">
                    <select
                        required
                        value={form.companyId}
                        onChange={(event) =>
                            update('companyId', event.target.value)
                        }
                    >
                        <option value="">Выберите компанию</option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Откуда забирать">
                    <input
                        required
                        placeholder="Город, улица, склад"
                        value={form.from}
                        onChange={(event) => update('from', event.target.value)}
                    />
                </Field>
                <Field label="Куда доставлять">
                    <input
                        required
                        placeholder="Город, улица, получатель"
                        value={form.to}
                        onChange={(event) => update('to', event.target.value)}
                    />
                </Field>
                <Field label="Груз">
                    <input
                        required
                        value={form.cargo}
                        onChange={(event) =>
                            update('cargo', event.target.value)
                        }
                    />
                </Field>
                <Field label="Количество">
                    <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        required
                        value={form.quantity}
                        onChange={(event) =>
                            update('quantity', Number(event.target.value))
                        }
                    />
                </Field>
                <Field label="Единица">
                    <select
                        value={form.unit}
                        onChange={(event) =>
                            update('unit', event.target.value as Unit)
                        }
                    >
                        {units.map((unit) => (
                            <option key={unit}>{unit}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Повторение">
                    <select
                        value={form.mode}
                        onChange={(event) =>
                            update('mode', event.target.value as Supply['mode'])
                        }
                    >
                        <option value="manual">По потребности</option>
                        <option value="weekly">По дням недели</option>
                        <option value="monthly">Раз в месяц</option>
                    </select>
                </Field>
                {form.mode === 'weekly' && (
                    <fieldset className="sp-field-wide">
                        <legend>Дни отправления</legend>
                        <div className="sp-actions">
                            {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                                <label className="sp-check" key={day}>
                                    <input
                                        type="checkbox"
                                        checked={form.weekdays.includes(day)}
                                        onChange={(event) =>
                                            update(
                                                'weekdays',
                                                event.target.checked
                                                    ? [...form.weekdays, day]
                                                    : form.weekdays.filter(
                                                          (value) =>
                                                              value !== day
                                                      )
                                            )
                                        }
                                    />
                                    {week[day]}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                )}
                {form.mode === 'monthly' && (
                    <Field label="День месяца">
                        <input
                            type="number"
                            required
                            min={1}
                            max={31}
                            value={form.monthDay}
                            onChange={(event) =>
                                update('monthDay', Number(event.target.value))
                            }
                        />
                        <small>
                            В коротком месяце отправление придется на последний
                            день.
                        </small>
                    </Field>
                )}
            </div>
            <p className="sp-caption">
                Каждое отправление запускается вручную из расписания.
            </p>
            {error && (
                <p className="sp-error" role="alert">
                    {error}
                </p>
            )}
            <div className="sp-actions">
                <button
                    className="sp-button"
                    disabled={busy || companies.length === 0}
                >
                    {busy ? 'Сохраняем…' : 'Сохранить поставку'}
                </button>
                <button type="button" className="sp-secondary" onClick={close}>
                    Отмена
                </button>
            </div>
        </form>
    );
}
