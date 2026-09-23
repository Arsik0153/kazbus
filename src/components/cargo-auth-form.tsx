'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/button';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
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

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setError('');

        const form = new FormData(event.currentTarget);
        const phone = String(form.get('phone_number') ?? '').replace(/\D/g, '');
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
                          full_name: String(form.get('full_name') ?? ''),
                          company_name: String(form.get('company_name') ?? ''),
                          bin_iin: String(form.get('bin_iin') ?? ''),
                          city: String(form.get('city') ?? ''),
                          contact_phone: String(
                              form.get('contact_phone') ?? phone
                          ).replace(/\D/g, ''),
                          email: String(form.get('email') ?? ''),
                          description: String(form.get('description') ?? ''),
                          invite_token: String(form.get('invite_token') ?? ''),
                      });

            if (!response.ok) {
                setError(response.error);
                return;
            }

            router.replace(destination);
            router.refresh();
        } catch {
            setError('Не удалось получить ответ сервера. Попробуйте ещё раз.');
        } finally {
            setBusy(false);
        }
    }

    const isAdmin = role === 'admin_cargo';
    const isDriver = role === 'cargo_driver';

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
                    {!isDriver && (
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
                    )}
                    {isAdmin && (
                        <>
                            <label>
                                Контактный телефон
                                <input
                                    name="contact_phone"
                                    type="tel"
                                    required
                                />
                            </label>
                            <label>
                                Email
                                <input name="email" type="email" />
                            </label>
                            <label>
                                О компании
                                <textarea name="description" rows={3} />
                            </label>
                        </>
                    )}
                    {isDriver && (
                        <label>
                            Приглашение компании
                            <input name="invite_token" required />
                            <small>
                                Одноразовый код выдаёт ваша логистическая
                                компания.
                            </small>
                        </label>
                    )}
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
