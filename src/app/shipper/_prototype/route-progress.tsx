import { Order, dateLabel } from './model';
import { Section, Empty } from './ui';
export default function RouteProgress({ o }: { o: Order }) {
    const current = o.stages.find((s) => s.status === 'current');
    return (
        <Section title="Путь груза">
            <div className="sp-facts">
                <div>
                    <p className="sp-muted">Сейчас</p>
                    <strong>
                        {o.status === 'delivered'
                            ? 'У получателя'
                            : current
                              ? `${current.transport} · ${current.from.split(',')[0]} → ${current.to.split(',')[0]}`
                              : 'Ожидаем организацию перевозки'}
                    </strong>
                </div>
                <div>
                    <p className="sp-muted">Ожидаемая доставка</p>
                    <strong>{dateLabel(o.date)}</strong>
                </div>
            </div>
            {o.stages.length ? (
                <>
                    <div className="sp-route-strip" aria-label="Схема маршрута">
                        {[o.stages[0].from, ...o.stages.map((s) => s.to)].map(
                            (p, i) => (
                                <span
                                    key={i}
                                    className={`sp-route-stop ${o.stages[i]?.status === 'current' ? 'active' : ''}`}
                                >
                                    {i + 1}. {p.split(',')[0]}
                                    {i >= 3 && (
                                        <span style={{ display: 'block' }}>
                                            {
                                                [
                                                    'Терминал',
                                                    'Склад',
                                                    'Магазин',
                                                ][i - 3]
                                            }
                                        </span>
                                    )}
                                </span>
                            )
                        )}
                    </div>
                    <p className="sp-caption">
                        Данные этапов предоставляет логистическая компания.
                        Обновлено {dateLabel(o.updated)},{' '}
                        {new Date(o.updated).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        .
                    </p>
                    <ol className="sp-timeline" style={{ marginTop: 28 }}>
                        {o.stages.map((s, i) => (
                            <li key={s.id} className={`sp-stage-${s.status}`}>
                                <span className="sp-dot" />
                                <strong>
                                    {i + 1}. {s.transport}
                                </strong>
                                <p>
                                    {s.from} → {s.to}
                                </p>
                                <p className="sp-muted">
                                    {s.status === 'done'
                                        ? 'Завершён'
                                        : s.status === 'current'
                                          ? 'Текущий этап'
                                          : 'Далее'}{' '}
                                    · {dateLabel(s.date)}
                                </p>
                                <details>
                                    <summary>
                                        Контакты участников ·{' '}
                                        {s.contacts.length}
                                    </summary>
                                    <div className="sp-contacts">
                                        {s.contacts.map((c, j) => (
                                            <div key={j}>
                                                <p>
                                                    {c.name} · {c.role}
                                                </p>
                                                <a href={`tel:${c.phone}`}>
                                                    {c.phone}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            </li>
                        ))}
                    </ol>
                </>
            ) : (
                <Empty>
                    Компания подготовит маршрут после согласования стоимости и
                    назначения рейса.
                </Empty>
            )}
        </Section>
    );
}
