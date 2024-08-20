import Button from '@/components/button';
import Input from '@/components/input';
import Topbar from '@/components/topbar';
import React from 'react';
import InputPhone from '@/components/inputPhone';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { contactsSchema } from '@/data/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '@/components/error-message';
import { Steps } from '../types';

type Props = {
    onContactsSubmit: (data: z.output<typeof contactsSchema>) => void;
    setStep: (step: Steps) => void;
    isLoading: boolean;
};
const Contacts = (props: Props) => {
    const { onContactsSubmit, setStep, isLoading } = props;
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<z.output<typeof contactsSchema>>({
        resolver: zodResolver(contactsSchema),
    });

    const onSubmit = handleSubmit((data) => {
        onContactsSubmit(data);
    });

    return (
        <>
            <Topbar onBack={() => setStep(Steps.Passengers)}>
                Покупка билета
            </Topbar>

            <div className="px-5">
                <form className="mt-10 flex flex-col" onSubmit={onSubmit}>
                    <p className="text-3xl font-medium text-[#4A4A4A]">
                        Контактные данные
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                        Мы скинем ваш билет на ваш номер телефона, и на
                        электронную почту
                    </p>
                    <div className="my-3 flex flex-col gap-2">
                        <InputPhone
                            id="userPhone"
                            label="None label here"
                            placeholder="+7 (___) ___ - __ - __"
                            mask="+7 (___) ___-__-__"
                            iconLeft={
                                <Image
                                    src={'/assets/main/kz.png'}
                                    width={24}
                                    height={26}
                                    alt="KZ"
                                />
                            }
                            {...register('phone')}
                        />
                        <ErrorMessage message={errors.phone?.message} />
                        <Input
                            label="Электронная почта (необязательно)"
                            {...register('email')}
                        />
                        <ErrorMessage message={errors.email?.message} />
                    </div>
                    <Button variant="secondary" loading={isLoading}>
                        Перейти к оплате
                    </Button>
                </form>
            </div>
        </>
    );
};

export default Contacts;
