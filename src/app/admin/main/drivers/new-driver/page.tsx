'use client';
import React, { useState } from 'react';
import Upload from '@/assets/admin/Upload';
import Calendar from '@/assets/admin/Calendar';
import InputMask from 'react-input-mask';
import BigAvatar from '@/assets/admin/BigAvatar';
import Button from '@/components/button';
import CalendarPC from '@/components/calendar/calendarPC'
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
        <div className="flex flex-col mt-6">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Добавить водителя</p>

            <div className="flex flex-col rounded-[20px] bg-white mt-[14px] py-10 px-8 mb-28">
                <div className="grid w-[800px] gap-5 grid-cols-2">
                    <div className="flex flex-row items-start gap-8">
                        <img
                            // "/assets/user-avatar.jpg"
                            src={image || "/assets/admin/avatar.png"} // Показываем загруженное изображение или дефолтное
                            alt="Avatar preview"
                            className="mt-4 w-32 h-32 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <p className="text-2xl font-semibold text-[#4A4A4A] text-nowrap">Загрузить фото водителя</p>
                            <p className="text-base font-semibold text-[#A0A0A0] mt-1">*необязательно </p>
                            <div className="flex flex-row gap-[18px] items-center mt-4">
                                <div className="flex flex-row items-center w-full" >
                                    <label
                                        htmlFor="file-upload"
                                        className="relative mr-14 w-full cursor-pointer p-4 pl-12 text-base font-medium text-[#4A4A4A] rounded-[10px] border border-[#A0A0A0]"
                                    >
                                        <div className="absolute top-0 left-0 p-4">
                                            <Upload color='#E74949' />
                                        </div>
                                        {fileName ? fileName : 'Загрузить фото'} {/* Отображение названия файла или текста по умолчанию */}
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


                <div className="grid w-[800px] gap-5 grid-cols-2 mt-11">
                    <div className="flex flex-col items-start w-full gap-8">
                        <div className="flex flex-col gap-6 w-full">
                            <label htmlFor="FCs"
                                className='text-2xl font-semibold text-[#4A4A4A]'>
                                ФИО водителя
                            </label>
                            <input
                                placeholder='Введите ФИО'
                                type="text"
                                name='FCs'
                                className='py-5 pl-6 border border-[#4A4A4A] rounded-[10px] focus:outlined-none outline-none w-full' />
                        </div>
                        <div className="flex flex-col gap-4 w-full">
                            <label htmlFor="DriverCard"
                                className='text-2xl font-semibold text-[#4A4A4A]'>
                                Номер водительских прав
                            </label>
                            <input
                                placeholder='Введите номер вод. прав'
                                type="text"
                                name='DriverCard'
                                className='py-5 pl-6 border border-[#4A4A4A] rounded-[10px] focus:outlined-none outline-none w-full' />
                        </div>
                    </div>
                    <div className="flex flex-col items-start w-full gap-8">
                        <div className="flex flex-col gap-6 w-full">
                            <label htmlFor="birthday"
                                className='text-2xl font-semibold text-[#4A4A4A]'>
                                Дата рождения
                            </label>
                            <CalendarPC variant='secondary'/>
                        </div>
                        <div className="flex flex-col relative gap-4 w-full">
                            <label htmlFor="whenGiven"
                                className='text-2xl font-semibold text-[#4A4A4A]'>
                                Дата выдачи водительских прав
                            </label>
                            <CalendarPC variant='secondary'/>

                        </div>
                    </div>
                </div>
                <Link href='/admin/main/drivers' className="max-w-[290px] mt-14">
                    <Button variant='secondary'>Сохранить водителя</Button>
                </Link>
            </div>
        </div>
    );
};

export default NewDriver;
