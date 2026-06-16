'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useServerAction } from 'zsa-react';
import { z } from 'zod';

import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { routeSchema } from '@/data/schemas';

import { getRouteAction, saveRouteAction } from '../action';

type RouteFormValues = z.output<typeof routeSchema>;

type Props = {
    routeId?: number;
};

const defaultValues: RouteFormValues = {
    start_city: {
        name: '',
        region: '',
    },
    end_city: {
        name: '',
        region: '',
    },
    total_travel_time: '00:00:00',
    stops: [],
};

const emptyStop = {
    name: '',
    travel_time_from_start: '00:00:00',
    stop_time: '00:05:00',
};

const RouteForm = ({ routeId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const isEditing = Boolean(routeId);

    const {
        control,
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<RouteFormValues>({
        resolver: zodResolver(routeSchema),
        mode: 'onChange',
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'stops',
        keyName: 'fieldId',
    });

    const { execute: loadRoute, isPending: isLoading } = useServerAction(
        getRouteAction,
        {
            onSuccess: ({ data }) => {
                reset({
                    start_city: {
                        name: data.start_city.name,
                        region: data.start_city.region,
                    },
                    end_city: {
                        name: data.end_city.name,
                        region: data.end_city.region,
                    },
                    total_travel_time: data.total_travel_time,
                    stops: data.stops.map((stop) => ({
                        id: stop.id,
                        name: stop.name,
                        travel_time_from_start: stop.travel_time_from_start,
                        stop_time: stop.stop_time,
                    })),
                });
            },
            onError: ({ err }) => {
                toast.error(err.message || 'Не удалось загрузить маршрут');
                router.replace('/admin/main/routes');
            },
        }
    );

    const { execute: saveRoute, isPending: isSaving } = useServerAction(
        saveRouteAction,
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['getRoutes'],
                });
                toast.success(
                    isEditing ? 'Маршрут обновлен' : 'Маршрут создан'
                );
                router.push('/admin/main/routes');
                router.refresh();
            },
            onError: ({ err }) => {
                toast.error(err.message || 'Не удалось сохранить маршрут');
            },
        }
    );

    useEffect(() => {
        if (!routeId) {
            return;
        }

        if (!Number.isInteger(routeId) || routeId <= 0) {
            router.replace('/admin/main/routes');
            return;
        }

        loadRoute({ routeId });
    }, [loadRoute, routeId, router]);

    const onSubmit = handleSubmit((data) => {
        saveRoute(routeId ? { ...data, route_id: routeId } : data);
    });

    if (isEditing && isLoading) {
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
                    aria-label="Вернуться к списку маршрутов"
                    onClick={() => router.push('/admin/main/routes')}
                >
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-semibold text-[#4A4A4A]">
                    {isEditing ? 'Редактировать маршрут' : 'Добавить маршрут'}
                </h1>
            </div>

            <div className="mb-28 mt-[14px] flex flex-col gap-8 rounded-[20px] bg-white px-8 py-10">
                <FieldGroup className="max-w-[900px]">
                    <div className="grid grid-cols-2 gap-6">
                        <Field data-invalid={Boolean(errors.start_city?.name)}>
                            <FieldLabel
                                htmlFor="start_city_name"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Город отправления
                            </FieldLabel>
                            <Input
                                id="start_city_name"
                                placeholder="Например, Алматы"
                                aria-invalid={Boolean(errors.start_city?.name)}
                                {...register('start_city.name')}
                            />
                            <FieldError errors={[errors.start_city?.name]} />
                        </Field>
                        <Field
                            data-invalid={Boolean(errors.start_city?.region)}
                        >
                            <FieldLabel
                                htmlFor="start_city_region"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Регион отправления
                            </FieldLabel>
                            <Input
                                id="start_city_region"
                                placeholder="Например, Алматинская область"
                                aria-invalid={Boolean(
                                    errors.start_city?.region
                                )}
                                {...register('start_city.region')}
                            />
                            <FieldError errors={[errors.start_city?.region]} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Field data-invalid={Boolean(errors.end_city?.name)}>
                            <FieldLabel
                                htmlFor="end_city_name"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Город прибытия
                            </FieldLabel>
                            <Input
                                id="end_city_name"
                                placeholder="Например, Астана"
                                aria-invalid={Boolean(errors.end_city?.name)}
                                {...register('end_city.name')}
                            />
                            <FieldError errors={[errors.end_city?.name]} />
                        </Field>
                        <Field data-invalid={Boolean(errors.end_city?.region)}>
                            <FieldLabel
                                htmlFor="end_city_region"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Регион прибытия
                            </FieldLabel>
                            <Input
                                id="end_city_region"
                                placeholder="Например, Акмолинская область"
                                aria-invalid={Boolean(errors.end_city?.region)}
                                {...register('end_city.region')}
                            />
                            <FieldError errors={[errors.end_city?.region]} />
                        </Field>
                    </div>

                    <Field
                        className="max-w-[430px]"
                        data-invalid={Boolean(errors.total_travel_time)}
                    >
                        <FieldLabel
                            htmlFor="total_travel_time"
                            className="text-lg font-semibold text-[#4A4A4A]"
                        >
                            Общее время в пути
                        </FieldLabel>
                        <Input
                            id="total_travel_time"
                            placeholder="08:30:00"
                            aria-invalid={Boolean(errors.total_travel_time)}
                            {...register('total_travel_time')}
                        />
                        <FieldError errors={[errors.total_travel_time]} />
                    </Field>
                </FieldGroup>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-[#4A4A4A]">
                                Остановки
                            </h2>
                            <p className="mt-1 text-sm font-medium text-[#A0A0A0]">
                                Добавьте промежуточные точки в порядке движения.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="px-5"
                            onClick={() => append(emptyStop)}
                        >
                            <Plus />
                            Добавить остановку
                        </Button>
                    </div>

                    {fields.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {fields.map((field, index) => (
                                <div
                                    key={field.fieldId}
                                    className="grid grid-cols-[1fr_190px_170px_auto] items-start gap-4 rounded-[14px] bg-[#F8FAFC] p-4"
                                >
                                    {typeof field.id === 'number' ? (
                                        <input
                                            type="hidden"
                                            {...register(`stops.${index}.id`, {
                                                valueAsNumber: true,
                                            })}
                                        />
                                    ) : null}
                                    <Field
                                        data-invalid={Boolean(
                                            errors.stops?.[index]?.name
                                        )}
                                    >
                                        <FieldLabel
                                            htmlFor={`stop_${index}_name`}
                                        >
                                            Название
                                        </FieldLabel>
                                        <Input
                                            id={`stop_${index}_name`}
                                            placeholder="Например, Сайран"
                                            aria-invalid={Boolean(
                                                errors.stops?.[index]?.name
                                            )}
                                            {...register(`stops.${index}.name`)}
                                        />
                                        <FieldError
                                            errors={[
                                                errors.stops?.[index]?.name,
                                            ]}
                                        />
                                    </Field>
                                    <Field
                                        data-invalid={Boolean(
                                            errors.stops?.[index]
                                                ?.travel_time_from_start
                                        )}
                                    >
                                        <FieldLabel
                                            htmlFor={`stop_${index}_travel`}
                                        >
                                            От старта
                                        </FieldLabel>
                                        <Input
                                            id={`stop_${index}_travel`}
                                            placeholder="02:15:00"
                                            aria-invalid={Boolean(
                                                errors.stops?.[index]
                                                    ?.travel_time_from_start
                                            )}
                                            {...register(
                                                `stops.${index}.travel_time_from_start`
                                            )}
                                        />
                                        <FieldError
                                            errors={[
                                                errors.stops?.[index]
                                                    ?.travel_time_from_start,
                                            ]}
                                        />
                                    </Field>
                                    <Field
                                        data-invalid={Boolean(
                                            errors.stops?.[index]?.stop_time
                                        )}
                                    >
                                        <FieldLabel
                                            htmlFor={`stop_${index}_parking`}
                                        >
                                            Стоянка
                                        </FieldLabel>
                                        <Input
                                            id={`stop_${index}_parking`}
                                            placeholder="00:10:00"
                                            aria-invalid={Boolean(
                                                errors.stops?.[index]?.stop_time
                                            )}
                                            {...register(
                                                `stops.${index}.stop_time`
                                            )}
                                        />
                                        <FieldError
                                            errors={[
                                                errors.stops?.[index]
                                                    ?.stop_time,
                                            ]}
                                        />
                                    </Field>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-lg"
                                        className="mt-7"
                                        aria-label="Удалить остановку"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[14px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center">
                            <p className="text-base font-semibold text-[#4A4A4A]">
                                У маршрута пока нет промежуточных остановок
                            </p>
                            <p className="mt-1 text-sm font-medium text-[#A0A0A0]">
                                Для прямого направления можно сохранить маршрут
                                без остановок.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex max-w-[520px] gap-3">
                    <Button
                        type="submit"
                        size="xl"
                        className="flex-1"
                        disabled={isSaving}
                    >
                        <Save />
                        {isSaving
                            ? 'Сохранение...'
                            : isEditing
                              ? 'Сохранить изменения'
                              : 'Сохранить маршрут'}
                    </Button>
                    <Button
                        type="button"
                        size="xl"
                        variant="outline"
                        className="px-8"
                        disabled={isSaving}
                        onClick={() => router.push('/admin/main/routes')}
                    >
                        Отмена
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default RouteForm;
