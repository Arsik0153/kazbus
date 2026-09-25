import {
    LayoutDashboard,
    Package,
    Route,
    Users,
    Contact,
    Truck,
    Warehouse,
    Building2,
} from 'lucide-react';

export const cargoNavigation = [
    {
        href: '/admin-cargo',
        label: 'Обзор',
        icon: LayoutDashboard,
        description: 'Заказы, рейсы и ресурсы вашей компании.',
    },
    {
        href: '/admin-cargo/orders',
        label: 'Заказы',
        icon: Package,
        description: 'Предложения, назначение рейсов и документы грузов.',
    },
    {
        href: '/admin-cargo/trips',
        label: 'Рейсы',
        icon: Route,
        description: 'Статусы перевозок, водители и сроки доставки.',
    },
    {
        href: '/admin-cargo/clients',
        label: 'Клиенты',
        icon: Users,
        description: 'Запросы грузоотправителей и сотрудничество.',
    },
    {
        href: '/admin-cargo/drivers',
        label: 'Водители',
        icon: Contact,
        description: 'Водители, приглашения и личные документы.',
    },
    {
        href: '/admin-cargo/vehicles',
        label: 'Автопарк',
        icon: Truck,
        description: 'Грузовые автомобили и грузоподъёмность.',
    },
    {
        href: '/admin-cargo/warehouses',
        label: 'Склады и остатки',
        icon: Warehouse,
        description: 'Приёмка грузов и корректировка складских остатков.',
    },
    {
        href: '/admin-cargo/company',
        label: 'Профиль компании',
        icon: Building2,
        description: 'Контакты, услуги и видимость для грузоотправителей.',
    },
];
