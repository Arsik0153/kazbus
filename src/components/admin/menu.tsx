'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, FileText, LayoutDashboard, MapPinned } from 'lucide-react';

import Anal from '@/assets/admin/anal';
import BusFront from '@/assets/admin/BusFront';
import Coin from '@/assets/admin/Coin';
import Direction from '@/assets/admin/Direction';
import Route from '@/assets/admin/Route';
import Support from '@/assets/admin/Support';
import User from '@/assets/admin/User';

const navigationGroups = [
    {
        label: 'Управление',
        items: [
            {
                href: '/admin/main',
                label: 'Обзор',
                icon: <LayoutDashboard className="h-5 w-5" />,
            },
            {
                href: '/admin/main/trips',
                label: 'Рейсы',
                icon: <Route color="#fff" width={20} height={20} />,
            },
            {
                href: '/admin/main/buses',
                label: 'Автобусы',
                icon: <BusFront color="#fff" width={20} height={20} />,
            },
            {
                href: '/admin/main/drivers',
                label: 'Водители',
                icon: <User color="#fff" width={20} height={20} />,
            },
            {
                href: '/admin/main/routes',
                label: 'Маршруты',
                icon: <Direction color="#fff" width={20} height={20} />,
            },
        ],
    },
    {
        label: 'Компания',
        items: [
            {
                href: '/admin/main/company',
                label: 'Профиль компании',
                icon: <Building2 className="h-5 w-5" />,
            },
            {
                href: '/admin/main/documents',
                label: 'Документы',
                icon: <FileText className="h-5 w-5" />,
            },
            {
                href: '/admin/main/monitoring',
                label: 'Мониторинг',
                icon: <MapPinned className="h-5 w-5" />,
            },
        ],
    },
    {
        label: 'Информация',
        items: [
            {
                href: '/admin/main/analytics',
                label: 'Аналитика',
                icon: <Anal color="#fff" width={20} height={20} />,
            },
            {
                href: '/admin/main/payouts',
                label: 'Выплаты',
                icon: <Coin color="#fff" width={20} height={20} />,
            },
        ],
    },
    {
        label: 'Помощь',
        items: [
            {
                href: '/admin/main/support',
                label: 'Служба поддержки',
                icon: <Support color="#fff" width={20} height={20} />,
            },
        ],
    },
];

const Menu = () => {
    const pathname = usePathname();

    return (
        <aside className="w-full bg-[#E32B2B] px-4 pb-5 md:fixed md:inset-y-0 md:w-64 md:overflow-y-auto md:pr-5">
            <Link
                href="/admin/main"
                className="inline-flex rounded-md focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#E32B2B] focus-visible:outline-none"
            >
                <Image
                    src="/logo.svg"
                    width={160}
                    height={160}
                    alt="KazBus"
                    className="h-20 w-28 object-contain pl-3 md:h-40 md:w-40"
                />
            </Link>

            <nav
                aria-label="Навигация администратора"
                className="grid grid-cols-2 gap-4 md:block md:space-y-5"
            >
                {navigationGroups.map((group) => (
                    <section
                        key={group.label}
                        aria-labelledby={`menu-${group.label}`}
                    >
                        <h2
                            id={`menu-${group.label}`}
                            className="px-[14px] text-sm font-bold text-white/60"
                        >
                            {group.label}
                        </h2>
                        <ul className="mt-1 space-y-1">
                            {group.items.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== '/admin/main' &&
                                        pathname.startsWith(`${item.href}/`));

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            aria-current={
                                                isActive ? 'page' : undefined
                                            }
                                            className={`flex items-center gap-3 rounded-lg px-[14px] py-2 text-white duration-150 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#E32B2B] focus-visible:outline-none ${
                                                isActive
                                                    ? 'bg-[#FF6868]'
                                                    : 'bg-transparent'
                                            }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </nav>
        </aside>
    );
};

export default Menu;
