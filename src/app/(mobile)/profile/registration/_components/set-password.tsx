import Button from '@/components/button';
import ErrorMessage from '@/components/error-message';
import Input from '@/components/input';
import { passwordSchema } from '@/data/schemas';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { setPasswordAction } from '../actions';
import { useServerAction } from 'zsa-react';
import { Steps } from '../types';
import toast from 'react-hot-toast';

type Props = {
    setStep: React.Dispatch<React.SetStateAction<Steps>>;
};

const SetPassword = (props: Props) => {
    const { setStep } = props;

    const { execute, isPending } = useServerAction(setPasswordAction, {
        onSuccess: () => {
            setStep(Steps.NEW_USER);
        },
        onError: (error) => {
            toast.error(error.err.message);
        },
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<z.output<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = handleSubmit((data) => {
        execute(data);
    });

    return (
        <form className="mt-24 flex flex-col gap-2" onSubmit={onSubmit}>
            <p className="mb-3 text-4xl font-semibold text-[#4A4A4A]">
                Придумайте <br /> пароль
            </p>
            <div>
                <Input
                    id="password"
                    label="Введите новый пароль"
                    type="password"
                    placeholder="Введите новый пароль"
                    {...register('password')}
                />
                <ErrorMessage message={errors.password?.message} />
            </div>
            <div>
                <Input
                    id="repeatPassword"
                    label="Повторите пароль"
                    type="password"
                    placeholder="Повторите пароль"
                    {...register('repeatPassword')}
                />
                <ErrorMessage message={errors.repeatPassword?.message} />
            </div>

            <Button
                variant="secondary"
                className="mb-3 mt-4"
                loading={isPending}
            >
                Закончить регистрацию
            </Button>
        </form>
    );
};

export default SetPassword;
