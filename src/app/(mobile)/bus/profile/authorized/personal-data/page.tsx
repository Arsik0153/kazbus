'use client';
import React, { useEffect, useState } from 'react';
import Topbar from '@/components/topbar';
import NewUser from '../../registration/_components/new-user';
import { editProfileSchema } from '@/data/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Input from '@/components/input';
import ErrorMessage from '@/components/error-message';
import { documentTypes } from '@/static/constants';
import Radio from '@/components/radio-input';
import Calendar from '@/assets/calendar';
import Button from '@/components/button';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getPersonalInfoAction, updatePersonalInfoAction } from './actions';
import { dateToReadable } from '@/utils/helper.';
import Spinner from '@/components/spinner';
import { useServerAction } from 'zsa-react';
import toast from 'react-hot-toast';
import { InputMask } from '@react-input/mask';
import PersonalDataSkeleton from './skeleton';

const PersonalDataPage = () => {
    const { data, isLoading, refetch } = useServerActionQuery(
        getPersonalInfoAction,
        {
            input: undefined,
            queryKey: ['personal-info'],
        }
    );

    const { execute, isPending } = useServerAction(updatePersonalInfoAction, {
        onSuccess: async (data) => {
            await refetch();
            toast.success(data.data);
        },
        onError: ({ err }) => {
            toast.error(err.data);
        },
    });

    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm<z.output<typeof editProfileSchema>>({
        resolver: zodResolver(editProfileSchema),
    });

    const onSubmit = handleSubmit((data) => {
        execute(data);
    });

    const documentType = watch('document_type');

    useEffect(() => {
        if (data) {
            const formattedDate = dateToReadable(data.birth_date);
            reset({
                ...data,
                birth_date: formattedDate,
            });
        }
    }, [data, reset]);

    if (isLoading) {
        return <PersonalDataSkeleton />;
    }

    return (
        <>
            <Topbar backHref="/bus/profile">Мои личные данные</Topbar>
            <div className="fade-in h-full px-5">
                <form className="mt-10" onSubmit={onSubmit}>
                    <p className="mb-3 mt-9 text-xl font-medium text-[#4A4A4A]">
                        Тип документа
                    </p>
                    <div className="flex flex-col gap-2">
                        {documentTypes.map((item) => (
                            <Radio
                                key={item.value}
                                label={item.label}
                                value={item.value}
                                checked={documentType === item.value}
                                {...register('document_type')}
                            />
                        ))}
                    </div>
                    <ErrorMessage message={errors.document_type?.message} />
                    <div className="mb-8 mt-10 flex flex-col gap-2">
                        <div>
                            <Input
                                label="Номер документа или ИИН"
                                id="iin"
                                {...register('document_number_or_iin')}
                            />
                            <ErrorMessage
                                message={errors.document_number_or_iin?.message}
                            />
                        </div>
                        <div>
                            <InputMask
                                component={Input}
                                label="Дата рождения"
                                id="birth_date"
                                type="tel"
                                iconLeft={<Calendar color="#E74949" />}
                                mask="__.__.____"
                                replacement="_"
                                {...register('birth_date')}
                            />
                            <ErrorMessage
                                message={errors.birth_date?.message}
                            />
                        </div>
                    </div>
                    <Button variant="secondary" loading={isPending}>
                        Сохранить
                    </Button>
                </form>
            </div>
        </>
    );
};

export default PersonalDataPage;
