'use client';
import React, { Suspense, useState } from 'react';
import Upload from '@/assets/admin/Upload';
import Calendar from '@/assets/admin/Calendar';
import InputMask from 'react-input-mask';
import BigAvatar from '@/assets/admin/BigAvatar';
import Button from '@/components/button';
import CalendarPC from '@/components/calendar/select-date';
import Link from 'next/link';

const NewDriver = () => {
    const [image, setImage] = useState<string | null>(null); // Типизация состояния image
    const [fileName, setFileName] = useState<string>(''); // Типизация состояния fileName

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setFileName(file.name); // Обновление названия файла
        }
    };

    return (
        <div className="mt-6 mb-32 flex flex-col">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">
                Добавить водителя
            </p>

            <div className="mb-28 mt-[14px] flex flex-col rounded-[20px] bg-white px-8 py-10">
                <div className="grid w-[800px] grid-cols-2 gap-5">
                    <div className="flex flex-row items-start gap-8">
                        <img
                            // "/assets/user-avatar.jpg"
                            src={image || '/assets/admin/avatar.png'} // Показываем загруженное изображение или дефолтное
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
                                <div className="flex w-full flex-row items-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative mr-14 w-full cursor-pointer rounded-[10px] border border-[#A0A0A0] p-4 pl-12 text-base font-medium text-[#4A4A4A]"
                                    >
                                        <div className="absolute left-0 top-0 p-4">
                                            <Upload color="#E74949" />
                                        </div>
                                        {fileName ? fileName : 'Загрузить фото'}{' '}
                                        {/* Отображение названия файла или текста по умолчанию */}
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
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
                                className="text-2xl font-semibold text-[#4A4A4A]"
                            >
                                ФИО водителя
                            </label>
                            <input
                                placeholder="Введите ФИО"
                                type="text"
                                name="FCs"
                                className="focus:outlined-none w-full rounded-[10px] border border-[#4A4A4A] py-5 pl-6 outline-none"
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
                                name="DriverCard"
                                className="focus:outlined-none w-full rounded-[10px] border border-[#4A4A4A] py-5 pl-6 outline-none"
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
                                <CalendarPC variant="secondary" />
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
                                <CalendarPC variant="secondary" />
                            </Suspense>
                        </div>
                    </div>
                </div>
                <Link
                    href="/admin/main/drivers"
                    className="mt-14 max-w-[290px]"
                >
                    <Button variant="secondary">Сохранить водителя</Button>
                </Link>
            </div>
        </div>
    );
};

export default NewDriver;
