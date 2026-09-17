'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from './store';
import { Unit, units, localDate } from './model';
import { Heading, Field, Section, Back } from './ui';
export default function CreateOrder() {
    const { state, act } = useStore();
    const router = useRouter();
    const companies = state.companies.filter((c) => c.relation === 'confirmed');
    const [companyId, setCompany] = useState(companies[0]?.id || '');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [pickup, setPickup] = useState(localDate());
    const [date, setDate] = useState('');
    const [cargo, setCargo] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<Unit>('коробок');
    const [weight, setWeight] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    async function submit(e: FormEvent) {
        e.preventDefault();
        if (busy) return;
        setError('');
        if (date < pickup) {
            setError('Дата доставки не может быть раньше забора груза.');
            return;
        }
        setBusy(true);
        try {
            if (
                await act({
                    type: 'create',
                    order: {
                        id: '',
                        companyId,
                        from: from.trim(),
                        to: to.trim(),
                        pickup,
                        date,
                        cargo: cargo.trim(),
                        quantity: Number(quantity),
                        unit,
                        weight: weight ? Number(weight) : undefined,
                        dimensions,
                        comment,
                        status: 'waiting',
                        stages: [],
                        updated: '',
                        files: [],
                        issues: [],
                    },
                })
            )
                router.push('/shipper/orders');
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }
    return (
        <>
            <Back />
            <Heading eyebrow="Новая доставка" title="Создать заказ">
                Укажите груз и адреса. Компания подберёт транспорт и предложит
                стоимость.
            </Heading>
            <form className="sp-form" onSubmit={submit}>
                <Section title="01 · Компания и маршрут">
                    <div className="sp-form-grid">
                        <Field label="Логистическая компания">
                            <select
                                value={companyId}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            >
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <div className="sp-muted">
                            Заказ получит выбранная компания. Начало перевозки —
                            после согласования предложения.
                        </div>
                        <Field label="Откуда забрать · город и адрес">
                            <input
                                required
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder="Москва, ул. Складская, 12"
                            />
                        </Field>
                        <Field label="Куда доставить · город и адрес">
                            <input
                                required
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="Шымкент, адрес магазина"
                            />
                        </Field>
                        <Field label="Желаемая дата забора">
                            <input
                                type="date"
                                required
                                min={localDate()}
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                            />
                        </Field>
                        <Field label="Желаемая дата доставки">
                            <input
                                type="date"
                                required
                                min={pickup}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Field>
                    </div>
                </Section>
                <Section title="02 · Что перевозим">
                    <div className="sp-form-grid">
                        <div className="sp-field-wide">
                            <Field label="Описание груза">
                                <input
                                    required
                                    value={cargo}
                                    onChange={(e) => setCargo(e.target.value)}
                                    placeholder="Например, посуда в коробках"
                                />
                            </Field>
                        </div>
                        <Field label="Количество">
                            <input
                                type="number"
                                min="0.001"
                                step="any"
                                required
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </Field>
                        <Field label="Единица измерения">
                            <select
                                value={unit}
                                onChange={(e) =>
                                    setUnit(e.target.value as Unit)
                                }
                            >
                                {units.map((u) => (
                                    <option key={u}>{u}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Общий вес, кг · если знаете">
                            <input
                                type="number"
                                min="0.001"
                                step="any"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </Field>
                        <Field label="Размеры · если знаете">
                            <input
                                value={dimensions}
                                onChange={(e) => setDimensions(e.target.value)}
                                placeholder="Коробка: 40 × 30 × 30 см"
                            />
                        </Field>
                        <p className="sp-caption sp-field-wide">
                            Вложения будут доступны после подключения файлового
                            API.
                        </p>
                    </div>
                </Section>
                <Section title="03 · Дополнительные пожелания">
                    <Field label="Контакты на адресах, условия хранения и перевозки">
                        <textarea
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Хрупкий груз, температурный режим, время работы склада…"
                        />
                    </Field>
                </Section>
                {error && (
                    <p className="sp-error" role="alert">
                        {error}
                    </p>
                )}
                <p className="sp-muted">
                    Стоимость пока не определена. Вы сможете принять или
                    отклонить предложение компании.
                </p>
                <div className="sp-actions">
                    <button
                        className="sp-button"
                        disabled={busy || !companies.length}
                    >
                        {busy ? 'Сохраняем…' : 'Отправить заявку'}
                    </button>
                    <Link className="sp-secondary" href="/shipper/orders">
                        Отмена
                    </Link>
                </div>
            </form>
        </>
    );
}
