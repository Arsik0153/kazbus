import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/button';
import Input from '@/components/input';

export default function AdminRegistrationPage() {
    return (
        <div className="flex min-h-screen items-start justify-center overflow-y-hidden bg-[#E32B2B]">
            <Image
                src="/Ellipse.svg"
                width={622}
                height={750}
                className="pointer-events-none absolute left-0 top-0"
                alt=""
            />
            <Image
                src="/Ellipse.svg"
                width={622}
                height={750}
                className="pointer-events-none absolute right-0 top-0"
                alt=""
            />

            <div className="relative z-10 mt-12 flex w-full max-w-[760px] flex-col items-center px-6 pb-12">
                <Image src="/logo.svg" width={80} height={80} alt="Logo" />

                <div className="mt-8 w-full rounded-[28px] bg-white px-8 pb-8 pt-10 shadow-md">
                    <div className="max-w-3xl">
                        <p className="text-center text-4xl font-bold text-[#E32B2B]">
                            Регистрация автобусной компании
                        </p>
                        <p className="mt-4 text-center text-base font-medium text-[#8A8A8A]">
                            Экран подготовлен под self-service onboarding
                            автобусных компаний в кабинет `admin`. После
                            подключения backend-контракта компания сможет сама
                            создать свой tenant и начать заполнять автобусы,
                            маршруты, водителей и рейсы.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <Input
                            id="company_name"
                            label="Название компании"
                            autoComplete="organization"
                        />
                        <Input
                            id="company_bin"
                            label="БИН / ИИН компании"
                            autoComplete="off"
                        />
                        <Input
                            id="company_city"
                            label="Город"
                            autoComplete="address-level2"
                        />
                        <Input
                            id="company_phone"
                            label="Контактный телефон"
                            autoComplete="tel"
                        />
                        <Input
                            id="company_email"
                            label="Email"
                            autoComplete="email"
                        />
                        <Input
                            id="admin_full_name"
                            label="ФИО первого администратора"
                            autoComplete="name"
                        />
                        <div className="md:col-span-2">
                            <Input
                                id="admin_password"
                                type="password"
                                label="Пароль"
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="mt-6 rounded-[20px] bg-[#F8FAFC] px-6 py-5">
                        <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#A0A0A0]">
                            Planned state
                        </p>
                        <p className="mt-2 text-base font-medium text-[#4A4A4A]">
                            Backend-контракт self-service регистрации компании
                            пока не подключен, поэтому форма добавлена как
                            готовая верстка и не отправляет данные.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        <Button variant="secondary" disabled>
                            Регистрация будет подключена после готовности API
                        </Button>
                        <div className="text-center">
                            <Link
                                href="/admin"
                                className="text-base font-semibold text-[#E32B2B] underline underline-offset-4"
                            >
                                У меня уже есть кабинет
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
