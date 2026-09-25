'use client';
import { formatCargoPhone } from '@/lib/cargo-validation';

import { Button } from '@/components/ui/button';
import { Panel, type CargoPageProps } from './ui';
import { useCargoMutation } from './use-cargo-mutation';
import { decideCargoRelationAction } from '@/actions/cargo';

const relationStatusNames: Record<string, string> = {
    requested: 'Ожидает решения',
    confirmed: 'Сотрудничество подтверждено',
    rejected: 'Запрос отклонен',
    blocked: 'Клиент заблокирован',
};

export default function ClientsPage({ state }: CargoPageProps) {
    const { busy, run } = useCargoMutation();

    return (
        <>
            <Panel title={`Запросы клиентов · ${state.relations.length}`}>
                <div className="flex flex-col gap-3">
                    {state.relations.map((relation) => (
                        <article
                            className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#EEF2F6] bg-[#F8FAFC] p-4"
                            key={relation.id}
                        >
                            <strong>{relation.shipper.company}</strong>
                            <p className="text-muted-foreground text-sm">
                                {relation.shipper.name} ·{' '}
                                {relation.shipper.city} ·{' '}
                                {formatCargoPhone(relation.shipper.phone)}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {relationStatusNames[relation.status]}
                            </p>
                            {relation.status === 'requested' && (
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        size="lg"
                                        disabled={!!busy}
                                        onClick={() =>
                                            run(`relation-${relation.id}`, () =>
                                                decideCargoRelationAction({
                                                    relationId: relation.id,
                                                    decision: 'confirm',
                                                    comment: '',
                                                })
                                            )
                                        }
                                    >
                                        Подтвердить
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        disabled={!!busy}
                                        onClick={() =>
                                            run(`relation-${relation.id}`, () =>
                                                decideCargoRelationAction({
                                                    relationId: relation.id,
                                                    decision: 'reject',
                                                    comment:
                                                        'Запрос отклонен компанией',
                                                })
                                            )
                                        }
                                    >
                                        Отклонить
                                    </Button>
                                </div>
                            )}
                        </article>
                    ))}
                    {!state.relations.length && (
                        <p className="text-muted-foreground text-sm">
                            Новых запросов нет.
                        </p>
                    )}
                </div>
            </Panel>
        </>
    );
}
