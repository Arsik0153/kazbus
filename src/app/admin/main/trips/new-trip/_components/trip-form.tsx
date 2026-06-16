'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useServerAction } from 'zsa-react';

import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { tripSchema } from '@/data/schemas';
import { cn } from '@/lib/utils';

import {
    getTripFormOptionsAction,
    saveTripAction,
    TripFormValues,
} from '../../action';

const weekdayOptions = [
    ['Monday', 'Пн'],
    ['Tuesday', 'Вт'],
    ['Wednesday', 'Ср'],
    ['Thursday', 'Чт'],
    ['Friday', 'Пт'],
    ['Saturday', 'Сб'],
    ['Sunday', 'Вс'],
] as const;

const allWeekdays = {
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true,
};

const defaultValues: TripFormValues = {
    route: 0,
    bus: '',
    driver: 0,
    departure_time: '09:00:00',
    is_always_active: false,
    start_date: null,
    end_date: null,
    ticket_price: 0,
    frequency: 'daily',
    weekdays: allWeekdays,
    status: 'not_on_sale',
};

const selectClassName =
    'border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const TripForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        data: options,
        execute: loadOptions,
        isPending: isLoadingOptions,
    } = useServerAction(getTripFormOptionsAction, {
        onError: ({ err }) => {
            toast.error(err.message || 'Не удалось загрузить данные формы');
        },
    });

    const { execute: saveTrip, isPending: isSaving } = useServerAction(
        saveTripAction,
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['getTrips'],
                });
                toast.success('Рейс создан');
                router.push('/admin/main/trips');
                router.refresh();
            },
            onError: ({ err }) => {
                toast.error(err.message || 'Не удалось сохранить рейс');
            },
        }
    );

    const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<TripFormValues>({
        resolver: zodResolver(tripSchema),
        mode: 'onChange',
        defaultValues,
    });

    const frequency = watch('frequency');
    const isAlwaysActive = watch('is_always_active');
    const weekdaysError =
        typeof errors.weekdays?.message === 'string'
            ? { message: errors.weekdays.message }
            : undefined;

    useEffect(() => {
        loadOptions();
    }, [loadOptions]);

    useEffect(() => {
        if (frequency === 'daily') {
            setValue('weekdays', allWeekdays, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    }, [frequency, setValue]);

    useEffect(() => {
        if (isAlwaysActive) {
            setValue('start_date', null, {
                shouldDirty: true,
                shouldValidate: true,
            });
            setValue('end_date', null, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    }, [isAlwaysActive, setValue]);

    const onSubmit = handleSubmit((data) => {
        saveTrip({
            ...data,
            start_date: data.is_always_active ? null : data.start_date,
            end_date: data.is_always_active ? null : data.end_date,
            weekdays: data.frequency === 'daily' ? allWeekdays : data.weekdays,
        });
    });

    const routes = options?.routes ?? [];
    const buses = options?.buses ?? [];
    const drivers = options?.drivers ?? [];
    const hasRequiredOptions =
        routes.length > 0 && buses.length > 0 && drivers.length > 0;

    if (isLoadingOptions && !options) {
        return (
            <div className="flex justify-center py-24">
                <Spinner />
            </div>
        );
    }

    return (
        <form className="mt-6 flex flex-col" onSubmit={onSubmit} noValidate>
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    aria-label="Вернуться к списку рейсов"
                    onClick={() => router.push('/admin/main/trips')}
                >
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-semibold text-[#4A4A4A]">
                    Создать рейс
                </h1>
            </div>

            <div className="mb-28 mt-[14px] flex flex-col gap-8 rounded-[20px] bg-white px-8 py-10">
                {!hasRequiredOptions && (
                    <div className="rounded-lg border border-[#E7ECF2] bg-[#F8FAFC] p-4 text-sm font-medium text-[#4A4A4A]">
                        Для создания рейса нужны маршрут, автобус и водитель.
                        Проверьте справочники перед сохранением.
                    </div>
                )}

                <FieldGroup className="max-w-[980px]">
                    <div className="grid grid-cols-2 gap-6">
                        <Field data-invalid={Boolean(errors.route)}>
                            <FieldLabel
                                htmlFor="route"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Маршрут
                            </FieldLabel>
                            <select
                                id="route"
                                className={selectClassName}
                                aria-invalid={Boolean(errors.route)}
                                disabled={routes.length === 0}
                                {...register('route', { valueAsNumber: true })}
                            >
                                <option value={0}>Выберите маршрут</option>
                                {routes.map((route) => (
                                    <option key={route.id} value={route.id}>
                                        {route.start_city.name} -{' '}
                                        {route.end_city.name}
                                    </option>
                                ))}
                            </select>
                            <FieldError errors={[errors.route]} />
                        </Field>

                        <Field data-invalid={Boolean(errors.status)}>
                            <FieldLabel
                                htmlFor="status"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Статус продаж
                            </FieldLabel>
                            <select
                                id="status"
                                className={selectClassName}
                                aria-invalid={Boolean(errors.status)}
                                {...register('status')}
                            >
                                <option value="not_on_sale">
                                    Не в продаже
                                </option>
                                <option value="active">
                                    Активен, идут продажи
                                </option>
                                <option value="scheduled">Запланирован</option>
                                <option value="cancelled">Отменен</option>
                            </select>
                            <FieldError errors={[errors.status]} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Field data-invalid={Boolean(errors.bus)}>
                            <FieldLabel
                                htmlFor="bus"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Автобус
                            </FieldLabel>
                            <select
                                id="bus"
                                className={selectClassName}
                                aria-invalid={Boolean(errors.bus)}
                                disabled={buses.length === 0}
                                {...register('bus')}
                            >
                                <option value="">Выберите автобус</option>
                                {buses.map((bus) => (
                                    <option key={bus.id} value={bus.id}>
                                        {bus.name || bus.model_stamp} -{' '}
                                        {bus.state_number}
                                    </option>
                                ))}
                            </select>
                            <FieldError errors={[errors.bus]} />
                        </Field>

                        <Field data-invalid={Boolean(errors.driver)}>
                            <FieldLabel
                                htmlFor="driver"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Водитель
                            </FieldLabel>
                            <select
                                id="driver"
                                className={selectClassName}
                                aria-invalid={Boolean(errors.driver)}
                                disabled={drivers.length === 0}
                                {...register('driver', {
                                    valueAsNumber: true,
                                })}
                            >
                                <option value={0}>Выберите водителя</option>
                                {drivers.map((driver) => (
                                    <option
                                        key={driver.id}
                                        value={driver.id}
                                        disabled={!driver.is_active}
                                    >
                                        {driver.full_name}
                                        {!driver.is_active
                                            ? ' (неактивен)'
                                            : ''}
                                    </option>
                                ))}
                            </select>
                            <FieldError errors={[errors.driver]} />
                        </Field>
                    </div>
                </FieldGroup>

                <FieldGroup className="max-w-[980px]">
                    <Field>
                        <label className="flex w-fit cursor-pointer items-start gap-3 rounded-lg border border-[#D7DCE2] px-4 py-4">
                            <input
                                type="checkbox"
                                className="mt-1 size-4 accent-[#E74949]"
                                {...register('is_always_active')}
                            />
                            <span className="flex flex-col gap-1">
                                <span className="text-base font-semibold text-[#4A4A4A]">
                                    Всегда активен
                                </span>
                                <span className="text-sm font-medium text-[#A0A0A0]">
                                    Рейс будет постоянным, без даты начала и
                                    даты окончания
                                </span>
                            </span>
                        </label>
                    </Field>

                    <div className="grid grid-cols-4 gap-6">
                        <Field data-invalid={Boolean(errors.departure_time)}>
                            <FieldLabel
                                htmlFor="departure_time"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Время выезда
                            </FieldLabel>
                            <Input
                                id="departure_time"
                                type="time"
                                step={1}
                                aria-invalid={Boolean(errors.departure_time)}
                                {...register('departure_time')}
                            />
                            <FieldDescription>ЧЧ:ММ:СС</FieldDescription>
                            <FieldError errors={[errors.departure_time]} />
                        </Field>

                        <Field data-invalid={Boolean(errors.start_date)}>
                            <FieldLabel
                                htmlFor="start_date"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Дата начала
                            </FieldLabel>
                            <Input
                                id="start_date"
                                type="date"
                                disabled={isAlwaysActive}
                                aria-invalid={Boolean(errors.start_date)}
                                {...register('start_date')}
                            />
                            <FieldError errors={[errors.start_date]} />
                        </Field>

                        <Field data-invalid={Boolean(errors.end_date)}>
                            <FieldLabel
                                htmlFor="end_date"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Дата окончания
                            </FieldLabel>
                            <Input
                                id="end_date"
                                type="date"
                                disabled={isAlwaysActive}
                                aria-invalid={Boolean(errors.end_date)}
                                {...register('end_date')}
                            />
                            <FieldError errors={[errors.end_date]} />
                        </Field>

                        <Field data-invalid={Boolean(errors.ticket_price)}>
                            <FieldLabel
                                htmlFor="ticket_price"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Цена билета
                            </FieldLabel>
                            <Input
                                id="ticket_price"
                                type="number"
                                min={1}
                                step={100}
                                placeholder="Например, 4500"
                                aria-invalid={Boolean(errors.ticket_price)}
                                {...register('ticket_price', {
                                    valueAsNumber: true,
                                })}
                            />
                            <FieldError errors={[errors.ticket_price]} />
                        </Field>
                    </div>
                </FieldGroup>

                <FieldGroup className="max-w-[980px]">
                    <Field data-invalid={Boolean(errors.frequency)}>
                        <FieldLabel className="text-lg font-semibold text-[#4A4A4A]">
                            Периодичность
                        </FieldLabel>
                        <div className="grid grid-cols-2 gap-3">
                            <label
                                className={cn(
                                    'flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-4 text-base font-semibold text-[#4A4A4A]',
                                    frequency === 'daily' &&
                                        'border-[#E74949] bg-[#E74949] text-white'
                                )}
                            >
                                <input
                                    type="radio"
                                    value="daily"
                                    className="sr-only"
                                    {...register('frequency')}
                                />
                                Каждый день
                            </label>
                            <label
                                className={cn(
                                    'flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-4 text-base font-semibold text-[#4A4A4A]',
                                    frequency === 'weekly' &&
                                        'border-[#E74949] bg-[#E74949] text-white'
                                )}
                            >
                                <input
                                    type="radio"
                                    value="weekly"
                                    className="sr-only"
                                    {...register('frequency')}
                                />
                                Несколько раз в неделю
                            </label>
                        </div>
                        <FieldError errors={[errors.frequency]} />
                    </Field>

                    {frequency === 'weekly' && (
                        <Field data-invalid={Boolean(weekdaysError)}>
                            <FieldLabel className="text-lg font-semibold text-[#4A4A4A]">
                                Дни отправления
                            </FieldLabel>
                            <div className="flex flex-wrap gap-2">
                                {weekdayOptions.map(([key, label]) => (
                                    <label
                                        key={key}
                                        className="flex min-w-16 cursor-pointer items-center justify-center rounded-lg border px-4 py-3 text-base font-semibold text-[#4A4A4A] has-[:checked]:border-[#E74949] has-[:checked]:bg-[#E74949] has-[:checked]:text-white"
                                    >
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            {...register(`weekdays.${key}`)}
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                            <FieldError errors={[weekdaysError]} />
                        </Field>
                    )}
                </FieldGroup>

                <div className="flex items-center gap-3">
                    <Button
                        type="submit"
                        size="lg"
                        className="px-8 text-base"
                        disabled={isSaving || !hasRequiredOptions}
                    >
                        {isSaving ? <Spinner /> : <Save />}
                        Сохранить рейс
                    </Button>
                    <Button asChild type="button" size="lg" variant="outline">
                        <Link href="/admin/main/trips">Отмена</Link>
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default TripForm;
