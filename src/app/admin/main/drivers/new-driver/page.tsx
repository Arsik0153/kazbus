'use client';
import React, { useEffect, useRef, useState } from 'react';
import Upload from '@/assets/admin/Upload';
import { driverSchema } from '@/data/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { DatePicker } from '@/components/ui/date-picker';

const NewDriver = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        control,
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<z.output<typeof driverSchema>>({
        resolver: zodResolver(driverSchema),
        mode: 'onChange',
        defaultValues: {
            full_name: '',
            date_of_birth: '',
            license_number: '',
            license_issue_date: '',
            picture: undefined,
        },
    });

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const onSubmit = handleSubmit((data) => {
        console.log('Данные нового водителя:', data);
    });

    return (
        <form className="mt-6 flex flex-col" onSubmit={onSubmit} noValidate>
            <p className="text-2xl font-semibold text-[#4A4A4A]">
                Добавить водителя
            </p>

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
                                <div className="flex flex-row items-start gap-8">
                                    <img
                                        src={
                                            imagePreview ||
                                            '/assets/admin/avatar.png'
                                        }
                                        alt="Предпросмотр фото водителя"
                                        className="mt-4 h-32 w-32 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <FieldLabel
                                            htmlFor="picture"
                                            className="text-nowrap text-lg font-semibold text-[#4A4A4A]"
                                        >
                                            Загрузить фото водителя
                                        </FieldLabel>
                                        <p className="mt-1 text-base font-medium text-[#A0A0A0]">
                                            Необязательно, до 5 MB
                                        </p>
                                        <label
                                            htmlFor="picture"
                                            className="relative mt-4 cursor-pointer text-nowrap rounded-[10px] border border-[#A0A0A0] p-4 pl-12 text-base font-medium text-[#4A4A4A]"
                                        >
                                            <span className="absolute left-0 top-0 p-4">
                                                <Upload color="#E74949" />
                                            </span>
                                            {field.value?.name ??
                                                'Загрузить фото'}
                                        </label>
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
                                                setImagePreview(
                                                    file
                                                        ? URL.createObjectURL(
                                                              file
                                                          )
                                                        : null
                                                );
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
                    <div className="flex w-full flex-col items-start gap-8">
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
                                Номер водительских прав
                            </FieldLabel>
                            <Input
                                id="license_number"
                                aria-invalid={Boolean(errors.license_number)}
                                placeholder="Введите номер вод. прав"
                                {...register('license_number')}
                            />
                            <FieldError errors={[errors.license_number]} />
                        </Field>
                    </div>
                    <div className="flex w-full flex-col items-start gap-8">
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
                                        Дата выдачи водительских прав
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
                <div className="mt-14 flex max-w-[420px] gap-3">
                    <Button type="submit" size="xl" className="flex-1">
                        Сохранить водителя
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default NewDriver;
