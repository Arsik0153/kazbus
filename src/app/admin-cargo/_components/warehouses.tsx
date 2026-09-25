'use client';
import { cargoFormSchemas, formatCargoNumber } from '@/lib/cargo-validation';

import { Button } from '@/components/ui/button';
import {
    CargoInput,
    CargoSelect,
    CargoForm,
    Panel,
    type CargoPageProps,
} from './ui';
import { useCargoMutation } from './use-cargo-mutation';
import {
    createCargoWarehouseAction,
    createCargoStockAction,
    adjustCargoStockAction,
} from '@/actions/cargo';
import { type FormEvent } from 'react';
import { z } from 'zod';

export default function WarehousesPage({ state }: CargoPageProps) {
    const { busy, run, errorsFor } = useCargoMutation();
    async function addWarehouse(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const ok = await run('warehouse-new', () =>
            createCargoWarehouseAction({
                name: String(form.get('name') ?? ''),
                address: String(form.get('address') ?? ''),
            })
        );
        if (ok) formElement.reset();
    }

    async function addStock(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const ok = await run('stock-new', () =>
            createCargoStockAction({
                warehouseId: Number(form.get('warehouse_id')),
                shipperId: Number(form.get('shipper_id')),
                cargo: String(form.get('cargo') ?? ''),
                sku: String(form.get('sku') ?? ''),
                unit: z
                    .enum(['шт.', 'коробок', 'паллет', 'кг', 'т'])
                    .parse(form.get('unit')),
                onHand: Number(String(form.get('on_hand')).replace(',', '.')),
                source: String(form.get('source') ?? ''),
            })
        );
        if (ok) formElement.reset();
    }

    return (
        <div className="grid items-start gap-5 xl:grid-cols-[1fr_1.4fr]">
            <Panel title={`Склады · ${state.warehouses.length}`}>
                {state.warehouses.map((warehouse) => (
                    <div
                        className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#EEF2F6] bg-[#F8FAFC] p-4"
                        key={warehouse.id}
                    >
                        <strong>{warehouse.name}</strong>
                        <p className="text-muted-foreground text-sm">
                            {warehouse.address}
                        </p>
                    </div>
                ))}
                {!state.warehouses.length && (
                    <p className="text-muted-foreground text-sm">
                        Склады еще не добавлены.
                    </p>
                )}
                <CargoForm
                    serverErrors={errorsFor('warehouse-new')}
                    schema={cargoFormSchemas.warehouse}
                    className="flex flex-col gap-3"
                    onSubmit={addWarehouse}
                >
                    <h3 className="text-xl font-semibold">Добавить склад</h3>
                    <CargoInput
                        name="name"
                        aria-label="Название склада"
                        placeholder="Название"
                        required
                    />
                    <CargoInput
                        name="address"
                        aria-label="Адрес склада"
                        placeholder="Город, улица, номер"
                        required
                    />
                    <Button size="lg" disabled={!!busy}>
                        {busy === 'warehouse-new'
                            ? 'Сохраняем…'
                            : 'Добавить склад'}
                    </Button>
                </CargoForm>
            </Panel>

            <Panel title={`Остатки · ${state.stock.length}`}>
                {state.stock.map((lot) => {
                    const shipper = state.relations.find(
                        (relation) => relation.shipper.id === lot.shipper_id
                    )?.shipper;
                    return (
                        <article
                            className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#EEF2F6] bg-[#F8FAFC] p-4"
                            key={lot.id}
                        >
                            <strong>
                                {lot.cargo_description} ·{' '}
                                {formatCargoNumber(lot.on_hand)} {lot.unit}
                            </strong>
                            <p className="text-muted-foreground text-sm">
                                {lot.warehouse} ·{' '}
                                {shipper?.company ??
                                    `Клиент #${lot.shipper_id}`}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {lot.sku || 'Без SKU'} · {lot.source}
                            </p>
                            <CargoForm
                                serverErrors={errorsFor(
                                    `stock-adjust-${lot.id}`
                                )}
                                schema={cargoFormSchemas.adjustment}
                                className="flex flex-col gap-3"
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    const formElement = event.currentTarget;
                                    const form = new FormData(formElement);
                                    const ok = await run(
                                        `stock-adjust-${lot.id}`,
                                        () =>
                                            adjustCargoStockAction({
                                                lotId: lot.id,
                                                delta: Number(
                                                    String(
                                                        form.get('delta')
                                                    ).replace(',', '.')
                                                ),
                                                reason: String(
                                                    form.get('reason') ?? ''
                                                ),
                                            })
                                    );
                                    if (ok) formElement.reset();
                                }}
                            >
                                <h4 className="text-lg font-semibold">
                                    Корректировка
                                </h4>
                                <CargoInput
                                    name="delta"
                                    aria-label={`Изменение остатка ${lot.cargo_description}`}
                                    type="number"
                                    step="0.001"
                                    placeholder="+25 или -5"
                                    required
                                />
                                <CargoInput
                                    name="reason"
                                    aria-label={`Причина корректировки ${lot.cargo_description}`}
                                    placeholder="Приемка, инвентаризация…"
                                    required
                                />
                                <Button
                                    variant="outline"
                                    size="lg"
                                    disabled={!!busy}
                                >
                                    {busy === `stock-adjust-${lot.id}`
                                        ? 'Сохраняем…'
                                        : 'Изменить остаток'}
                                </Button>
                            </CargoForm>
                        </article>
                    );
                })}
                {!state.stock.length && (
                    <p className="text-muted-foreground text-sm">
                        Складских партий еще нет.
                    </p>
                )}
                <CargoForm
                    serverErrors={errorsFor('stock-new')}
                    schema={cargoFormSchemas.stock}
                    className="flex flex-col gap-3"
                    onSubmit={addStock}
                >
                    <h3 className="text-xl font-semibold">
                        Принять груз на склад
                    </h3>
                    <CargoSelect
                        name="warehouse_id"
                        aria-label="Склад"
                        defaultValue=""
                        required
                    >
                        <option value="" disabled>
                            Выберите склад
                        </option>
                        {state.warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                            </option>
                        ))}
                    </CargoSelect>
                    <CargoSelect
                        name="shipper_id"
                        aria-label="Клиент"
                        defaultValue=""
                        required
                    >
                        <option value="" disabled>
                            Выберите клиента
                        </option>
                        {state.relations
                            .filter(
                                (relation) => relation.status === 'confirmed'
                            )
                            .map((relation) => (
                                <option
                                    key={relation.shipper.id}
                                    value={relation.shipper.id}
                                >
                                    {relation.shipper.company}
                                </option>
                            ))}
                    </CargoSelect>
                    <CargoInput
                        name="cargo"
                        aria-label="Описание груза"
                        placeholder="Груз"
                        required
                    />
                    <CargoInput
                        name="sku"
                        aria-label="SKU груза"
                        placeholder="SKU"
                    />
                    <CargoSelect name="unit" aria-label="Единица измерения">
                        {['шт.', 'коробок', 'паллет', 'кг', 'т'].map((unit) => (
                            <option key={unit}>{unit}</option>
                        ))}
                    </CargoSelect>
                    <CargoInput
                        name="on_hand"
                        aria-label="Количество на складе"
                        type="number"
                        min="0"
                        step="0.001"
                        placeholder="Количество"
                        required
                    />
                    <CargoInput
                        name="source"
                        aria-label="Источник поступления"
                        placeholder="Приемка, накладная…"
                        required
                    />
                    <Button
                        size="lg"
                        disabled={
                            !!busy ||
                            !state.warehouses.length ||
                            !state.relations.some(
                                (relation) => relation.status === 'confirmed'
                            )
                        }
                    >
                        {busy === 'stock-new'
                            ? 'Сохраняем…'
                            : 'Добавить партию'}
                    </Button>
                </CargoForm>
            </Panel>
        </div>
    );
}
