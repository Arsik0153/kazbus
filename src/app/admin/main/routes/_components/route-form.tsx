'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft,
    LoaderCircle,
    Plus,
    Save,
    Search,
    Trash2,
} from 'lucide-react';
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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group';
import { routeSchema } from '@/data/schemas';

import {
    type GeocodingResult,
    geocodeAddressAction,
    getRouteAction,
    saveRouteAction,
} from '../action';
import RoutePointMap from './route-point-map';

type RouteFormValues = z.output<typeof routeSchema>;

type Props = {
    routeId?: number;
};

const defaultValues: RouteFormValues = {
    start_city: {
        name: '',
        region: '',
    },
    start_address: '',
    start_latitude: '',
    start_longitude: '',
    end_city: {
        name: '',
        region: '',
    },
    end_address: '',
    end_latitude: '',
    end_longitude: '',
    total_travel_time: '00:00:00',
    stops: [],
};

const emptyStop = {
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    travel_time_from_start: '00:00:00',
    stop_time: '00:05:00',
};

const formString = (value: unknown) => (typeof value === 'string' ? value : '');

type GeocodingResultsProps = {
    results: GeocodingResult[];
    onSelect: (result: GeocodingResult) => void;
};

const GeocodingResults = ({ results, onSelect }: GeocodingResultsProps) => (
    <div
        role="listbox"
        aria-label="Варианты адреса"
        className="bg-popover text-popover-foreground ring-foreground/10 absolute inset-x-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-lg p-2.5 text-sm shadow-md ring-1"
    >
        <div className="mb-2 flex flex-col gap-0.5">
            <p className="font-medium">Выберите подходящий адрес</p>
            <p className="text-muted-foreground">
                Координаты и карта обновятся после выбора.
            </p>
        </div>
        <div className="flex flex-col gap-1">
            {results.map((result) => (
                <Button
                    key={`${result.latitude}:${result.longitude}`}
                    type="button"
                    role="option"
                    aria-selected="false"
                    variant="ghost"
                    className="h-auto justify-start whitespace-normal px-2 py-2 text-left"
                    onClick={() => onSelect(result)}
                >
                    {result.display_name}
                </Button>
            ))}
        </div>
    </div>
);

const RouteForm = ({ routeId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const isEditing = Boolean(routeId);
    const [geocodingTarget, setGeocodingTarget] = useState<string | null>(null);
    const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>(
        []
    );
    const geocodingTargetRef = useRef<string | null>(null);

    const {
        control,
        register,
        formState: { errors },
        handleSubmit,
        getValues,
        reset,
        setValue,
        watch,
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
                    start_address: formString(data.start_address),
                    start_latitude: formString(data.start_latitude),
                    start_longitude: formString(data.start_longitude),
                    end_city: {
                        name: data.end_city.name,
                        region: data.end_city.region,
                    },
                    end_address: formString(data.end_address),
                    end_latitude: formString(data.end_latitude),
                    end_longitude: formString(data.end_longitude),
                    total_travel_time: data.total_travel_time,
                    stops: data.stops.map((stop) => ({
                        id: stop.id,
                        name: stop.name,
                        address: formString(stop.address),
                        latitude: formString(stop.latitude),
                        longitude: formString(stop.longitude),
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

    const { execute: geocodeAddress, isPending: isGeocoding } = useServerAction(
        geocodeAddressAction,
        {
            onSuccess: ({ data }) => {
                if (!Array.isArray(data) || data.length === 0) {
                    toast.error(
                        'Сервис вернул некорректный ответ. Повторите поиск.'
                    );
                    closeGeocodingResults();
                    return;
                }
                setGeocodingResults(data);
            },
            onError: ({ err }) => {
                toast.error(err.message || 'Не удалось найти адрес');
                geocodingTargetRef.current = null;
                setGeocodingTarget(null);
                setGeocodingResults([]);
            },
        }
    );

    const closeGeocodingResults = () => {
        geocodingTargetRef.current = null;
        setGeocodingTarget(null);
        setGeocodingResults([]);
    };

    const handleSelectGeocodingResult = (result: GeocodingResult) => {
        const target = geocodingTargetRef.current;
        if (target === 'start') {
            setValue('start_latitude', result.latitude, {
                shouldDirty: true,
                shouldValidate: true,
            });
            setValue('start_longitude', result.longitude, {
                shouldDirty: true,
                shouldValidate: true,
            });
        } else if (target === 'end') {
            setValue('end_latitude', result.latitude, {
                shouldDirty: true,
                shouldValidate: true,
            });
            setValue('end_longitude', result.longitude, {
                shouldDirty: true,
                shouldValidate: true,
            });
        } else if (target?.startsWith('stop-')) {
            const index = Number(target.slice(5));
            setValue(`stops.${index}.latitude`, result.latitude, {
                shouldDirty: true,
                shouldValidate: true,
            });
            setValue(`stops.${index}.longitude`, result.longitude, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }

        toast.success('Точка выбрана');
        closeGeocodingResults();
    };

    const handleGeocode = (target: 'start' | 'end' | number) => {
        if (isGeocoding) {
            return;
        }

        setGeocodingResults([]);

        if (target === 'start') {
            const address = formString(getValues('start_address')).trim();
            if (address.length < 3) {
                toast.error('Сначала введите адрес отправления');
                return;
            }
            geocodingTargetRef.current = 'start';
            setGeocodingTarget('start');
            geocodeAddress({
                address,
                city: formString(getValues('start_city.name')),
                region: formString(getValues('start_city.region')),
            });
            return;
        }

        if (target === 'end') {
            const address = formString(getValues('end_address')).trim();
            if (address.length < 3) {
                toast.error('Сначала введите адрес прибытия');
                return;
            }
            geocodingTargetRef.current = 'end';
            setGeocodingTarget('end');
            geocodeAddress({
                address,
                city: formString(getValues('end_city.name')),
                region: formString(getValues('end_city.region')),
            });
            return;
        }

        const address = formString(getValues(`stops.${target}.address`)).trim();
        if (address.length < 3) {
            toast.error('Сначала введите адрес остановки');
            return;
        }
        geocodingTargetRef.current = `stop-${target}`;
        setGeocodingTarget(`stop-${target}`);
        geocodeAddress({
            address,
            city: formString(getValues(`stops.${target}.name`)),
        });
    };

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
                                {...register('start_city.name', {
                                    onChange: () => {
                                        setValue('start_latitude', '');
                                        setValue('start_longitude', '');
                                    },
                                })}
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
                                {...register('start_city.region', {
                                    onChange: () => {
                                        setValue('start_latitude', '');
                                        setValue('start_longitude', '');
                                    },
                                })}
                            />
                            <FieldError errors={[errors.start_city?.region]} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Field
                            className="col-span-2"
                            data-invalid={Boolean(errors.start_address)}
                        >
                            <FieldLabel htmlFor="start_address">
                                Адрес отправления
                            </FieldLabel>
                            <div className="relative">
                                <InputGroup>
                                    <InputGroupInput
                                        id="start_address"
                                        placeholder="Например, Автовокзал Сайран"
                                        aria-invalid={Boolean(
                                            errors.start_address
                                        )}
                                        {...register('start_address', {
                                            onChange: () => {
                                                setValue('start_latitude', '');
                                                setValue('start_longitude', '');
                                            },
                                        })}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size="icon-xs"
                                            aria-label="Найти координаты адреса отправления"
                                            disabled={isGeocoding}
                                            onClick={() =>
                                                handleGeocode('start')
                                            }
                                        >
                                            {isGeocoding &&
                                            geocodingTarget === 'start' ? (
                                                <LoaderCircle
                                                    data-icon="inline-start"
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Search data-icon="inline-start" />
                                            )}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                {geocodingTarget === 'start' &&
                                geocodingResults.length > 0 ? (
                                    <GeocodingResults
                                        results={geocodingResults}
                                        onSelect={handleSelectGeocodingResult}
                                    />
                                ) : null}
                            </div>
                            <FieldError errors={[errors.start_address]} />
                            <RoutePointMap
                                title="Точка отправления на карте"
                                latitude={watch('start_latitude')}
                                longitude={watch('start_longitude')}
                            />
                        </Field>
                        <Field data-invalid={Boolean(errors.start_latitude)}>
                            <FieldLabel htmlFor="start_latitude">
                                Широта отправления
                            </FieldLabel>
                            <Input
                                id="start_latitude"
                                placeholder="43.237221"
                                readOnly
                                aria-readonly="true"
                                aria-invalid={Boolean(errors.start_latitude)}
                                {...register('start_latitude')}
                            />
                            <FieldError errors={[errors.start_latitude]} />
                        </Field>
                        <Field data-invalid={Boolean(errors.start_longitude)}>
                            <FieldLabel htmlFor="start_longitude">
                                Долгота отправления
                            </FieldLabel>
                            <Input
                                id="start_longitude"
                                placeholder="76.857969"
                                readOnly
                                aria-readonly="true"
                                aria-invalid={Boolean(errors.start_longitude)}
                                {...register('start_longitude')}
                            />
                            <FieldError errors={[errors.start_longitude]} />
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
                                {...register('end_city.name', {
                                    onChange: () => {
                                        setValue('end_latitude', '');
                                        setValue('end_longitude', '');
                                    },
                                })}
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
                                {...register('end_city.region', {
                                    onChange: () => {
                                        setValue('end_latitude', '');
                                        setValue('end_longitude', '');
                                    },
                                })}
                            />
                            <FieldError errors={[errors.end_city?.region]} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Field
                            className="col-span-2"
                            data-invalid={Boolean(errors.end_address)}
                        >
                            <FieldLabel htmlFor="end_address">
                                Адрес прибытия
                            </FieldLabel>
                            <div className="relative">
                                <InputGroup>
                                    <InputGroupInput
                                        id="end_address"
                                        placeholder="Например, Автовокзал Сапаржай"
                                        aria-invalid={Boolean(
                                            errors.end_address
                                        )}
                                        {...register('end_address', {
                                            onChange: () => {
                                                setValue('end_latitude', '');
                                                setValue('end_longitude', '');
                                            },
                                        })}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size="icon-xs"
                                            aria-label="Найти координаты адреса прибытия"
                                            disabled={isGeocoding}
                                            onClick={() => handleGeocode('end')}
                                        >
                                            {isGeocoding &&
                                            geocodingTarget === 'end' ? (
                                                <LoaderCircle
                                                    data-icon="inline-start"
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Search data-icon="inline-start" />
                                            )}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                {geocodingTarget === 'end' &&
                                geocodingResults.length > 0 ? (
                                    <GeocodingResults
                                        results={geocodingResults}
                                        onSelect={handleSelectGeocodingResult}
                                    />
                                ) : null}
                            </div>
                            <FieldError errors={[errors.end_address]} />
                            <RoutePointMap
                                title="Точка прибытия на карте"
                                latitude={watch('end_latitude')}
                                longitude={watch('end_longitude')}
                            />
                        </Field>
                        <Field data-invalid={Boolean(errors.end_latitude)}>
                            <FieldLabel htmlFor="end_latitude">
                                Широта прибытия
                            </FieldLabel>
                            <Input
                                id="end_latitude"
                                placeholder="51.195685"
                                readOnly
                                aria-readonly="true"
                                aria-invalid={Boolean(errors.end_latitude)}
                                {...register('end_latitude')}
                            />
                            <FieldError errors={[errors.end_latitude]} />
                        </Field>
                        <Field data-invalid={Boolean(errors.end_longitude)}>
                            <FieldLabel htmlFor="end_longitude">
                                Долгота прибытия
                            </FieldLabel>
                            <Input
                                id="end_longitude"
                                placeholder="71.409019"
                                readOnly
                                aria-readonly="true"
                                aria-invalid={Boolean(errors.end_longitude)}
                                {...register('end_longitude')}
                            />
                            <FieldError errors={[errors.end_longitude]} />
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
                                    className="grid grid-cols-[minmax(180px,1fr)_minmax(240px,1.4fr)_150px_150px_auto] items-start gap-4 rounded-[14px] bg-[#F8FAFC] p-4"
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
                                            {...register(
                                                `stops.${index}.name`,
                                                {
                                                    onChange: () => {
                                                        setValue(
                                                            `stops.${index}.latitude`,
                                                            ''
                                                        );
                                                        setValue(
                                                            `stops.${index}.longitude`,
                                                            ''
                                                        );
                                                    },
                                                }
                                            )}
                                        />
                                        <FieldError
                                            errors={[
                                                errors.stops?.[index]?.name,
                                            ]}
                                        />
                                    </Field>
                                    <Field
                                        data-invalid={Boolean(
                                            errors.stops?.[index]?.address
                                        )}
                                    >
                                        <FieldLabel
                                            htmlFor={`stop_${index}_address`}
                                        >
                                            Адрес
                                        </FieldLabel>
                                        <div className="relative">
                                            <InputGroup>
                                                <InputGroupInput
                                                    id={`stop_${index}_address`}
                                                    placeholder="Например, Автовокзал Караганда"
                                                    aria-invalid={Boolean(
                                                        errors.stops?.[index]
                                                            ?.address
                                                    )}
                                                    {...register(
                                                        `stops.${index}.address`,
                                                        {
                                                            onChange: () => {
                                                                setValue(
                                                                    `stops.${index}.latitude`,
                                                                    ''
                                                                );
                                                                setValue(
                                                                    `stops.${index}.longitude`,
                                                                    ''
                                                                );
                                                            },
                                                        }
                                                    )}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        size="icon-xs"
                                                        aria-label={`Найти координаты остановки ${index + 1}`}
                                                        disabled={isGeocoding}
                                                        onClick={() =>
                                                            handleGeocode(index)
                                                        }
                                                    >
                                                        {isGeocoding &&
                                                        geocodingTarget ===
                                                            `stop-${index}` ? (
                                                            <LoaderCircle
                                                                data-icon="inline-start"
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Search data-icon="inline-start" />
                                                        )}
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {geocodingTarget ===
                                                `stop-${index}` &&
                                            geocodingResults.length > 0 ? (
                                                <GeocodingResults
                                                    results={geocodingResults}
                                                    onSelect={
                                                        handleSelectGeocodingResult
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                        <FieldError
                                            errors={[
                                                errors.stops?.[index]?.address,
                                            ]}
                                        />
                                        <RoutePointMap
                                            title={`Остановка ${index + 1} на карте`}
                                            latitude={watch(
                                                `stops.${index}.latitude`
                                            )}
                                            longitude={watch(
                                                `stops.${index}.longitude`
                                            )}
                                        />
                                    </Field>
                                    <Field
                                        data-invalid={Boolean(
                                            errors.stops?.[index]?.latitude
                                        )}
                                    >
                                        <FieldLabel
                                            htmlFor={`stop_${index}_latitude`}
                                        >
                                            Широта
                                        </FieldLabel>
                                        <Input
                                            id={`stop_${index}_latitude`}
                                            placeholder="49.788954"
                                            readOnly
                                            aria-readonly="true"
                                            aria-invalid={Boolean(
                                                errors.stops?.[index]?.latitude
                                            )}
                                            {...register(
                                                `stops.${index}.latitude`
                                            )}
                                        />
                                        <FieldError
                                            errors={[
                                                errors.stops?.[index]?.latitude,
                                            ]}
                                        />
                                    </Field>
                                    <Field
                                        data-invalid={Boolean(
                                            errors.stops?.[index]?.longitude
                                        )}
                                    >
                                        <FieldLabel
                                            htmlFor={`stop_${index}_longitude`}
                                        >
                                            Долгота
                                        </FieldLabel>
                                        <Input
                                            id={`stop_${index}_longitude`}
                                            placeholder="73.089084"
                                            readOnly
                                            aria-readonly="true"
                                            aria-invalid={Boolean(
                                                errors.stops?.[index]?.longitude
                                            )}
                                            {...register(
                                                `stops.${index}.longitude`
                                            )}
                                        />
                                        <FieldError
                                            errors={[
                                                errors.stops?.[index]
                                                    ?.longitude,
                                            ]}
                                        />
                                    </Field>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-lg"
                                        className="mt-7"
                                        aria-label="Удалить остановку"
                                        disabled={isGeocoding}
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 />
                                    </Button>
                                    <Field
                                        className="col-span-2"
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
