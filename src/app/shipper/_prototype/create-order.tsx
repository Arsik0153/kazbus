'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from './store';
import { Unit, units, localDate, reserved } from './model';
import { saveFiles } from './files';
import { Heading, Field, Section, Back } from './ui';

function parseUnit(value: string): Unit {
    switch (value) {
        case 'шт.':
        case 'коробок':
        case 'паллет':
        case 'кг':
        case 'т':
            return value;
        default:
            return 'коробок';
    }
}

export default function CreateOrder({ batchId }: { batchId?: string }) {
    const { state, act } = useStore();
    const router = useRouter();
    const batch = state.batches.find((b) => b.id === batchId);
    const companies = state.companies.filter((c) => c.relation === 'confirmed');
    const [companyId, setCompany] = useState(
        batch?.companyId || companies[0]?.id || ''
    );
    const [from, setFrom] = useState(batch?.warehouse || '');
    const [to, setTo] = useState('');
    const [pickup, setPickup] = useState(localDate());
    const [date, setDate] = useState('');
    const [cargo, setCargo] = useState(batch?.cargo || '');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<Unit>(batch?.unit || 'коробок');
    const [weight, setWeight] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [comment, setComment] = useState('');
    const [files, setFiles] = useState<File[]>([]);
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
        if (batch && Number(quantity) > batch.onHand - reserved(state, batch)) {
            setError('Количество превышает доступный остаток.');
            return;
        }
        setBusy(true);
        try {
            const attachments = files.length ? await saveFiles(files) : [];
            const id = `JL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
            const receipt = act(
                {
                    type: 'create',
                    order: {
                        id,
                        companyId,
                        from: from.trim(),
                        to: to.trim(),
                        pickup,
                        date,
                        cargo: cargo.trim(),
                        quantity: Number(quantity),
                        unit,
                        weight,
                        dimensions,
                        comment,
                        status: 'waiting',
                        stages: [],
                        updated: new Date().toISOString(),
                        files: attachments,
                        issues: [],
                        batchId: batch?.id,
                    },
                },
                { success: `Заказ ${id} создан и отправлен компании.` }
            );
            if (receipt.ok) router.push(`/shipper/orders/${id}`);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : 'Не удалось сохранить вложения.'
            );
        } finally {
            setBusy(false);
        }
    }
    if (batchId && !batch)
        return (
            <>
                <Back />
                <Heading title="Партия не найдена" />
                <Link className="sp-link" href="/shipper/storage">
                    Открыть складские остатки
                </Link>
            </>
        );
    if (!companies.length)
        return (
            <>
                <Back />
                <Heading title="Сначала подключите компанию">
                    Новый заказ можно отправить только подтверждённой
                    логистической компании.
                </Heading>
                <div className="sp-panel sp-blocking-state">
                    <h2>Создание заказа пока недоступно</h2>
                    <p className="sp-muted">
                        В разделе компаний введите код приглашения или запросите
                        сотрудничество. После подтверждения здесь появится форма
                        заказа.
                    </p>
                    <Link className="sp-button" href="/shipper/companies">
                        Открыть компании
                    </Link>
                </div>
            </>
        );
    return (
        <>
            <Back />
            <Heading
                eyebrow={batch ? 'Отправка со склада' : 'Новая доставка'}
                title={batch ? 'Куда отправить груз?' : 'Создать заказ'}
            >
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
                                disabled={!!batch}
                            >
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <div className="sp-muted">
                            {batch
                                ? `Доступно: ${batch.onHand - reserved(state, batch)} ${batch.unit}`
                                : 'Заказ получит выбранная компания. Начало перевозки — после согласования предложения.'}
                        </div>
                        <Field label="Откуда забрать · город и адрес">
                            <input
                                required
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                readOnly={!!batch}
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
                                    readOnly={!!batch}
                                    placeholder="Например, посуда в коробках"
                                />
                            </Field>
                        </div>
                        <Field label="Количество">
                            <input
                                type="number"
                                min="0.001"
                                step="any"
                                max={
                                    batch
                                        ? batch.onHand - reserved(state, batch)
                                        : undefined
                                }
                                required
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </Field>
                        <Field label="Единица измерения">
                            <select
                                value={unit}
                                onChange={(e) =>
                                    setUnit(parseUnit(e.target.value))
                                }
                                disabled={!!batch}
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
                        <div className="sp-field-wide">
                            <Field label="Фото груза · необязательно">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) =>
                                        setFiles(
                                            Array.from(e.target.files || [])
                                        )
                                    }
                                />
                            </Field>
                            <p className="sp-caption">
                                Изображения до 10 МБ. Фотографии сохраняются
                                только в этом браузере.
                            </p>
                        </div>
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
                    <button className="sp-button" disabled={busy}>
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
