'use client';
import { cargoFormSchemas, formatCargoNumber } from '@/lib/cargo-validation';

import { Button } from '@/components/ui/button';
import { CargoInput, CargoForm, Panel, type CargoPageProps } from './ui';
import { useCargoMutation } from './use-cargo-mutation';
import { createCargoVehicleAction } from '@/actions/cargo';
import { type FormEvent } from 'react';

export default function VehiclesPage({ state }: CargoPageProps) {
    const { busy, run, errorsFor } = useCargoMutation();
    async function addVehicle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const ok = await run('vehicle-new', () =>
            createCargoVehicleAction({
                model: String(form.get('model') ?? ''),
                plate_number: String(form.get('plate_number') ?? ''),
                trailer_number: String(form.get('trailer_number') ?? ''),
                kind: String(form.get('kind') ?? ''),
                capacity_tons: Number(
                    String(form.get('capacity_tons')).replace(',', '.')
                ),
                status: 'active',
            })
        );
        if (ok) formElement.reset();
    }

    return (
        <div className="grid items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
            <Panel title={`Автопарк · ${state.vehicles.length}`}>
                {!state.vehicles.length && (
                    <p className="text-muted-foreground">
                        Автомобили ещё не добавлены.
                    </p>
                )}
                {state.vehicles.map((vehicle) => (
                    <div
                        className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#EEF2F6] bg-[#F8FAFC] p-4"
                        key={vehicle.id}
                    >
                        <strong>
                            {vehicle.model} · {vehicle.plate_number}
                        </strong>
                        <p className="text-muted-foreground text-sm">
                            {vehicle.kind} ·{' '}
                            {formatCargoNumber(vehicle.capacity_tons)} т
                        </p>
                    </div>
                ))}
            </Panel>
            <Panel title="Добавить машину">
                <CargoForm
                    serverErrors={errorsFor('vehicle-new')}
                    schema={cargoFormSchemas.vehicle}
                    className="flex flex-col gap-3"
                    onSubmit={addVehicle}
                >
                    <CargoInput
                        name="model"
                        aria-label="Модель машины"
                        placeholder="Модель"
                        required
                    />
                    <CargoInput
                        name="plate_number"
                        aria-label="Государственный номер машины"
                        placeholder="Госномер"
                        required
                    />
                    <CargoInput
                        name="trailer_number"
                        aria-label="Номер прицепа"
                        placeholder="Номер прицепа"
                    />
                    <CargoInput
                        name="kind"
                        aria-label="Тип машины"
                        placeholder="Тип машины"
                        required
                    />
                    <CargoInput
                        name="capacity_tons"
                        aria-label="Грузоподъемность в тоннах"
                        type="number"
                        min="0.001"
                        step="0.001"
                        placeholder="Грузоподъемность, т"
                        required
                    />
                    <Button size="lg" disabled={!!busy}>
                        Добавить
                    </Button>
                </CargoForm>
            </Panel>
        </div>
    );
}
