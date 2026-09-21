'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { executeDriverCommand, type DriverCommand } from '../_api/actions';
import {
    nextStatus,
    passengerLabels,
    statusLabels,
    type DriverMode,
    type DriverWorkspace,
} from '../_api/schema';
import BusDriverLogoutMenu from './BusDriverLogoutMenu';
import TicketCamera from './TicketCamera';
import LiveSeatMap from './LiveSeatMap';

const card = 'rounded-xl border border-[#D1D1D1] bg-white p-5';
const button =
    'rounded-xl bg-[#E23333] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50';
const field =
    'w-full rounded-lg border border-[#D1D1D1] bg-white p-3 text-base';
const titles: Record<DriverMode, string> = {
    home: 'Мои рейсы',
    trip: 'Рейс',
    passengers: 'Посадка пассажиров',
    history: 'История рейсов',
    vehicle: 'Автобус',
    profile: 'Профиль',
    issues: 'Сообщить о ситуации',
    seats: 'Места в автобусе',
};

export default function DriverWorkspaceView({
    workspace,
    mode,
    date,
    tripId,
    runId,
}: {
    workspace: DriverWorkspace;
    mode: DriverMode;
    date: string;
    tripId?: string;
    runId?: string;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [notice, setNotice] = useState('');
    const [query, setQuery] = useState('');
    const [payload, setPayload] = useState('');
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const selected =
        runId || tripId
            ? workspace.trips.find(
                  (item) =>
                      (!runId || item.run.id === runId) &&
                      (!tripId || String(item.trip.id) === tripId)
              )
            : workspace.trips[0];
    const run = selected?.run;
    const closed = run?.status === 'arrival' || mode === 'history';
    function href(path: string, item = selected) {
        return item
            ? `${path}?date=${item.run.dateIso}&tripId=${item.trip.id}&runId=${item.run.id}`
            : path;
    }
    function send(command: DriverCommand) {
        setNotice('');
        startTransition(async () => {
            const result = await executeDriverCommand(command);
            setNotice(result.ok ? 'Изменения сохранены.' : result.message);
            if (result.ok) {
                setPayload('');
                if (command.kind === 'incident') {
                    setTitle('');
                    setComment('');
                }
                router.refresh();
            }
        });
    }
    function scan(value: string) {
        if (!selected || pending) return;
        send({
            kind: 'scan',
            tripId: selected.trip.id,
            runId: selected.run.id,
            payload: value,
        });
    }
    const passengers =
        run?.passengers.filter((p) =>
            `${p.fullName} ${p.ticketNumber} ${p.seatNumber}`
                .toLowerCase()
                .includes(query.toLowerCase())
        ) || [];
    const boarded =
        run?.passengers.filter((p) => p.status === 'boarded').length || 0;
    const following = run && nextStatus[run.status];

    return (
        <main className="min-h-screen min-w-0 bg-[#F4F4F4] px-5 pt-20 pb-32 text-[#4A4A4A]">
            <div className="mx-auto max-w-3xl space-y-5">
                <header>
                    <p className="mb-2 text-sm text-[#777]">
                        {workspace.driver.full_name}
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {titles[mode]}
                    </h1>
                </header>
                {mode !== 'profile' && mode !== 'history' && (
                    <form
                        className="flex flex-wrap items-end gap-3"
                        method="get"
                    >
                        <label className="min-w-0 flex-1 text-sm">
                            Дата рейса
                            <input
                                className={`${field} mt-1`}
                                type="date"
                                name="date"
                                defaultValue={date}
                                required
                            />
                        </label>
                        <button className={button}>Показать</button>
                    </form>
                )}
                {notice && (
                    <p
                        role="status"
                        className="rounded-lg border border-[#D1D1D1] bg-white p-4"
                    >
                        {notice}
                    </p>
                )}
                {mode === 'profile' ? (
                    <section className={card}>
                        <h2 className="text-xl font-semibold">
                            {workspace.driver.full_name}
                        </h2>
                        <a
                            href={`tel:+${workspace.driver.phone_number}`}
                            className="my-3 block underline"
                        >
                            +{workspace.driver.phone_number}
                        </a>
                        <p>Водитель №{workspace.driver.id}</p>
                        <p className="mt-2">
                            {workspace.driver.is_active
                                ? 'Аккаунт активен'
                                : 'Аккаунт отключён'}
                        </p>
                        <BusDriverLogoutMenu />
                    </section>
                ) : (
                    <>
                        {(runId || tripId) && !selected && (
                            <section className={card} role="alert">
                                <h2 className="text-lg font-semibold">
                                    Рейс не найден
                                </h2>
                                <p className="mt-2">
                                    Выберите назначенный рейс на нужную дату.
                                </p>
                                <Link
                                    className="mt-3 inline-block underline"
                                    href={`/busdriver?date=${date}`}
                                >
                                    К списку рейсов
                                </Link>
                            </section>
                        )}
                        {workspace.trips.length === 0 && (
                            <section className={card}>
                                <h2 className="text-lg font-semibold">
                                    {mode === 'history'
                                        ? 'Завершённых рейсов пока нет'
                                        : 'На эту дату нет назначенных рейсов'}
                                </h2>
                                <p className="mt-2 text-sm">
                                    {mode === 'history'
                                        ? 'Здесь появятся выполненные рейсы и списки пассажиров.'
                                        : 'Выберите другую дату или уточните назначение у диспетчера.'}
                                </p>
                            </section>
                        )}
                        {(mode === 'home' ||
                            mode === 'history' ||
                            workspace.trips.length > 1) && (
                            <div className="space-y-3">
                                {workspace.trips.map((item) => (
                                    <Link
                                        href={href(
                                            mode === 'history'
                                                ? '/busdriver/history'
                                                : '/busdriver/trip',
                                            item
                                        )}
                                        className={`${card} block ${item.run.id === run?.id ? 'border-[#E23333]' : ''}`}
                                        key={item.run.id}
                                    >
                                        <p className="font-semibold">
                                            {item.run.routeLabel}
                                        </p>
                                        <p className="mt-1 text-sm">
                                            {item.run.tripDate},{' '}
                                            {item.run.departureTime} ·{' '}
                                            {statusLabels[item.run.status]}
                                        </p>
                                        <p className="mt-1 text-sm text-[#777]">
                                            {item.trip.bus.name} ·{' '}
                                            {item.trip.bus.state_number}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {selected && run && (
                            <>
                                {mode !== 'home' && (
                                    <section className={card}>
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-xl font-bold">
                                                    {run.routeLabel}
                                                </h2>
                                                <p className="mt-2 text-sm">
                                                    {run.tripDate} ·{' '}
                                                    {run.departureTime}
                                                    {run.arrivalTime
                                                        ? ` – ${run.arrivalTime}`
                                                        : ''}
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-red-50 px-3 py-2 text-xs text-[#E23333]">
                                                {statusLabels[run.status]}
                                            </span>
                                        </div>
                                        <p className="mt-4 text-sm">
                                            На рейсе {boarded} из{' '}
                                            {run.passengers.length} пассажиров ·
                                            Вместимость {run.passengerCapacity}
                                        </p>
                                        {mode !== 'history' && (
                                            <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-3 text-sm font-semibold text-[#E23333]">
                                                <Link
                                                    href={href(
                                                        '/busdriver/trip'
                                                    )}
                                                >
                                                    Этапы
                                                </Link>
                                                <Link
                                                    href={href(
                                                        '/busdriver/passengers'
                                                    )}
                                                >
                                                    Пассажиры
                                                </Link>
                                                <Link
                                                    href={href(
                                                        '/busdriver/seats'
                                                    )}
                                                >
                                                    Места
                                                </Link>
                                                <Link
                                                    href={href(
                                                        '/busdriver/vehicle'
                                                    )}
                                                >
                                                    Автобус
                                                </Link>
                                                <Link
                                                    href={href(
                                                        '/busdriver/issues'
                                                    )}
                                                >
                                                    Сообщить о ситуации
                                                </Link>
                                            </nav>
                                        )}
                                    </section>
                                )}
                                {mode === 'trip' && (
                                    <section className={card}>
                                        <ol className="space-y-4">
                                            {run.steps.map((step) => (
                                                <li
                                                    key={step.id}
                                                    className={
                                                        step.state ===
                                                        'upcoming'
                                                            ? 'text-[#999]'
                                                            : ''
                                                    }
                                                >
                                                    <p className="font-semibold">
                                                        {step.state === 'done'
                                                            ? '✓ '
                                                            : ''}
                                                        {step.title}
                                                    </p>
                                                    <p className="mt-1 text-sm">
                                                        {step.description}
                                                    </p>
                                                </li>
                                            ))}
                                        </ol>
                                        {following && (
                                            <button
                                                disabled={pending}
                                                className={`${button} mt-5 w-full`}
                                                onClick={() =>
                                                    send({
                                                        kind: 'status',
                                                        tripId: selected.trip
                                                            .id,
                                                        runId: run.id,
                                                        status: following,
                                                    })
                                                }
                                            >
                                                {pending
                                                    ? 'Сохраняем…'
                                                    : statusLabels[following]}
                                            </button>
                                        )}
                                    </section>
                                )}
                                {mode === 'vehicle' && (
                                    <section className={card}>
                                        <h2 className="text-xl font-semibold">
                                            {selected.trip.bus.name}
                                        </h2>
                                        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                            <dt>Госномер</dt>
                                            <dd>
                                                {selected.trip.bus.state_number}
                                            </dd>
                                            <dt>Мест</dt>
                                            <dd>
                                                {
                                                    selected.trip.bus
                                                        .count_of_seats
                                                }
                                            </dd>
                                            <dt>Этажей</dt>
                                            <dd>{selected.trip.bus.floors}</dd>
                                            <dt>Wi-Fi</dt>
                                            <dd>
                                                {selected.trip.bus.have_wifi
                                                    ? 'Есть'
                                                    : 'Нет'}
                                            </dd>
                                            <dt>Туалет</dt>
                                            <dd>
                                                {selected.trip.bus.have_toilet
                                                    ? 'Есть'
                                                    : 'Нет'}
                                            </dd>
                                            <dt>Лежачие места</dt>
                                            <dd>
                                                {selected.trip.bus.is_recumbent
                                                    ? 'Есть'
                                                    : 'Нет'}
                                            </dd>
                                        </dl>
                                    </section>
                                )}
                                {mode === 'seats' && (
                                    <LiveSeatMap assignment={selected} />
                                )}
                                {(mode === 'passengers' ||
                                    mode === 'history' ||
                                    mode === 'seats') && (
                                    <section className="space-y-4">
                                        {mode === 'passengers' && !closed && (
                                            <div className={card}>
                                                <h2 className="mb-3 font-semibold">
                                                    Проверка QR-кода
                                                </h2>
                                                <TicketCamera
                                                    disabled={pending}
                                                    onScan={scan}
                                                />
                                                <details className="mt-4">
                                                    <summary className="cursor-pointer text-sm underline">
                                                        Ввести код билета
                                                        вручную
                                                    </summary>
                                                    <form
                                                        className="mt-3 space-y-3"
                                                        onSubmit={(event) => {
                                                            event.preventDefault();
                                                            scan(payload);
                                                        }}
                                                    >
                                                        <label className="block text-sm">
                                                            Код билета
                                                            <textarea
                                                                aria-label="Код билета"
                                                                className={`${field} mt-1`}
                                                                value={payload}
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setPayload(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                rows={2}
                                                                maxLength={
                                                                    10000
                                                                }
                                                                required
                                                            />
                                                        </label>
                                                        <button
                                                            className={button}
                                                            disabled={
                                                                pending ||
                                                                !payload.trim()
                                                            }
                                                        >
                                                            Проверить и посадить
                                                        </button>
                                                    </form>
                                                </details>
                                                <p className="mt-3 text-sm text-[#777]">
                                                    Если камера недоступна,
                                                    найдите пассажира в списке и
                                                    отметьте посадку после
                                                    проверки билета.
                                                </p>
                                            </div>
                                        )}
                                        <label className="block text-sm">
                                            Поиск пассажира
                                            <input
                                                className={`${field} mt-1`}
                                                value={query}
                                                onChange={(event) =>
                                                    setQuery(event.target.value)
                                                }
                                                placeholder="Имя, номер билета или место"
                                            />
                                        </label>
                                        {passengers.length === 0 && (
                                            <p className={card}>
                                                Пассажиры не найдены.
                                            </p>
                                        )}
                                        {passengers.map((passenger) => (
                                            <article
                                                key={passenger.id}
                                                className={card}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="font-semibold">
                                                        {passenger.fullName}
                                                    </h3>
                                                    <span className="shrink-0 rounded-lg bg-[#F4F4F4] px-3 py-2 text-sm">
                                                        Место{' '}
                                                        {passenger.seatNumber}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm">
                                                    {passenger.ticketNumber} ·{' '}
                                                    {passenger.fareLabel}
                                                </p>
                                                <p className="mt-2 text-sm">
                                                    {passenger.boardingPoint} →{' '}
                                                    {passenger.destination}
                                                </p>
                                                <p className="mt-2 text-sm font-semibold">
                                                    {
                                                        passengerLabels[
                                                            passenger.status
                                                        ]
                                                    }
                                                </p>
                                                {mode === 'passengers' &&
                                                    !closed && (
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            {(
                                                                [
                                                                    'boarded',
                                                                    'missed',
                                                                    'waiting',
                                                                ] as const
                                                            )
                                                                .filter(
                                                                    (value) =>
                                                                        value !==
                                                                        passenger.status
                                                                )
                                                                .map(
                                                                    (
                                                                        status
                                                                    ) => (
                                                                        <button
                                                                            key={
                                                                                status
                                                                            }
                                                                            className={
                                                                                status ===
                                                                                'boarded'
                                                                                    ? button
                                                                                    : 'rounded-lg border border-[#D1D1D1] px-3 py-2 text-sm disabled:opacity-50'
                                                                            }
                                                                            disabled={
                                                                                pending ||
                                                                                (status ===
                                                                                    'boarded' &&
                                                                                    passenger.ticketStatus !==
                                                                                        'Payed')
                                                                            }
                                                                            onClick={() =>
                                                                                send(
                                                                                    {
                                                                                        kind: 'passenger',
                                                                                        tripId: selected
                                                                                            .trip
                                                                                            .id,
                                                                                        runId: run.id,
                                                                                        passengerId:
                                                                                            passenger.id,
                                                                                        status,
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                passengerLabels[
                                                                                    status
                                                                                ]
                                                                            }
                                                                        </button>
                                                                    )
                                                                )}
                                                        </div>
                                                    )}
                                            </article>
                                        ))}
                                    </section>
                                )}
                                {mode === 'issues' && (
                                    <section className={card}>
                                        {!closed && (
                                            <form
                                                className="space-y-4"
                                                onSubmit={(event) => {
                                                    event.preventDefault();
                                                    send({
                                                        kind: 'incident',
                                                        tripId: selected.trip
                                                            .id,
                                                        runId: run.id,
                                                        title,
                                                        comment,
                                                    });
                                                }}
                                            >
                                                <label className="block text-sm">
                                                    Что произошло
                                                    <input
                                                        className={`${field} mt-1`}
                                                        value={title}
                                                        onChange={(event) =>
                                                            setTitle(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        minLength={3}
                                                        maxLength={255}
                                                        required
                                                    />
                                                </label>
                                                <label className="block text-sm">
                                                    Подробности
                                                    <textarea
                                                        className={`${field} mt-1`}
                                                        value={comment}
                                                        onChange={(event) =>
                                                            setComment(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        minLength={3}
                                                        maxLength={4000}
                                                        rows={4}
                                                        required
                                                    />
                                                </label>
                                                <button
                                                    className={button}
                                                    disabled={pending}
                                                >
                                                    {pending
                                                        ? 'Отправляем…'
                                                        : 'Отправить диспетчеру'}
                                                </button>
                                            </form>
                                        )}
                                        <h2 className="mt-5 mb-3 font-semibold">
                                            Сообщения по рейсу
                                        </h2>
                                        {run.incidents.length === 0 ? (
                                            <p className="text-sm">
                                                Сообщений пока нет.
                                            </p>
                                        ) : (
                                            run.incidents.map((incident) => (
                                                <article
                                                    key={incident.id}
                                                    className="border-t border-[#DDD] py-3"
                                                >
                                                    <h3 className="font-semibold">
                                                        {incident.title}
                                                    </h3>
                                                    <p className="mt-2 text-sm whitespace-pre-wrap">
                                                        {incident.comment}
                                                    </p>
                                                    <p className="mt-2 text-xs text-[#777]">
                                                        {incident.createdAt}
                                                    </p>
                                                </article>
                                            ))
                                        )}
                                    </section>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
