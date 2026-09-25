'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Truck } from 'lucide-react';
import type { ReactNode } from 'react';
import { logoutAdminCargo } from '../(workspace)/logout';
import LogoutButton from './logout-button';
import Pulse from '@/components/admin/pulse';
import { cn } from '@/lib/utils';
import { cargoNavigation } from './navigation';

export default function CargoShell({
    children,
    name,
    company,
}: {
    children: ReactNode;
    name: string;
    company: string;
}) {
    const pathname = usePathname();
    const current =
        cargoNavigation.find((item) => item.href === pathname) ??
        cargoNavigation[0];
    return (
        <div className="flex min-h-screen w-full flex-col bg-[#E32B2B] lg:flex-row">
            <aside className="w-full shrink-0 lg:w-1/6">
                <div className="flex flex-col px-3 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto lg:pb-6">
                    <Link href="/admin-cargo" aria-label="Jol Cargo, обзор">
                        <Image
                            src="/logo.svg"
                            width={160}
                            height={160}
                            alt="Jol"
                            className="size-20 lg:size-40"
                        />
                    </Link>
                    <p className="mb-3 hidden text-base font-bold text-white/40 lg:block">
                        Управление
                    </p>
                    <nav
                        aria-label="Разделы кабинета"
                        className="flex gap-2 overflow-x-auto pb-3 lg:flex-col lg:overflow-visible"
                    >
                        {cargoNavigation.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                aria-current={
                                    pathname === href ? 'page' : undefined
                                }
                                className={cn(
                                    'flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-white transition-colors hover:bg-[#FF6868]',
                                    pathname === href && 'bg-[#FF6868]'
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <Icon className="size-5 shrink-0" />
                                    <span className="whitespace-nowrap lg:whitespace-normal">
                                        {label}
                                    </span>
                                </span>
                                {pathname === href && (
                                    <ChevronRight className="size-3 shrink-0" />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-7">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-full bg-white">
                            <Truck className="size-5 text-[#E74949]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">
                                {name || company}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <Pulse color="#21C01E" pulseRadius={5} />
                                Активен
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin-cargo/company"
                            className="hidden font-medium text-white hover:underline sm:block"
                        >
                            Редактировать данные
                        </Link>
                        <form action={logoutAdminCargo}>
                            <LogoutButton />
                        </form>
                    </div>
                </header>
                <main className="flex min-w-0 flex-1 flex-col gap-5 rounded-t-[28px] bg-[#F1F5F9] px-3 py-6 text-[#4A4A4A] md:px-7 lg:rounded-tl-[40px] lg:rounded-tr-none">
                    <div className="rounded-[20px] bg-white px-5 py-8 md:px-8">
                        <p className="text-muted-foreground mb-3 text-sm">
                            Jol Cargo · {company}
                        </p>
                        <h1 className="text-3xl font-semibold md:text-4xl">
                            {current.label === 'Обзор'
                                ? 'Дашборд перевозчика'
                                : current.label}
                        </h1>
                        <p className="text-muted-foreground mt-3 text-base">
                            {current.description}
                        </p>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
