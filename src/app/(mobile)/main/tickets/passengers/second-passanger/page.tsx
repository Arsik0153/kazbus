'use client';
import React, { useState } from 'react';
import Input from '@/components/input';
import RadioInput from '@/components/radio-input';
import Calendar from '@/assets/calendar';
import Button from '@/components/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { profileSchema } from '@/data/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '@/components/error-message';
import { useServerAction } from 'zsa-react';
import { documentTypes } from '@/static/constants';
import { updatePersonalInfoAction } from './actions';
import Topbar from '@/components/topbar';

const NewUser = () => {
    const { execute, isPending } = useServerAction(updatePersonalInfoAction, {
        onSuccess: (data) => {
            console.log('Success', data);
        },
        onError: (error) => {
            console.log('Error', error);
        },
    });
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm<z.output<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
    });

    const onSubmit = handleSubmit((data) => {
        console.log('Form Data:', data);
        execute(data);

    });

    const documentType = watch('document_type');

    return (
        <>
            <Topbar backHref='/main/tickets/passengers'>
                <div className="flex flex-col items-center">
                    Покупка билета
                </div>
            </Topbar>
            <div className="flex flex-col  px-5">
                <form className="mt-10" onSubmit={onSubmit}>
                    <p className="mb-3 text-3xl font-medium text-[#4A4A4A]">
                        Данные пассажира
                    </p>
                    <Input
                        label="Фио пассажира"
                        id="full_name"
                        {...register('full_name')}
                    />
                    <ErrorMessage message={errors.full_name?.message} />
                    <p className="text-sm font-medium text-[#A0A0A0] mt-3">При посадке в автобус ФИО будет сверяться с документом. Пишите без сокращений.</p>
                    <p className="mb-3 mt-9 text-xl font-medium text-[#4A4A4A]">
                        Выберите тип документа
                    </p>
                    <div className="flex flex-col gap-2">
                        {documentTypes.map((item) => (
                            <RadioInput
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
                            <Input
                                label="Дата рождения"
                                id="birth_date"
                                iconLeft={<Calendar color="#E74949" />}
                                {...register('birth_date')}
                            />
                            <ErrorMessage message={errors.birth_date?.message} />
                        </div>
                    </div>
                    <Button variant="primary" loading={isPending}>
                        Закончить регистрацию
                    </Button>
                </form>
            </div>
        </>

    );
};

export default NewUser;
