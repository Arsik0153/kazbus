'use client';
import { FormEvent, useState } from 'react';
import { useStore } from './store';
import { Order, dateLabel } from './model';
import { Section, Field } from './ui';
export default function IssueForm({ order }: { order: Order }) {
    const { act } = useStore();
    const [text, setText] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    async function submit(e: FormEvent) {
        e.preventDefault();
        if (!text.trim() || busy) return;
        setBusy(true);
        setError('');
        try {
            if (
                await act({
                    type: 'issue',
                    id: order.id,
                    issue: {
                        id: crypto.randomUUID(),
                        text: text.trim(),
                        date: new Date().toISOString(),
                        files: [],
                    },
                })
            ) {
                setText('');
            }
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }
    return (
        <Section title="Обращения по заказу">
            {order.issues.map((i) => (
                <div className="sp-list-row" key={i.id}>
                    <p className="sp-caption">
                        {dateLabel(i.date)} · Передано менеджеру
                    </p>
                    <p>{i.text}</p>
                </div>
            ))}
            <form onSubmit={submit}>
                <Field label="Сообщить о проблеме или задать вопрос">
                    <textarea
                        required
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Опишите, что произошло"
                    />
                </Field>
                {error && (
                    <p role="alert" className="sp-error">
                        {error}
                    </p>
                )}
                <button
                    className="sp-secondary"
                    style={{ marginTop: 16 }}
                    disabled={busy || !text.trim()}
                >
                    {busy ? 'Сохраняем…' : 'Отправить обращение'}
                </button>
            </form>
        </Section>
    );
}
