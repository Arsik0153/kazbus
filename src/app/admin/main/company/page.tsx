import Link from 'next/link';
import {
    Building2,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Users,
} from 'lucide-react';

import AdminInfoField from '@/components/admin/info-field';
import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';

const capabilityCards = [
    {
        title: 'Изолированный tenant-контур',
        description:
            'Все автобусы, водители, маршруты и рейсы компании должны жить только внутри ее собственного B2B-контура.',
        icon: ShieldCheck,
    },
    {
        title: 'Самостоятельное наполнение данных',
        description:
            'Компания сама управляет профилем, составом автопарка и операционными сущностями без участия внутреннего администратора платформы.',
        icon: Building2,
    },
    {
        title: 'Ролевая ответственность',
        description:
            'Первый зарегистрированный пользователь становится владельцем tenant-а и получает основной административный доступ.',
        icon: Users,
    },
];

export default function AdminCompanyPage() {
    return (
        <div className="mt-6 flex flex-col gap-5">
            <div className="rounded-[20px] bg-white px-8 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                            Профиль автобусной компании
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Здесь собирается основной B2B-профиль автопарка:
                            юридические данные, контакты, адрес, статус компании
                            и настройка владельца tenant-контура.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/admin/registration">
                                Открыть onboarding
                            </Link>
                        </Button>
                        <Button size="lg" disabled>
                            Сохранение профиля подключится позже
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {capabilityCards.map(({ title, description, icon: Icon }) => (
                    <div
                        key={title}
                        className="rounded-[20px] bg-white px-6 py-6"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]">
                            <Icon className="h-6 w-6 text-[#E74949]" />
                        </div>
                        <p className="mt-4 text-xl font-semibold text-[#4A4A4A]">
                            {title}
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            {description}
                        </p>
                    </div>
                ))}
            </div>

            <AdminSectionCard
                title="Основные реквизиты"
                description="Набор полей соответствует требованиям PRD для профиля автобусной компании."
            >
                <div className="grid grid-cols-2 gap-4">
                    <AdminInfoField
                        label="Название компании"
                        value="Будет задаваться владельцем tenant-а"
                    />
                    <AdminInfoField
                        label="БИН / ИИН"
                        value="Будет храниться в карточке компании"
                    />
                    <AdminInfoField
                        label="Город"
                        value="Нужен для локализации автопарка и маршрутов"
                    />
                    <AdminInfoField
                        label="Контактный телефон"
                        value="Используется для операционной связи"
                    />
                    <AdminInfoField
                        label="Email"
                        value="Канал для уведомлений и доступа"
                    />
                    <AdminInfoField
                        label="Статус компании"
                        value="active / onboarding / blocked"
                        hint="Финальный словарь статусов должен быть синхронизирован с backend."
                    />
                    <div className="col-span-2">
                        <AdminInfoField
                            label="Юридический или фактический адрес"
                            value="Отдельное поле профиля компании"
                        />
                    </div>
                </div>
            </AdminSectionCard>

            <AdminSectionCard
                title="Контакты и зона ответственности"
                description="Эта зона описывает, кто управляет tenant-контуром и как компания обслуживает свой операционный контур."
            >
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5">
                        <Building2 className="h-5 w-5 text-[#E74949]" />
                        <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                            Юридический профиль
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            Отвечает за бренд-название, идентификаторы компании,
                            адрес и общий operational status перевозчика.
                        </p>
                    </div>
                    <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5">
                        <Phone className="h-5 w-5 text-[#E74949]" />
                        <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                            Операционные контакты
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            Данные нужны для связи по рейсам, сбоям, техосмотру
                            и внутренним действиям по автопарку.
                        </p>
                    </div>
                    <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5">
                        <Mail className="h-5 w-5 text-[#E74949]" />
                        <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                            Доступы и уведомления
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            Email и владелец tenant-а станут базой для будущих
                            приглашений сотрудников и контроля доступа.
                        </p>
                    </div>
                </div>
            </AdminSectionCard>

            <AdminSectionCard
                title="Что еще должно появиться"
                description="Эти блоки можно подключать постепенно, не ломая текущую структуру /admin."
            >
                <div className="grid grid-cols-2 gap-4">
                    <AdminInfoField
                        label="Адрес автопарка"
                        value="Нужен для карточки компании и проверок"
                    />
                    <AdminInfoField
                        label="История изменений профиля"
                        value="Будет логироваться для аудита"
                    />
                    <AdminInfoField
                        label="Список сотрудников компании"
                        value="Следующий шаг после self-service регистрации"
                    />
                    <AdminInfoField
                        label="Статус модерации компании"
                        value="Появится после согласования с backend-контрактом"
                    />
                </div>
            </AdminSectionCard>
        </div>
    );
}
