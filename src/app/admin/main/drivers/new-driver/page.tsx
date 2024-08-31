'use client';
import React, { Suspense, useState } from 'react';
import Upload from '@/assets/admin/Upload';
import Button from '@/components/button';
import CalendarPC from '@/components/calendar/select-date';
import { driverSchema } from '@/data/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ErrorMessage from '@/components/error-message';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { postDriversAction } from '../actions';
import { useServerAction } from 'zsa-react';
import { useServerActionQuery } from '@/lib/server-action-hooks';

const NewDriver = () => {
    const [image, setImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string | null>(null);
    const [licenseDate, setLicenseDate] = useState<string | null>(null);

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<z.output<typeof driverSchema>>({
        resolver: zodResolver(driverSchema),
    });

    // const { execute, isPending } = useServerAction(postDriversAction, {
        
    //     onSuccess: async (data) => {
    //         await refetch();
    //         toast.success(data.data);
    //     },
    //     onError: ({ err }) => {
    //         toast.error(err.data);
    //     },
    // });
    
    
    // const onSubmit = handleSubmit(async (data) => {
    //     try {
    //         const formData = new FormData();
    
    //         // Добавляем данные формы в FormData
    //         formData.append('full_name', data.full_name);
    //         formData.append('date_of_birth', data.date_of_birth);
    //         formData.append('license_number', data.license_number);
    //         formData.append('license_issue_date', data.license_issue_date);
    
    //         // Добавляем изображение, если оно есть
    //         if (image) {
    //             const file = new File([image], fileName);
    //             formData.append('picture', file);
    //         }
    
    //         // Отправка данных с использованием execute или fetch
    //         execute({
    //             full_name: data.full_name,
    //             date_of_birth: data.date_of_birth,
    //             license_number: data.license_number,
    //             license_issue_date: data.license_issue_date,
    //             picture: image ? URL.createObjectURL(file) : null,
    //         });
    
    //         console.log('FormData успешно создана и отправлена');
    //     } catch (error) {
    //         console.error('Ошибка при создании FormData:', error);
    //     }
    // });
 

    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setFileName(file.name);
            setValue('picture', file); // Сохраняем файл в форму для валидации
        }
    };
    const handleBirthDateChange = (date: Date | null) => {
        const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
        setBirthDate(formattedDate);
        setValue('date_of_birth', formattedDate);
    };

    const handleLicenseDateChange = (date: Date | null) => {
        const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
        setLicenseDate(formattedDate);
        setValue('license_issue_date', formattedDate);
    };

    return (
        <form className="mt-6 flex flex-col" 
        // onSubmit={onSubmit}
        >
            <p className="text-[42px] font-semibold text-[#4A4A4A]">
                Добавить водителя
            </p>

            <div className="mb-28 mt-[14px] flex flex-col rounded-[20px] bg-white px-8 py-10">
                <div className="grid w-[800px] grid-cols-2 gap-5">
                    <div className="flex flex-row items-start gap-8">
                        <img
                            src={image || '/assets/admin/avatar.png'}
                            alt="Avatar preview"
                            className="mt-4 h-32 w-32 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <p className="text-nowrap text-2xl font-semibold text-[#4A4A4A]">
                                Загрузить фото водителя
                            </p>
                            <p className="mt-1 text-base font-semibold text-[#A0A0A0]">
                                *необязательно{' '}
                            </p>
                            <div className="mt-4 flex flex-row items-center gap-[18px]">
                                <div className="flex w-full gap-5 flex-row items-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative  w-full cursor-pointer rounded-[10px] border border-[#A0A0A0] p-4 pl-12 text-nowrap text-base font-medium text-[#4A4A4A]"
                                    >
                                        <div className="absolute left-0 top-0 p-4">
                                            <Upload color="#E74949" />
                                        </div>
                                        {fileName ? fileName : 'Загрузить фото'}{' '}
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <ErrorMessage
                                        message={errors?.picture?.message}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=""></div>
                </div>

                <div className="mt-11 grid w-[800px] grid-cols-2 gap-5">
                    <div className="flex w-full flex-col items-start gap-8">
                        <div className="flex w-full flex-col gap-6">
                            <label
                                htmlFor="FCs"
                                className="text-2xl flex flex-row justify-between font-semibold text-[#4A4A4A]"
                            >
                                ФИО водителя

                            </label>
                            <input
                                placeholder="Введите ФИО"
                                type="text"
                                className="focus:outlined-none w-full rounded-[10px] border border-[#4A4A4A] py-5 pl-6 outline-none"
                                {...register('full_name')}
                            />
                            <ErrorMessage
                                message={errors?.full_name?.message}
                            />
                        </div>
                        <div className="flex w-full flex-col gap-4">
                            <label
                                htmlFor="DriverCard"
                                className="text-2xl font-semibold text-[#4A4A4A]"
                            >
                                Номер водительских прав
                            </label>
                            <input
                                placeholder="Введите номер вод. прав"
                                type="text"
                                className="focus:outlined-none w-full rounded-[10px] border border-[#4A4A4A] py-5 pl-6 outline-none"
                                {...register('license_number')}
                            />
                            <ErrorMessage
                                message={errors?.license_number?.message}
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-col items-start gap-8">
                        <div className="flex w-full flex-col gap-6">
                            <label
                                htmlFor="birthday"
                                className="text-2xl font-semibold text-[#4A4A4A]"
                            >
                                Дата рождения
                            </label>
                            <Suspense>
                                <CalendarPC
                                    variant="secondary"
                                    value={birthDate ? new Date(birthDate) : null}
                                    onChange={handleBirthDateChange}
                                />
                                <ErrorMessage
                                    message={errors?.date_of_birth?.message}
                                />
                            </Suspense>
                        </div>
                        <div className="relative flex w-full flex-col gap-4">
                            <label
                                htmlFor="whenGiven"
                                className="text-2xl font-semibold text-[#4A4A4A]"
                            >
                                Дата выдачи водительских прав
                            </label>
                            <Suspense>
                                <CalendarPC
                                    variant="secondary"
                                    value={licenseDate ? new Date(licenseDate) : null}
                                    onChange={handleLicenseDateChange}
                                />
                                <ErrorMessage
                                    message={errors?.license_issue_date?.message}
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="mt-14 max-w-[290px]">
                    <Button variant="secondary">Сохранить водителя</Button>
                </div>
            </div>
        </form>
    );
};

export default NewDriver;
