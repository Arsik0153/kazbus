'use client';

import Link from 'next/link';
import Topbar from '@/components/topbar';
import Menu from '@/components/menu';
import DriverTripCard from './_components/DriverTripCard';
import EmptyTripState from './_components/EmptyTripState';
import CargoMap from './_components/CargoMap';
import TripStatusStepper from './_components/TripStatusStepper';
import CargoOrderDetailsDrawer from './_components/CargoOrderDetailsDrawer';
import DriverProfile from './_components/DriverProfile';
import TripOrdersCard from './_components/TripOrdersCard';
import {
    tripPresentation,
    tripSteps,
    orderDetails,
} from './_utils/driver-presentation';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import {
    cargoLogoutAction,
    reportDriverIncidentAction,
    updateDriverTripStatusAction,
} from '@/actions/cargo';
import type { DriverState, DriverTrip } from '@/lib/cargo-contract';
import CargoFileList from '@/components/cargo/cargo-file-list';

const statusLabel: Record<DriverTrip['status'], string> = {
    planned: 'Назначен',
    loading: 'Погрузка',
    in_transit: 'В пути',
    unloading: 'Разгрузка',
    completed: 'Завершен',
};

const nextStatus: Partial<
    Record<DriverTrip['status'], Exclude<DriverTrip['status'], 'planned'>>
> = {
    planned: 'loading',
    loading: 'in_transit',
    in_transit: 'unloading',
    unloading: 'completed',
};

export type DriverView =
    'home' | 'trip' | 'map' | 'profile' | 'documents' | 'upload';

const viewTitles: Record<Exclude<DriverView, 'home'>, string> = {
    trip: 'Текущий рейс',
    map: 'Карта маршрута',
    profile: 'Профиль',
    documents: 'Документы',
    upload: 'Добавить документы',
};

export default function DriverWorkspace({
    state,
    currentUserId,
    view,
}: {
    state: DriverState;
    currentUserId: number;
    view: DriverView;
}) {
    const router = useRouter();
    const [busy, setBusy] = useState('');
    const [message, setMessage] = useState('');
    const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
    const selectedTrip = state.trips.find((trip) => trip.id === selectedTripId);
    const activeTrips = state.trips.filter(
        (trip) => trip.status !== 'completed'
    );
    const displayedTrips = view === 'trip' ? state.trips : activeTrips;

    async function logout() {
        if (busy) return;
        setBusy('logout');
        try {
            await cargoLogoutAction();
            router.replace('/cargo/login');
            router.refresh();
        } catch {
            setMessage('Не удалось выйти. Попробуйте ещё раз.');
        } finally {
            setBusy('');
        }
    }

    async function advance(trip: DriverTrip) {
        const target = nextStatus[trip.status];
        if (busy || !target || trip.status === 'completed') return;
        setBusy(`status-${trip.id}`);
        setMessage('');
        try {
            const response = await updateDriverTripStatusAction({
                tripId: trip.id,
                expected: trip.status,
                target,
            });
            if (!response.ok) {
                setMessage(response.error);
                return;
            }
            setMessage('Статус рейса обновлен.');
            router.refresh();
        } catch {
            setMessage(
                'Не удалось получить ответ сервера. Попробуйте ещё раз.'
            );
        } finally {
            setBusy('');
        }
    }

    async function incident(event: FormEvent<HTMLFormElement>, tripId: number) {
        event.preventDefault();
        if (busy) return;
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        setBusy(`incident-${tripId}`);
        setMessage('');
        try {
            const response = await reportDriverIncidentAction({
                tripId,
                text: String(form.get('text') ?? ''),
                newEta: String(form.get('new_eta') ?? '') || undefined,
            });
            if (!response.ok) {
                setMessage(response.error);
                return;
            }
            formElement.reset();
            setMessage('Инцидент передан диспетчеру и грузоотправителю.');
            router.refresh();
        } catch {
            setMessage(
                'Не удалось получить ответ сервера. Попробуйте ещё раз.'
            );
        } finally {
            setBusy('');
        }
    }

    return (
        <>
            {view !== 'home' && (
                <Topbar
                    backHref={view === 'upload' ? '/cargo/profile' : '/cargo'}
                >
                    {viewTitles[view]}
                </Topbar>
            )}
            <main
                className={cn(
                    'min-h-full bg-(--gray) px-5 pb-28 text-[#4A4A4A]',
                    view === 'home' ? 'pt-18.75' : 'pt-5'
                )}
            >
                {view === 'home' && (
                    <>
                        <h1 className="text-[2.625rem] leading-[2.8875rem] font-semibold tracking-[-0.03em]">
                            Joool Cargo
                        </h1>
                        <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-[#A0A0A0]">
                                        Добро пожаловать
                                    </p>
                                    <p className="mt-1 text-[1.75rem] leading-[1.925rem] font-bold">
                                        {state.profile.fullName.split(' ')[0]}
                                    </p>
                                    <p className="mt-2 text-sm text-[#A0A0A0]">
                                        {state.profile.company.name}
                                    </p>
                                </div>
                                <span className="shrink-0 rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-1.5 text-xs font-semibold text-[#E74949]">
                                    {activeTrips.length
                                        ? 'В рейсе'
                                        : 'Нет рейсов'}
                                </span>
                            </div>
                        </div>
                    </>
                )}
                {view === 'profile' && (
                    <>
                        <DriverProfile state={state} />
                        <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 pt-5">
                            <h2 className="pb-2 text-xl font-bold">
                                Документы
                            </h2>
                            <p className="pb-4 text-sm text-[#A0A0A0]">
                                Добавьте документы водителя для проверки
                                профиля.
                            </p>
                            <Menu
                                link="/cargo/profile/add-documents"
                                text="Добавить документы водителя"
                            />
                            <div className="border-t border-[#E9E9E9]" />
                            <Menu
                                link="/cargo/documents"
                                text="Открыть список документов"
                            />
                        </div>
                        <div className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 pt-5">
                            <h2 className="pb-4 text-xl font-bold">
                                Настройки
                            </h2>
                            <button
                                type="button"
                                disabled={!!busy}
                                onClick={logout}
                                className="w-full py-5 text-left font-semibold text-[#E23333]"
                            >
                                {busy === 'logout' ? 'Выходим…' : 'Выйти'}
                            </button>
                        </div>
                    </>
                )}
                {message && (
                    <p
                        className="mt-5 rounded-xl border border-[#f3cdcd] bg-[#fff2f2] p-4 text-sm"
                        role="status"
                    >
                        {message}
                    </p>
                )}

                {(view === 'documents' || view === 'upload') && (
                    <div id="driver-documents" className="flex flex-col gap-4">
                        {view === 'upload' && (
                            <p className="text-sm text-[#A0A0A0]">
                                Загрузите документы водителя. Вы и ваш диспетчер
                                видите эти файлы.
                            </p>
                        )}
                        <CargoFileList
                            title="Личные документы"
                            description="Вы и ваш диспетчер видите эти файлы."
                            endpoint="/api/cargo/driver/documents"
                            fileScope="driver"
                            initialFiles={state.documents}
                            currentUserId={currentUserId}
                            uploadKinds={[
                                {
                                    value: 'license',
                                    label: 'Водительское удостоверение',
                                },
                                {
                                    value: 'identity',
                                    label: 'Удостоверение личности',
                                },
                                {
                                    value: 'medical',
                                    label: 'Медицинская справка',
                                },
                                { value: 'other', label: 'Другой документ' },
                            ]}
                        />
                    </div>
                )}

                {view === 'upload' && (
                    <div className="mt-6 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                        <p className="text-sm font-semibold text-[#E74949]">
                            Что дальше
                        </p>
                        <p className="mt-2 text-sm text-[#A0A0A0]">
                            После загрузки документов вернитесь к списку
                            документов или в профиль водителя.
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                            <Link
                                href="/cargo/documents"
                                className="block rounded-[0.625rem] bg-[#E23333] px-4 py-4 text-center font-semibold text-white"
                            >
                                Вернуться к документам
                            </Link>
                            <Link
                                href="/cargo/profile"
                                className="block rounded-[0.625rem] border border-[#E23333] px-4 py-4 text-center font-semibold text-[#E23333]"
                            >
                                Вернуться в профиль
                            </Link>
                        </div>
                    </div>
                )}

                {(view === 'home' || view === 'trip' || view === 'map') && (
                    <section className="mt-5 flex flex-col gap-4">
                        <h2 className="text-xl font-bold">
                            {view === 'home'
                                ? 'Активный рейс'
                                : 'Назначенные рейсы'}
                        </h2>
                        {!displayedTrips.length && <EmptyTripState />}
                        {displayedTrips.map((trip) => {
                            const target = nextStatus[trip.status];
                            return (
                                <article
                                    className="flex flex-col gap-4"
                                    key={trip.id}
                                >
                                    {view === 'trip' && (
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-medium text-[#A0A0A0]">
                                                    Груз
                                                </p>
                                                <h2 className="mt-1 text-xl leading-5.5 font-bold">
                                                    {trip.order.cargo}
                                                </h2>
                                                <p className="mt-4 text-base font-semibold">
                                                    {trip.order.quantity}{' '}
                                                    {trip.order.unit}
                                                </p>
                                            </div>
                                            <span className="rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-1.5 text-xs font-semibold text-[#E74949]">
                                                {trip.order.id}
                                            </span>
                                        </div>
                                    )}
                                    {(view === 'trip' || view === 'map') && (
                                        <CargoMap />
                                    )}
                                    <DriverTripCard
                                        trip={tripPresentation(trip)}
                                        steps={tripSteps(trip)}
                                        isTripCompleted={
                                            trip.status === 'completed'
                                        }
                                        onSelectNextPoint={() =>
                                            setSelectedTripId(trip.id)
                                        }
                                    />
                                    {view === 'trip' && (
                                        <TripOrdersCard
                                            contacts={[orderDetails(trip)]}
                                            onSelectOrder={() =>
                                                setSelectedTripId(trip.id)
                                            }
                                        />
                                    )}
                                    {view === 'home' && (
                                        <Link
                                            href="/cargo/trip"
                                            className="text-sm font-semibold text-[#E23333] underline"
                                        >
                                            Открыть рейсы
                                        </Link>
                                    )}
                                    {view === 'trip' && (
                                        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                                            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                <div className="rounded-lg bg-[#f8f8f8] p-3">
                                                    <dt className="text-[#a0a0a0]">
                                                        Груз
                                                    </dt>
                                                    <dd className="mt-1 font-semibold">
                                                        {trip.order.cargo} ·{' '}
                                                        {trip.order.quantity}{' '}
                                                        {trip.order.unit}
                                                    </dd>
                                                </div>
                                                <div className="rounded-lg bg-[#f8f8f8] p-3">
                                                    <dt className="text-[#a0a0a0]">
                                                        Машина
                                                    </dt>
                                                    <dd className="mt-1 font-semibold">
                                                        {trip.vehicle.model} ·{' '}
                                                        {
                                                            trip.vehicle
                                                                .plateNumber
                                                        }
                                                    </dd>
                                                </div>
                                                <div className="col-span-2 rounded-lg bg-[#f8f8f8] p-3">
                                                    <dt className="text-[#a0a0a0]">
                                                        Срок доставки
                                                    </dt>
                                                    <dd className="mt-1 font-semibold">
                                                        {trip.eta}
                                                    </dd>
                                                </div>
                                            </dl>

                                            {trip.order.comment && (
                                                <p className="mt-4 text-sm">
                                                    <strong>
                                                        Комментарий:
                                                    </strong>{' '}
                                                    {trip.order.comment}
                                                </p>
                                            )}

                                            {trip.status === 'completed' && (
                                                <div className="mt-4">
                                                    <CargoFileList
                                                        title="Подтверждение доставки"
                                                        description="После завершения рейса добавьте фото или PDF."
                                                        endpoint={`/api/cargo/orders/${trip.order.recordId}/attachments`}
                                                        fileScope="order"
                                                        initialFiles={
                                                            trip.order.files
                                                        }
                                                        currentUserId={
                                                            currentUserId
                                                        }
                                                        uploadKinds={[
                                                            {
                                                                value: 'delivery_proof',
                                                                label: 'Подтверждение доставки',
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {view === 'trip' && (
                                        <TripStatusStepper
                                            steps={tripSteps(trip)}
                                            isTripCompleted={
                                                trip.status === 'completed'
                                            }
                                        />
                                    )}

                                    {view === 'trip' && target && (
                                        <button
                                            className="mt-5 w-full rounded-xl bg-[#e23333] px-4 py-3 font-semibold text-white disabled:opacity-50"
                                            disabled={!!busy}
                                            onClick={() => advance(trip)}
                                        >
                                            {busy === `status-${trip.id}`
                                                ? 'Обновляем…'
                                                : `Перейти: ${statusLabel[target]}`}
                                        </button>
                                    )}

                                    {view === 'trip' &&
                                        trip.status !== 'completed' && (
                                            <details className="mt-4">
                                                <summary className="cursor-pointer text-sm font-semibold text-[#e23333]">
                                                    Сообщить об инциденте
                                                </summary>
                                                <form
                                                    className="mt-3 flex flex-col gap-3"
                                                    onSubmit={(event) =>
                                                        incident(event, trip.id)
                                                    }
                                                >
                                                    <textarea
                                                        className="rounded-xl border border-[#d1d1d1] p-3"
                                                        name="text"
                                                        rows={3}
                                                        placeholder="Опишите проблему"
                                                        required
                                                    />
                                                    <label className="text-sm">
                                                        Новый срок, если
                                                        изменился
                                                        <input
                                                            className="mt-1 w-full rounded-xl border border-[#d1d1d1] p-3"
                                                            name="new_eta"
                                                            type="date"
                                                        />
                                                    </label>
                                                    <button
                                                        className="rounded-xl border border-[#e23333] px-4 py-3 font-semibold text-[#e23333] disabled:opacity-50"
                                                        disabled={!!busy}
                                                    >
                                                        {busy ===
                                                        `incident-${trip.id}`
                                                            ? 'Отправляем…'
                                                            : 'Отправить'}
                                                    </button>
                                                </form>
                                            </details>
                                        )}
                                </article>
                            );
                        })}
                    </section>
                )}
            </main>
            <CargoOrderDetailsDrawer
                order={selectedTrip ? orderDetails(selectedTrip) : null}
                onOpenChange={(open) => {
                    if (!open) setSelectedTripId(null);
                }}
            />
        </>
    );
}
