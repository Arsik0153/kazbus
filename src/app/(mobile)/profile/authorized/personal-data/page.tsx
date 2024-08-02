'use client';
import React, { useState } from 'react';
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
import Calendar from '../../../../../../public/assets/calendar';
import Button from '@/components/button';

const PersonalDataPage = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm<z.output<typeof editProfileSchema>>({
        resolver: zodResolver(editProfileSchema),
    });

    const onSubmit = handleSubmit((data) => {
        // execute(data);
    });

    const documentType = watch('document_type');

    return (
        <>
            <Topbar backHref="/profile/authorized">Мои личные данные</Topbar>
            <div className="h-full px-5">
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
                            <Input
                                label="Дата рождения"
                                id="birth_date"
                                iconLeft={<Calendar color="#E74949" />}
                                {...register('birth_date')}
                            />
                            <ErrorMessage
                                message={errors.birth_date?.message}
                            />
                        </div>
                    </div>
                    <Button variant="secondary" loading={false}>
                        Закончить регистрацию
                    </Button>
                </form>
            </div>
        </>
    );
};

export default PersonalDataPage;
