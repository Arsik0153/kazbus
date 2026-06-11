'use client';
import React, { useEffect, useState } from 'react';
import Bus from '../assets/bus';
import Building from '../assets/building';
import Coupon from '../assets/coupon';
import User from '../assets/user';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { cn } from '@/utils/cn';
import RouteFill from '@/assets/route-fill';

type NavSection = 'bus' | 'cargo';

type NavItem = {
    href: string;
    icon: React.ComponentType<{ color?: string }>;
    text: string;
};

const BUS_LINKS: NavItem[] = [
    {
        href: '/bus/main',
        icon: Bus,
        text: 'Поиск',
    },
    {
        href: '/bus/directions',
        icon: Building,
        text: 'Направления',
    },
    {
        href: '/bus/my-tickets',
        icon: Coupon,
        text: 'Мои билеты',
    },
    {
        href: '/bus/profile',
        icon: User,
        text: 'Профиль',
    },
];

const CARGO_LINKS: NavItem[] = [
    {
        href: '/cargo',
        icon: Bus,
        text: 'Главная',
    },
    {
        href: '/cargo/trip',
        icon: RouteFill,
        text: 'Рейс',
    },
    {
        href: '/cargo/map',
        icon: Building,
        text: 'Карта',
    },
    {
        href: '/cargo/documents',
        icon: Coupon,
        text: 'Документы',
    },
    {
        href: '/cargo/profile',
        icon: User,
        text: 'Профиль',
    },
];

const getColor = (isActive: boolean) => (isActive ? '#FFF' : '#C8C8C8');

const isRouteActive = (pathname: string, href: string) => {
    if (href === '/cargo') {
        return pathname === href;
    }

    return pathname.startsWith(href);
};

const NavBar = ({ section }: { section: NavSection }) => {
    const pathname = usePathname();
    const [isTabbarHidden, setIsTabbarHidden] = useState(false);
    const [hideGap, setHideGap] = React.useState(false);
    const links = section === 'cargo' ? CARGO_LINKS : BUS_LINKS;
    const shouldHideForPath =
        section === 'cargo' &&
        (pathname === '/cargo/login' || pathname === '/cargo/registration');

    useEffect(() => {
        const gap = !!localStorage.getItem('hideGap');
        setHideGap(gap);
    }, []);

    useEffect(() => {
        const handleFocus = (event: FocusEvent) => {
            if (
                (event.target as HTMLElement).classList.contains('hide-tabbar')
            ) {
                setIsTabbarHidden(true);
            }
        };

        const handleBlur = (event: FocusEvent) => {
            if (
                (event.target as HTMLElement).classList.contains('hide-tabbar')
            ) {
                setIsTabbarHidden(false);
            }
        };

        document.addEventListener('focusin', handleFocus as EventListener);
        document.addEventListener('focusout', handleBlur as EventListener);

        return () => {
            document.removeEventListener(
                'focusin',
                handleFocus as EventListener
            );
            document.removeEventListener(
                'focusout',
                handleBlur as EventListener
            );
        };
    }, []);

    if (shouldHideForPath) {
        return null;
    }

    return (
        <div
            className={`fixed bottom-0 z-10 w-full rounded-t-[10px] bg-white ${isTabbarHidden && 'pointer-events-none opacity-0'}`}
        >
            <div
                className={cn(
                    'flex w-full items-center justify-between px-[8px] xs:px-[15px]',
                    {
                        'pb-[5px] pt-[5px] xs:pb-[10px] xs:pt-[8px]': hideGap,
                        'pb-[20px] pt-[10px]': !hideGap,
                    }
                )}
            >
                {links.map((link) => {
                    const isActive = isRouteActive(pathname, link.href);
                    const targetHref =
                        link.href === '/bus/main'
                            ? '/bus/main?passenger_count=1'
                            : link.href;

                    return (
                        <Link
                            key={link.href}
                            href={targetHref}
                            className={clsx(
                                'flex min-w-0 flex-1 flex-col items-center gap-2 rounded-[10px] px-[6px] pb-[12px] pt-[8px] xs:px-[12px] xs:pb-[15px] xs:pt-[10px]',
                                {
                                    'bg-[#E23333]': isActive,
                                }
                            )}
                        >
                            <link.icon color={getColor(isActive)} />
                            <div
                                className={clsx(
                                    'text-center text-[10px] font-medium leading-[11px] xs:text-[12px] xs:leading-[13.2px]',
                                    {
                                        'text-white': isActive,
                                        'text-[#C8C8C8]': !isActive,
                                    }
                                )}
                            >
                                {link.text}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default NavBar;
