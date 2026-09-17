'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { companyPhoneSchema, companyRegistrationSchema } from './schema';
import { registerCompany, sendCompanyCode } from './actions';

export default function CompanyRegistrationForm() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [sent, setSent] = useState(false);
    const [ready, setReady] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [retryAt, setRetryAt] = useState(0);
    const [seconds, setSeconds] = useState(0);
    useEffect(() => setReady(true), []);
    useEffect(() => {
        const tick = () =>
            setSeconds(Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)));
        tick();
        if (retryAt <= Date.now()) return;
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [retryAt]);

    async function send() {
        if (busy || seconds > 0) return;
        const parsed = companyPhoneSchema.safeParse(phone);
        if (!parsed.success) {
            setMessage(parsed.error.issues[0].message);
            return;
        }
        setBusy(true);
        try {
            const result = await sendCompanyCode(parsed.data);
            setMessage(result.message);
            if (result.ok) {
                setSent(true);
                setRetryAt(Date.now() + 60000);
            }
        } catch {
            setMessage('Не удалось связаться с сервером. Попробуйте ещё раз.');
        } finally {
            setBusy(false);
        }
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy || !sent) return;
        const values = Object.fromEntries(new FormData(event.currentTarget));
        const parsed = companyRegistrationSchema.safeParse({
            ...values,
            phone_number: phone,
        });
        if (!parsed.success) {
            setMessage(parsed.error.issues[0].message);
            return;
        }
        setBusy(true);
        setMessage('');
        try {
            const result = await registerCompany(parsed.data);
            if (result.ok) {
                router.replace('/admin/main/company');
                router.refresh();
            } else setMessage(result.message);
        } catch {
            setMessage(
                'Не удалось получить ответ сервера. Попробуйте ещё раз.'
            );
        } finally {
            setBusy(false);
        }
    }

    return (
        <form
            method="post"
            onSubmit={submit}
            className="mt-8 space-y-5 text-left"
        >
            <fieldset
                disabled={!ready || busy}
                className="grid min-w-0 gap-4 md:grid-cols-2"
            >
                <label className="block">
                    Название компании
                    <input
                        name="legal_name"
                        required
                        minLength={2}
                        maxLength={255}
                        autoComplete="organization"
                        className="mt-1 w-full rounded-lg border p-3"
                    />
                </label>
                <label className="block">
                    БИН / ИИН
                    <input
                        name="bin_iin"
                        inputMode="numeric"
                        required
                        pattern="[0-9]{12}"
                        maxLength={12}
                        className="mt-1 w-full rounded-lg border p-3"
                    />
                </label>
                <label className="block">
                    Город
                    <input
                        name="city"
                        required
                        maxLength={120}
                        autoComplete="address-level2"
                        className="mt-1 w-full rounded-lg border p-3"
                    />
                </label>
                <label className="block">
                    Email компании
                    <input
                        name="email"
                        type="email"
                        maxLength={254}
                        autoComplete="email"
                        className="mt-1 w-full rounded-lg border p-3"
                    />
                </label>
                <label className="block md:col-span-2">
                    Адрес
                    <input
                        name="address"
                        maxLength={500}
                        autoComplete="street-address"
                        className="mt-1 w-full rounded-lg border p-3"
                    />
                </label>
                <label className="block md:col-span-2">
                    ФИО владельца
                    <input
                        name="full_name"
                        required
                        minLength={3}
                        maxLength={255}
                        autoComplete="name"
                        className="mt-1 w-full rounded-lg border p-3"
                    />
                </label>
                <label className="block">
                    Пароль
                    <input
                        name="password"
                        type="password"
                        required
                        minLength={8}
                        maxLength={128}
                        autoComplete="new-password"
                        className="mt-1 w-full rounded-lg border p-3"
                    />
                </label>
                <label className="block">
                    Повторите пароль
                    <input
                        name="repeat_password"
                        type="password"
                        required
                        minLength={8}
                        maxLength={128}
                        autoComplete="new-password"
                        className="mt-1 w-full rounded-lg border p-3"
                    />
                </label>
                <div className="space-y-3 md:col-span-2">
                    <label className="block">
                        Телефон владельца
                        <input
                            name="phone_number"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            readOnly={sent}
                            type="tel"
                            required
                            maxLength={30}
                            placeholder="+7 700 000 00 00"
                            autoComplete="tel"
                            className="mt-1 w-full rounded-lg border p-3"
                        />
                    </label>
                    <p className="text-sm text-[#666]">
                        Телефон станет логином для входа. Нужен отдельный номер,
                        который ещё не зарегистрирован в Jol.
                    </p>
                    {sent && (
                        <button
                            type="button"
                            className="mr-4 text-sm underline"
                            onClick={() => {
                                setSent(false);
                                setMessage('');
                            }}
                        >
                            Изменить номер
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={seconds > 0}
                        onClick={send}
                        className="rounded-lg border border-[#E32B2B] px-4 py-2 font-semibold text-[#E32B2B] disabled:opacity-50"
                    >
                        {seconds > 0
                            ? `Повторить через ${seconds} с`
                            : sent
                              ? 'Отправить код ещё раз'
                              : 'Получить код по SMS'}
                    </button>
                </div>
                {sent && (
                    <label className="block md:col-span-2">
                        Код из SMS
                        <input
                            name="code"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            required
                            pattern="[0-9]{4}"
                            maxLength={4}
                            className="mt-1 w-full rounded-lg border p-3"
                        />
                    </label>
                )}
                <button
                    disabled={!sent}
                    className="rounded-xl bg-[#E32B2B] px-5 py-3 font-semibold text-white disabled:opacity-50 md:col-span-2"
                >
                    {busy ? 'Подождите…' : 'Создать кабинет компании'}
                </button>
            </fieldset>
            {message && (
                <p
                    role="status"
                    className="rounded-lg bg-[#FFF2F2] p-4 text-sm"
                >
                    {message}
                </p>
            )}
        </form>
    );
}
