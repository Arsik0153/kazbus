'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';

import Floors from '@/app/admin/main/buses/new-bus/_components/floors';
import Scheme, {
    BusSeatDraft,
} from '@/app/admin/main/buses/new-bus/_components/scheme';
import { busSchema } from '@/data/schemas';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/spinner';

import { getBusAction, saveBusAction } from '../actions';

type BusFormValues = z.output<typeof busSchema>;

const defaultValues: BusFormValues = {
    name: '',
    stamp: '',
    model: '',
    state_number: '',
    VIN: '',
    count_of_seats: 36,
    floors: 1,
    have_toilet: false,
    have_wifi: false,
    is_recumbent: false,
    seats: [],
};

type Props = {
    busId?: string;
};

const BusForm = ({ busId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const isEditing = Boolean(busId);
    const [initialSeats, setInitialSeats] = useState<BusSeatDraft[]>();
    const {
        register,
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BusFormValues>({
        resolver: zodResolver(busSchema),
        mode: 'onChange',
        defaultValues,
    });

    const { execute: loadBus, isPending: isLoading } = useServerAction(
        getBusAction,
        {
            onSuccess: ({ data }) => {
                const seats = data.seats ?? [];

                reset({
                    name: data.name ?? '',
                    stamp: data.stamp ?? '',
                    model: data.model ?? '',
                    state_number: data.state_number,
                    VIN: data.VIN ?? '',
                    count_of_seats: data.count_of_seats,
                    floors: data.floors === 2 ? 2 : 1,
                    have_toilet: data.have_toilet,
                    have_wifi: data.have_wifi,
                    is_recumbent: data.is_recumbent,
                    seats,
                });
                setInitialSeats(seats);
            },
            onError: ({ err }) => {
                toast.error(err.message || 'Не удалось загрузить автобус');
                router.replace('/admin/main/buses');
            },
        }
    );

    const { execute: saveBus, isPending: isSaving } = useServerAction(saveBusAction, {
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['getBuses'] });
            toast.success(isEditing ? 'Автобус обновлен' : 'Автобус сохранен');
            router.push('/admin/main/buses');
            router.refresh();
        },
        onError: ({ err }) => {
            toast.error(err.message || 'Не удалось сохранить автобус');
        },
    });

    useEffect(() => {
        register('floors');
        register('have_toilet');
        register('have_wifi');
        register('is_recumbent');
        register('seats');
    }, [register]);

    useEffect(() => {
        if (!busId) {
            return;
        }

        loadBus({ busId });
    }, [busId, loadBus]);

    const floorCount: 1 | 2 = watch('floors') === 2 ? 2 : 1;
    const countOfSeats = Number(watch('count_of_seats')) || 0;
    const haveWifi = watch('have_wifi');
    const haveToilet = watch('have_toilet');
    const isRecumbent = watch('is_recumbent');
    const seats = watch('seats');
    const passengerSeatCount = seats.filter(
        (seat) => seat.seat_type === 'passenger'
    ).length;

    const onSubmit = handleSubmit((data) => {
        saveBus(busId ? { ...data, bus_id: busId } : data);
    });

    const handleSchemeChange = useCallback(
        (seats: BusFormValues['seats']) => {
            setValue('seats', seats, {
                shouldValidate: true,
                shouldDirty: true,
            });
        },
        [setValue]
    );

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
                    aria-label="Вернуться к списку автобусов"
                    onClick={() => router.push('/admin/main/buses')}
                >
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-semibold text-[#4A4A4A]">
                    {isEditing ? 'Редактировать автобус' : 'Добавить автобус'}
                </h1>
            </div>

            <div className="mb-28 mt-[14px] flex flex-col rounded-[20px] bg-white px-8 py-10">
                <div className="grid w-full max-w-[980px] grid-cols-2 gap-5">
                    <Field className="gap-2" data-invalid={Boolean(errors.name)}>
                        <FieldLabel
                            htmlFor="name"
                            className="text-lg font-semibold text-[#4A4A4A]"
                        >
                            Внутреннее название
                        </FieldLabel>
                        <Input
                            id="name"
                            placeholder="Например, Jol Express 1"
                            aria-invalid={Boolean(errors.name)}
                            {...register('name')}
                        />
                        <FieldError errors={[errors.name]} />
                    </Field>

                    <Field className="gap-2" data-invalid={Boolean(errors.stamp)}>
                        <FieldLabel
                            htmlFor="stamp"
                            className="text-lg font-semibold text-[#4A4A4A]"
                        >
                            Марка
                        </FieldLabel>
                        <Input
                            id="stamp"
                            placeholder="Например, Yutong"
                            aria-invalid={Boolean(errors.stamp)}
                            {...register('stamp')}
                        />
                        <FieldError errors={[errors.stamp]} />
                    </Field>

                    <Field className="gap-2" data-invalid={Boolean(errors.model)}>
                        <FieldLabel
                            htmlFor="model"
                            className="text-lg font-semibold text-[#4A4A4A]"
                        >
                            Модель
                        </FieldLabel>
                        <Input
                            id="model"
                            placeholder="Например, ZK6122H9"
                            aria-invalid={Boolean(errors.model)}
                            {...register('model')}
                        />
                        <FieldError errors={[errors.model]} />
                    </Field>

                    <Field
                        className="gap-2"
                        data-invalid={Boolean(errors.state_number)}
                    >
                        <FieldLabel
                            htmlFor="state_number"
                            className="text-lg font-semibold text-[#4A4A4A]"
                        >
                            Государственный номер
                        </FieldLabel>
                        <Input
                            id="state_number"
                            placeholder="Например, 777 JOL 02"
                            aria-invalid={Boolean(errors.state_number)}
                            {...register('state_number')}
                        />
                        <FieldError errors={[errors.state_number]} />
                    </Field>

                    <Field className="gap-2" data-invalid={Boolean(errors.VIN)}>
                        <FieldLabel
                            htmlFor="VIN"
                            className="text-lg font-semibold text-[#4A4A4A]"
                        >
                            VIN
                        </FieldLabel>
                        <Input
                            id="VIN"
                            placeholder="17 символов"
                            aria-invalid={Boolean(errors.VIN)}
                            {...register('VIN')}
                        />
                        <FieldError errors={[errors.VIN]} />
                    </Field>

                    <Field
                        className="gap-2"
                        data-invalid={Boolean(errors.count_of_seats)}
                    >
                        <FieldLabel
                            htmlFor="count_of_seats"
                            className="text-lg font-semibold text-[#4A4A4A]"
                        >
                            Количество пассажирских мест
                        </FieldLabel>
                        <Input
                            id="count_of_seats"
                            type="number"
                            min={1}
                            aria-invalid={Boolean(errors.count_of_seats)}
                            {...register('count_of_seats')}
                        />
                        <FieldError errors={[errors.count_of_seats]} />
                    </Field>
                </div>

                <div className="mt-10 max-w-[980px]">
                    <Field className="gap-3" data-invalid={Boolean(errors.floors)}>
                        <FieldLabel className="text-lg font-semibold text-[#4A4A4A]">
                            Количество этажей
                        </FieldLabel>
                        <Floors
                            selected={floorCount}
                            onSelect={(value) =>
                                setValue('floors', value, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                })
                            }
                        />
                        <FieldError errors={[errors.floors]} />
                    </Field>
                </div>

                <div className="mt-10 max-w-[980px]">
                    <p className="text-lg font-semibold text-[#4A4A4A]">
                        Свойства автобуса
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <label className="flex items-center gap-3 rounded-[14px] border border-[#D7DCE2] px-4 py-4">
                            <input
                                type="checkbox"
                                checked={haveWifi}
                                onChange={(event) =>
                                    setValue('have_wifi', event.target.checked, {
                                        shouldDirty: true,
                                    })
                                }
                            />
                            <span className="font-medium text-[#4A4A4A]">
                                Wi-Fi
                            </span>
                        </label>
                        <label className="flex items-center gap-3 rounded-[14px] border border-[#D7DCE2] px-4 py-4">
                            <input
                                type="checkbox"
                                checked={haveToilet}
                                onChange={(event) =>
                                    setValue(
                                        'have_toilet',
                                        event.target.checked,
                                        {
                                            shouldDirty: true,
                                        }
                                    )
                                }
                            />
                            <span className="font-medium text-[#4A4A4A]">
                                Туалет
                            </span>
                        </label>
                        <label className="flex items-center gap-3 rounded-[14px] border border-[#D7DCE2] px-4 py-4">
                            <input
                                type="checkbox"
                                checked={isRecumbent}
                                onChange={(event) =>
                                    setValue(
                                        'is_recumbent',
                                        event.target.checked,
                                        {
                                            shouldDirty: true,
                                        }
                                    )
                                }
                            />
                            <span className="font-medium text-[#4A4A4A]">
                                Лежачие места
                            </span>
                        </label>
                    </div>
                </div>

                <div className="mt-10 max-w-[980px]">
                    <Scheme
                        key={initialSeats ? `${busId}-loaded` : 'new-bus'}
                        floorCount={floorCount}
                        initialSeats={initialSeats}
                        onChange={handleSchemeChange}
                        errorMessage={errors.seats?.message}
                    />
                    <p className="mt-3 text-sm text-[#A0A0A0]">
                        Пассажирских мест в схеме: {passengerSeatCount} из{' '}
                        {countOfSeats}. Места водителя и проходы сохраняются в
                        схеме, но не входят в продажу билетов.
                    </p>
                </div>

                <div className="mt-14 flex max-w-[500px] gap-3">
                    <Button
                        type="submit"
                        size="xl"
                        className="flex-1"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Сохранение...' : 'Сохранить автобус'}
                    </Button>
                    <Button
                        type="button"
                        size="xl"
                        variant="outline"
                        className="px-8"
                        disabled={isSaving}
                        onClick={() => router.push('/admin/main/buses')}
                    >
                        Отмена
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default BusForm;
