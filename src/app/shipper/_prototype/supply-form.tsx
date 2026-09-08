'use client';
import { FormEvent, useState } from 'react';
import { Supply, Unit, units } from './model';
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
    const [form, set] = useState<Supply>(
        initial || {
            id: crypto.randomUUID(),
            title: '',
            companyId:
                state.companies.find((c) => c.relation === 'confirmed')?.id ||
                '',
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
    const update = <K extends keyof Supply>(key: K, value: Supply[K]) =>
        set((s) => ({ ...s, [key]: value }));
    function submit(e: FormEvent) {
        e.preventDefault();
        if (
            ![form.title, form.from, form.to, form.cargo].every((v) =>
                v.trim()
            ) ||
            !form.quantity ||
            form.quantity < 0 ||
            (form.mode === 'weekly' && !form.weekdays.length)
        ) {
            setError('Заполните данные и выберите хотя бы один день недели.');
            return;
        }
        const conditionsChanged =
            initial &&
            ['companyId', 'from', 'to', 'cargo', 'quantity', 'unit'].some(
                (k) => form[k as keyof Supply] !== initial[k as keyof Supply]
            );
        if (
            act({
                type: 'supply',
                supply: {
                    ...form,
                    approved: conditionsChanged ? false : form.approved,
                },
            })
        )
            close();
    }
    return (
        <form className="sp-panel sp-form" onSubmit={submit}>
            <h2>{initial ? 'Настройки поставки' : 'Новая поставка'}</h2>
            <div className="sp-form-grid">
                <Field label="Название">
                    <input
                        autoFocus
                        required
                        value={form.title}
                        onChange={(e) => update('title', e.target.value)}
                    />
                </Field>
                <Field label="Компания">
                    <select
                        value={form.companyId}
                        required
                        onChange={(e) => update('companyId', e.target.value)}
                    >
                        {state.companies
                            .filter((c) => c.relation === 'confirmed')
                            .map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                    </select>
                </Field>
                <Field label="Адрес забора">
                    <input
                        required
                        value={form.from}
                        onChange={(e) => update('from', e.target.value)}
                    />
                </Field>
                <Field label="Адрес доставки">
                    <input
                        required
                        value={form.to}
                        onChange={(e) => update('to', e.target.value)}
                    />
                </Field>
                <Field label="Груз">
                    <input
                        required
                        value={form.cargo}
                        onChange={(e) => update('cargo', e.target.value)}
                    />
                </Field>
                <Field label="Количество">
                    <input
                        type="number"
                        step="any"
                        min="0.001"
                        required
                        value={form.quantity}
                        onChange={(e) =>
                            update('quantity', Number(e.target.value))
                        }
                    />
                </Field>
                <Field label="Единица">
                    <select
                        value={form.unit}
                        onChange={(e) => update('unit', e.target.value as Unit)}
                    >
                        {units.map((u) => (
                            <option key={u}>{u}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Повторение">
                    <select
                        value={form.mode}
                        onChange={(e) =>
                            update('mode', e.target.value as Supply['mode'])
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
                            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                                <label className="sp-check" key={d}>
                                    <input
                                        type="checkbox"
                                        checked={form.weekdays.includes(d)}
                                        onChange={(e) =>
                                            update(
                                                'weekdays',
                                                e.target.checked
                                                    ? [...form.weekdays, d]
                                                    : form.weekdays.filter(
                                                          (x) => x !== d
                                                      )
                                            )
                                        }
                                    />
                                    {week[d]}
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
                            onChange={(e) =>
                                update('monthDay', Number(e.target.value))
                            }
                        />
                        <small>
                            Если такого дня нет, отправление в последний день
                            месяца.
                        </small>
                    </Field>
                )}
                {form.mode !== 'manual' && (
                    <Field label="Запуск отправлений">
                        <select
                            value={form.automatic ? 'auto' : 'confirm'}
                            onChange={(e) =>
                                update('automatic', e.target.value === 'auto')
                            }
                        >
                            <option value="confirm">
                                Подтверждать каждую доставку
                            </option>
                            <option value="auto">
                                Автоматически после согласования условий
                            </option>
                        </select>
                    </Field>
                )}
            </div>
            <p className="sp-caption">
                Новые условия согласует компания. В демо можно отправить
                отдельную заявку; согласованные поставки уже представлены в
                примерах.
            </p>
            {error && (
                <p role="alert" className="sp-error">
                    {error}
                </p>
            )}
            <div className="sp-actions">
                <button className="sp-button">Сохранить поставку</button>
                <button type="button" className="sp-secondary" onClick={close}>
                    Отмена
                </button>
            </div>
        </form>
    );
}
