'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { ArrowLeft, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useServerAction } from 'zsa-react';
import { driverSchema } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { DatePicker } from '@/components/ui/date-picker';
import Spinner from '@/components/spinner';
import { getDriverAction, saveDriverAction } from '../actions';

type DriverFormValues = z.output<typeof driverSchema>;

type Props = {
    driverId?: number;
};

const defaultValues: DriverFormValues = {
    full_name: '',
    date_of_birth: '',
    license_number: '',
    license_issue_date: '',
    picture: undefined,
};

const DriverForm = ({ driverId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const isEditing = Boolean(driverId);

    const {
        control,
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<DriverFormValues>({
        resolver: zodResolver(driverSchema),
        mode: 'onChange',
        defaultValues,
    });

    const { execute: loadDriver, isPending: isLoading } = useServerAction(
        getDriverAction,
        {
            onSuccess: ({ data }) => {
                reset({
                    full_name: data.full_name,
                    date_of_birth: data.date_of_birth,
                    license_number: data.license_number,
                    license_issue_date: data.license_issue_date,
                    picture: undefined,
                });
                setImagePreview(data.picture);
            },
            onError: ({ err }) => {
                toast.error(err.message || 'Не удалось загрузить водителя');
                router.replace('/admin/main/drivers');
            },
        }
    );

    const { execute: saveDriver, isPending: isSaving } = useServerAction(
        saveDriverAction,
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['getDrivers'],
                });
                toast.success(
                    isEditing
                        ? 'Данные водителя обновлены'
                        : 'Водитель добавлен'
                );
                router.push('/admin/main/drivers');
                router.refresh();
            },
            onError: ({ err }) => {
                toast.error(err.message || 'Не удалось сохранить водителя');
            },
        }
    );

    useEffect(() => {
        if (!driverId || !Number.isInteger(driverId) || driverId <= 0) {
            if (isEditing) {
                router.replace('/admin/main/drivers');
            }
            return;
        }

        loadDriver({ driverId });
    }, [driverId, isEditing, loadDriver, router]);

    useEffect(
        () => () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        },
        [imagePreview]
    );

    const updatePreview = (file?: File) => {
        setImagePreview((currentPreview) => {
            if (currentPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(currentPreview);
            }
            return file ? URL.createObjectURL(file) : null;
        });
    };

    const onSubmit = handleSubmit((data) => {
        const formData = new FormData();
        formData.set('full_name', data.full_name);
        formData.set('date_of_birth', data.date_of_birth);
        formData.set('license_number', data.license_number);
        formData.set('license_issue_date', data.license_issue_date);

        if (data.picture) {
            formData.set('picture', data.picture);
        }
        if (driverId) {
            formData.set('driver_id', String(driverId));
        }

        saveDriver(formData);
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
                    aria-label="Вернуться к списку водителей"
                    onClick={() => router.push('/admin/main/drivers')}
                >
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-semibold text-[#4A4A4A]">
                    {isEditing ? 'Редактировать водителя' : 'Добавить водителя'}
                </h1>
            </div>

            <div className="mb-28 mt-[14px] flex flex-col rounded-[20px] bg-white px-8 py-10">
                <div className="w-full max-w-[800px]">
                    <Controller
                        control={control}
                        name="picture"
                        render={({ field, fieldState }) => (
                            <Field
                                className="gap-2"
                                data-invalid={fieldState.invalid}
                            >
                                <div className="flex items-start gap-8">
                                    <Image
                                        src={
                                            imagePreview ||
                                            '/assets/admin/avatar.png'
                                        }
                                        alt="Фото водителя"
                                        width={128}
                                        height={128}
                                        unoptimized
                                        className="mt-4 h-32 w-32 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <FieldLabel
                                            htmlFor="picture"
                                            className="text-lg font-semibold text-[#4A4A4A]"
                                        >
                                            Фото водителя
                                        </FieldLabel>
                                        <p className="mt-1 text-base font-medium text-[#A0A0A0]">
                                            Необязательно, JPEG, PNG или WebP до
                                            5 MB
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            className="mt-4 w-fit px-5"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <Upload />
                                            {field.value
                                                ? 'Заменить фото'
                                                : 'Загрузить фото'}
                                        </Button>
                                        <input
                                            id="picture"
                                            ref={(element) => {
                                                field.ref(element);
                                                fileInputRef.current = element;
                                            }}
                                            type="file"
                                            className="sr-only"
                                            accept="image/jpeg,image/png,image/webp"
                                            aria-invalid={fieldState.invalid}
                                            onBlur={field.onBlur}
                                            onChange={(event) => {
                                                const file =
                                                    event.target.files?.[0];
                                                field.onChange(file);
                                                updatePreview(file);
                                            }}
                                        />
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    </div>
                                </div>
                            </Field>
                        )}
                    />
                </div>

                <div className="mt-11 grid w-full max-w-[800px] grid-cols-2 gap-5">
                    <div className="flex flex-col gap-8">
                        <Field
                            className="gap-2"
                            data-invalid={Boolean(errors.full_name)}
                        >
                            <FieldLabel
                                htmlFor="full_name"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                ФИО водителя
                            </FieldLabel>
                            <Input
                                id="full_name"
                                aria-invalid={Boolean(errors.full_name)}
                                placeholder="Введите ФИО"
                                autoComplete="name"
                                {...register('full_name')}
                            />
                            <FieldError errors={[errors.full_name]} />
                        </Field>
                        <Field
                            className="gap-2"
                            data-invalid={Boolean(errors.license_number)}
                        >
                            <FieldLabel
                                htmlFor="license_number"
                                className="text-lg font-semibold text-[#4A4A4A]"
                            >
                                Номер водительского удостоверения
                            </FieldLabel>
                            <Input
                                id="license_number"
                                aria-invalid={Boolean(errors.license_number)}
                                placeholder="Введите номер удостоверения"
                                {...register('license_number')}
                            />
                            <FieldError errors={[errors.license_number]} />
                        </Field>
                    </div>
                    <div className="flex flex-col gap-8">
                        <Controller
                            control={control}
                            name="date_of_birth"
                            render={({ field, fieldState }) => (
                                <Field
                                    className="gap-2"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel
                                        htmlFor="date_of_birth"
                                        className="text-lg font-semibold text-[#4A4A4A]"
                                    >
                                        Дата рождения
                                    </FieldLabel>
                                    <DatePicker
                                        id="date_of_birth"
                                        ref={field.ref}
                                        value={
                                            field.value
                                                ? dayjs(field.value).toDate()
                                                : null
                                        }
                                        onChange={(date) =>
                                            field.onChange(
                                                date
                                                    ? dayjs(date).format(
                                                          'YYYY-MM-DD'
                                                      )
                                                    : ''
                                            )
                                        }
                                        onBlur={field.onBlur}
                                        placeholder="Выберите дату рождения"
                                        aria-invalid={fieldState.invalid}
                                        className="max-w-none"
                                        calendarProps={{
                                            disabled: { after: new Date() },
                                        }}
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={control}
                            name="license_issue_date"
                            render={({ field, fieldState }) => (
                                <Field
                                    className="gap-2"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel
                                        htmlFor="license_issue_date"
                                        className="text-lg font-semibold text-[#4A4A4A]"
                                    >
                                        Дата выдачи удостоверения
                                    </FieldLabel>
                                    <DatePicker
                                        id="license_issue_date"
                                        ref={field.ref}
                                        value={
                                            field.value
                                                ? dayjs(field.value).toDate()
                                                : null
                                        }
                                        onChange={(date) =>
                                            field.onChange(
                                                date
                                                    ? dayjs(date).format(
                                                          'YYYY-MM-DD'
                                                      )
                                                    : ''
                                            )
                                        }
                                        onBlur={field.onBlur}
                                        placeholder="Выберите дату выдачи"
                                        aria-invalid={fieldState.invalid}
                                        className="max-w-none"
                                        calendarProps={{
                                            disabled: { after: new Date() },
                                        }}
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                    </div>
                </div>

                <div className="mt-14 flex max-w-[500px] gap-3">
                    <Button
                        type="submit"
                        size="xl"
                        className="flex-1"
                        disabled={isSaving}
                    >
                        {isSaving
                            ? 'Сохранение...'
                            : isEditing
                              ? 'Сохранить изменения'
                              : 'Сохранить водителя'}
                    </Button>
                    <Button
                        type="button"
                        size="xl"
                        variant="outline"
                        className="px-8"
                        disabled={isSaving}
                        onClick={() => router.push('/admin/main/drivers')}
                    >
                        Отмена
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default DriverForm;
