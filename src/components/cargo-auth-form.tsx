'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/button';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
import { Button as AdminButton } from '@/components/ui/button';
import { CargoForm, CargoInput, CargoTextarea } from '@/components/cargo/form';
import { cargoFormSchemas } from '@/lib/cargo-validation';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { cargoLoginAction, cargoRegisterAction } from '@/actions/cargo';
import type { CargoRole } from '@/lib/cargo-contract';

type Props = {
    role: CargoRole;
    mode: 'login' | 'register';
    title: string;
    destination: string;
    alternateHref: string;
};

export default function CargoAuthForm({
    role,
    mode,
    title,
    destination,
    alternateHref,
}: Props) {
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [busy, setBusy] = useState(false);
    useEffect(() => setReady(true), []);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    function reportError(message: string) {
        if (role === 'admin_cargo') toast.error(message);
        else setError(message);
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setError('');
        setFieldErrors({});

        const form = new FormData(event.currentTarget);
        const phone = String(form.get('phone_number') ?? '');
        const password = String(form.get('password') ?? '');
        try {
            const response =
                mode === 'login'
                    ? await cargoLoginAction({
                          role,
                          phone_number: phone,
                          password,
                      })
                    : await cargoRegisterAction({
                          role,
                          phone_number: phone,
                          password,
                          password_confirm: String(
                              form.get('password_confirm') ?? ''
                          ),
                          full_name: String(form.get('full_name') ?? ''),
                          company_name: String(form.get('company_name') ?? ''),
                          bin_iin: String(form.get('bin_iin') ?? ''),
                          city: String(form.get('city') ?? ''),
                          contact_phone: String(
                              form.get('contact_phone') ?? phone
                          ),
                          email: String(form.get('email') ?? ''),
                          description: String(form.get('description') ?? ''),
                          invite_token: String(form.get('invite_token') ?? ''),
                      });

            if (!response.ok) {
                setFieldErrors(response.fieldErrors ?? {});
                reportError(response.error);
                return;
            }

            router.replace(destination);
            router.refresh();
        } catch {
            reportError(
                'Не удалось получить ответ сервера. Попробуйте ещё раз.'
            );
        } finally {
            setBusy(false);
        }
    }

    const isAdmin = role === 'admin_cargo';
    const isDriver = role === 'cargo_driver';

    if (isAdmin) {
        return (
            <div className="flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-[#E32B2B]">
                        {mode === 'login'
                            ? 'Авторизация перевозчика'
                            : 'Регистрация перевозчика'}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-sm">
                        {mode === 'login'
                            ? 'Войдите в кабинет Jol Cargo'
                            : 'Создайте кабинет вашей логистической компании'}
                    </p>
                </div>
                <CargoForm
                    serverErrors={fieldErrors}
                    method="post"
                    onSubmit={submit}
                    schema={
                        mode === 'login'
                            ? cargoFormSchemas.login
                            : cargoFormSchemas.registration
                    }
                >
                    {mode === 'register' && (
                        <>
                            <CargoInput
                                aria-label="ФИО"
                                id="adminCargoName"
                                name="full_name"
                                required
                                autoComplete="name"
                            />
                            <CargoInput
                                aria-label="Название компании"
                                id="adminCargoCompany"
                                name="company_name"
                                required
                                autoComplete="organization"
                            />
                            <CargoInput
                                aria-label="Город"
                                id="adminCargoCity"
                                name="city"
                                required
                                autoComplete="address-level2"
                            />
                            <CargoInput
                                aria-label="БИН / ИИН"
                                id="adminCargoBin"
                                name="bin_iin"
                                inputMode="numeric"
                                maxLength={12}
                                pattern="[0-9]{12}"
                                required
                            />
                            <CargoInput
                                aria-label="Контактный телефон"
                                id="adminCargoContact"
                                name="contact_phone"
                                type="tel"
                                required
                                autoComplete="tel"
                                placeholder="77010000000"
                            />
                            <CargoInput
                                aria-label="Email"
                                id="adminCargoEmail"
                                name="email"
                                type="email"
                                autoComplete="email"
                            />
                            <CargoTextarea
                                aria-label="О компании"
                                id="adminCargoDescription"
                                name="description"
                                rows={3}
                            />
                        </>
                    )}
                    <CargoInput
                        aria-label="Телефон для входа"
                        id="adminCargoPhone"
                        name="phone_number"
                        type="tel"
                        inputMode="tel"
                        autoComplete="username"
                        placeholder="77010000000"
                        required
                    />
                    <CargoInput
                        aria-label="Пароль"
                        id="adminCargoPassword"
                        name="password"
                        type="password"
                        minLength={mode === 'register' ? 8 : undefined}
                        required
                        autoComplete={
                            mode === 'login'
                                ? 'current-password'
                                : 'new-password'
                        }
                    />
                    {mode === 'register' && (
                        <CargoInput
                            name="password_confirm"
                            aria-label="Повторите пароль"
                            type="password"
                            required
                            autoComplete="new-password"
                        />
                    )}
                    <AdminButton
                        type="submit"
                        size="lg"
                        disabled={!ready || busy}
                    >
                        {busy
                            ? 'Отправляем…'
                            : mode === 'login'
                              ? 'Войти в кабинет'
                              : 'Создать аккаунт'}
                    </AdminButton>
                </CargoForm>
                <Link
                    href={alternateHref}
                    className="text-primary text-center text-sm font-semibold underline underline-offset-4"
                >
                    {mode === 'login'
                        ? 'Зарегистрировать компанию'
                        : 'У меня уже есть аккаунт'}
                </Link>
            </div>
        );
    }

    if (isDriver) {
        return (
            <form className="w-full" method="post" onSubmit={submit}>
                <h1 className="text-[1.75rem] leading-8 font-bold text-[#4A4A4A]">
                    {mode === 'login' ? 'Вход' : 'Регистрация'}
                </h1>
                <p className="mt-3 text-lg leading-5 font-bold text-[#4A4A4A]">
                    {mode === 'login' ? 'Joool Cargo' : title}
                </p>
                <div className="mt-6 flex flex-col gap-2">
                    {mode === 'register' && (
                        <>
                            <Input
                                id="cargoFullName"
                                name="full_name"
                                label="ФИО"
                                required
                                autoComplete="name"
                            />
                            <Input
                                id="cargoInvite"
                                name="invite_token"
                                label="Приглашение компании"
                                required
                                aria-describedby="cargoInviteHelp"
                            />
                            <p
                                id="cargoInviteHelp"
                                className="mb-2 text-sm text-[#A0A0A0]"
                            >
                                Одноразовый код выдаёт ваша логистическая
                                компания.
                            </p>
                        </>
                    )}
                    <InputPhone
                        id="cargoPhone"
                        name="phone_number"
                        label="Телефон"
                        aria-label="Телефон"
                        type="tel"
                        inputMode="tel"
                        required
                        autoComplete="tel"
                        mask="+7 (___) ___-__-__"
                        iconLeft={
                            <Image
                                src="/assets/main/kz.png"
                                width={24}
                                height={26}
                                alt="KZ"
                                quality={100}
                            />
                        }
                    />
                    <Input
                        id="cargoPassword"
                        name="password"
                        label="Пароль"
                        type="password"
                        minLength={8}
                        required
                        autoComplete={
                            mode === 'login'
                                ? 'current-password'
                                : 'new-password'
                        }
                    />
                </div>
                {error && (
                    <p className="mt-4 text-sm text-[#E23333]" role="alert">
                        {error}
                    </p>
                )}
                <Button
                    variant="secondary"
                    type="submit"
                    className="mt-6"
                    disabled={!ready || busy}
                >
                    {busy
                        ? 'Отправляем…'
                        : mode === 'login'
                          ? 'Войти'
                          : 'Создать аккаунт'}
                </Button>
                <Link
                    className="mt-4 block w-full text-center text-base font-medium text-[#E23333] underline"
                    href={alternateHref}
                >
                    {mode === 'login'
                        ? 'Зарегистрироваться'
                        : 'Уже есть аккаунт'}
                </Link>
            </form>
        );
    }

    return (
        <form className="sp-form" method="post" onSubmit={submit}>
            <h1>{title}</h1>
            {mode === 'register' && (
                <>
                    <label>
                        ФИО
                        <input name="full_name" required autoComplete="name" />
                    </label>
                    <>
                        <label>
                            Компания
                            <input name="company_name" required />
                        </label>
                        <label>
                            Город
                            <input name="city" required />
                        </label>
                        <label>
                            БИН / ИИН
                            <input name="bin_iin" maxLength={12} />
                        </label>
                    </>
                </>
            )}
            <label>
                Телефон
                <input
                    name="phone_number"
                    type="tel"
                    inputMode="tel"
                    placeholder="77010000000"
                    required
                    autoComplete="tel"
                />
            </label>
            <label>
                Пароль
                <input
                    name="password"
                    type="password"
                    minLength={8}
                    required
                    autoComplete={
                        mode === 'login' ? 'current-password' : 'new-password'
                    }
                />
            </label>
            {error && (
                <p className="sp-error" role="alert">
                    {error}
                </p>
            )}
            <button className="sp-button" disabled={!ready || busy}>
                {busy
                    ? 'Отправляем…'
                    : mode === 'login'
                      ? 'Войти'
                      : 'Создать аккаунт'}
            </button>
            <Link className="sp-link" href={alternateHref}>
                {mode === 'login'
                    ? 'Создать аккаунт'
                    : 'У меня уже есть аккаунт'}
            </Link>
        </form>
    );
}
