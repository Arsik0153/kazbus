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
    assignCargoOrderAction,
    createCargoOfferAction,
    rejectCargoOrderAction,
} from '@/actions/cargo';
import CargoFileList from '@/components/cargo/cargo-file-list';

const statusNames: Record<string, string> = {
    waiting: 'Ждет предложения',
    offer: 'Предложение отправлено',
    planned: 'Рейс назначен',
    transit: 'В пути',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
    rejected: 'Отклонен',
};

export default function OrdersPage({ state, currentUserId }: CargoPageProps) {
    const { busy, run, errorsFor } = useCargoMutation();

    return (
        <>
            <section className="mt-6" id="orders">
                <h2 className="mb-4 text-2xl font-bold">
                    Заказы · {state.orders.length}
                </h2>
                {!state.orders.length && (
                    <Panel title="Заказов пока нет">
                        <p className="text-muted-foreground">
                            Здесь появятся заявки грузоотправителей.
                        </p>
                    </Panel>
                )}
                <div className="grid items-start gap-5 xl:grid-cols-2">
                    {state.orders.map((order) => {
                        const assigned = state.trips.some(
                            (trip) => trip.orderRecordId === order.recordId
                        );
                        return (
                            <article
                                id={`order-${order.recordId}`}
                                className="flex scroll-mt-6 flex-col gap-5 rounded-[20px] bg-white p-5 md:p-8"
                                key={order.recordId}
                            >
                                <p className="text-primary text-sm font-semibold">
                                    {order.id} ·{' '}
                                    {order.status === 'planned'
                                        ? assigned
                                            ? 'Рейс назначен'
                                            : 'Согласован'
                                        : statusNames[order.status]}
                                </p>
                                <h3 className="text-xl font-semibold">
                                    {order.from} → {order.to}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {order.shipper.company} · {order.cargo} ·{' '}
                                    {formatCargoNumber(order.quantity)}{' '}
                                    {order.unit}
                                </p>

                                <CargoFileList
                                    feedback="toast"
                                    title="Документы заказа"
                                    endpoint={`/api/cargo/orders/${order.recordId}/attachments`}
                                    fileScope="order"
                                    initialFiles={order.files}
                                    currentUserId={currentUserId}
                                    uploadKinds={
                                        order.status === 'delivered'
                                            ? [
                                                  {
                                                      value: 'document',
                                                      label: 'Документ',
                                                  },
                                                  {
                                                      value: 'delivery_proof',
                                                      label: 'Подтверждение доставки',
                                                  },
                                              ]
                                            : [
                                                  {
                                                      value: 'document',
                                                      label: 'Документ',
                                                  },
                                              ]
                                    }
                                />

                                {['waiting', 'offer'].includes(
                                    order.status
                                ) && (
                                    <CargoForm
                                        serverErrors={errorsFor(
                                            `offer-${order.recordId}`
                                        )}
                                        schema={cargoFormSchemas.offer.refine(
                                            (value) =>
                                                value.eta >= order.pickup,
                                            {
                                                path: ['eta'],
                                                message:
                                                    'Доставка не может быть раньше даты забора',
                                            }
                                        )}
                                        className="flex flex-col gap-3"
                                        onSubmit={async (event) => {
                                            event.preventDefault();
                                            const form = new FormData(
                                                event.currentTarget
                                            );
                                            await run(
                                                `offer-${order.recordId}`,
                                                () =>
                                                    createCargoOfferAction({
                                                        orderId: order.recordId,
                                                        kind: 'offer',
                                                        amount: String(
                                                            form.get(
                                                                'amount'
                                                            ) ?? ''
                                                        ),
                                                        eta: String(
                                                            form.get('eta') ??
                                                                ''
                                                        ),
                                                        routeText: `${order.from} - ${order.to}`,
                                                        reason: String(
                                                            form.get(
                                                                'reason'
                                                            ) ?? ''
                                                        ),
                                                    })
                                            );
                                        }}
                                    >
                                        <h4 className="text-lg font-semibold">
                                            Предложить перевозку
                                        </h4>
                                        <CargoInput
                                            name="amount"
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            placeholder="Стоимость, ₸"
                                            required
                                        />
                                        <CargoInput
                                            name="eta"
                                            min={order.pickup}
                                            type="date"
                                            required
                                        />
                                        <CargoInput
                                            name="reason"
                                            placeholder="Что входит в стоимость"
                                            required
                                        />
                                        <Button size="lg" disabled={!!busy}>
                                            Отправить предложение
                                        </Button>
                                    </CargoForm>
                                )}

                                {order.status === 'planned' && !assigned && (
                                    <CargoForm
                                        serverErrors={errorsFor(
                                            `assign-${order.recordId}`
                                        )}
                                        schema={cargoFormSchemas.assignment.refine(
                                            (value) =>
                                                value.eta >= order.pickup,
                                            {
                                                path: ['eta'],
                                                message:
                                                    'Доставка не может быть раньше даты забора',
                                            }
                                        )}
                                        className="flex flex-col gap-3"
                                        onSubmit={async (event) => {
                                            event.preventDefault();
                                            const form = new FormData(
                                                event.currentTarget
                                            );
                                            await run(
                                                `assign-${order.recordId}`,
                                                () =>
                                                    assignCargoOrderAction({
                                                        orderId: order.recordId,
                                                        driverId: Number(
                                                            form.get(
                                                                'driver_id'
                                                            )
                                                        ),
                                                        vehicleId: Number(
                                                            form.get(
                                                                'vehicle_id'
                                                            )
                                                        ),
                                                        eta: String(
                                                            form.get('eta') ??
                                                                ''
                                                        ),
                                                    })
                                            );
                                        }}
                                    >
                                        <h4 className="text-lg font-semibold">
                                            Назначить рейс
                                        </h4>
                                        <CargoSelect name="driver_id" required>
                                            <option value="">Водитель</option>
                                            {state.drivers
                                                .filter(
                                                    (driver) =>
                                                        driver.status ===
                                                            'active' &&
                                                        driver.account_status ===
                                                            'active'
                                                )
                                                .map((driver) => (
                                                    <option
                                                        key={driver.id}
                                                        value={driver.id}
                                                    >
                                                        {driver.full_name}
                                                    </option>
                                                ))}
                                        </CargoSelect>
                                        <CargoSelect name="vehicle_id" required>
                                            <option value="">Машина</option>
                                            {state.vehicles
                                                .filter(
                                                    (vehicle) =>
                                                        vehicle.status ===
                                                        'active'
                                                )
                                                .map((vehicle) => (
                                                    <option
                                                        key={vehicle.id}
                                                        value={vehicle.id}
                                                    >
                                                        {vehicle.model} ·{' '}
                                                        {vehicle.plate_number}
                                                    </option>
                                                ))}
                                        </CargoSelect>
                                        <CargoInput
                                            name="eta"
                                            min={order.pickup}
                                            type="date"
                                            defaultValue={order.date}
                                            required
                                        />
                                        <Button size="lg" disabled={!!busy}>
                                            Назначить
                                        </Button>
                                    </CargoForm>
                                )}

                                {['planned', 'transit'].includes(
                                    order.status
                                ) && (
                                    <details className="mt-4">
                                        <summary>Добавить доплату</summary>
                                        <CargoForm
                                            serverErrors={errorsFor(
                                                `surcharge-${order.recordId}`
                                            )}
                                            schema={cargoFormSchemas.offer.refine(
                                                (value) =>
                                                    value.eta >= order.pickup,
                                                {
                                                    path: ['eta'],
                                                    message:
                                                        'Доставка не может быть раньше даты забора',
                                                }
                                            )}
                                            className="flex flex-col gap-3"
                                            onSubmit={async (event) => {
                                                event.preventDefault();
                                                const form = new FormData(
                                                    event.currentTarget
                                                );
                                                await run(
                                                    `surcharge-${order.recordId}`,
                                                    () =>
                                                        createCargoOfferAction({
                                                            orderId:
                                                                order.recordId,
                                                            kind: 'surcharge',
                                                            amount: String(
                                                                form.get(
                                                                    'amount'
                                                                ) ?? ''
                                                            ),
                                                            eta: String(
                                                                form.get(
                                                                    'eta'
                                                                ) ?? ''
                                                            ),
                                                            routeText: '',
                                                            reason: String(
                                                                form.get(
                                                                    'reason'
                                                                ) ?? ''
                                                            ),
                                                        })
                                                );
                                            }}
                                        >
                                            <CargoInput
                                                name="amount"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                placeholder="Сумма, ₸"
                                                required
                                            />
                                            <CargoInput
                                                name="eta"
                                                min={order.pickup}
                                                type="date"
                                                defaultValue={order.date}
                                                required
                                            />
                                            <CargoInput
                                                name="reason"
                                                placeholder="Причина"
                                                required
                                            />
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                disabled={!!busy}
                                            >
                                                Отправить на согласование
                                            </Button>
                                        </CargoForm>
                                    </details>
                                )}

                                {['waiting', 'offer'].includes(
                                    order.status
                                ) && (
                                    <Button
                                        variant="link"
                                        className="mt-4"
                                        disabled={!!busy}
                                        onClick={() =>
                                            run(
                                                `reject-${order.recordId}`,
                                                () =>
                                                    rejectCargoOrderAction({
                                                        orderId: order.recordId,
                                                        reason: 'Компания не может выполнить заказ',
                                                    })
                                            )
                                        }
                                    >
                                        Отклонить заказ
                                    </Button>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
