'use client';

import React, { useEffect, useState } from 'react';
import Building from '@/assets/building';
import Coupon from '@/assets/coupon';
import Plus from '@/assets/plus';
import RouteFill from '@/assets/route-fill';
import User from '@/assets/user';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
    href: string;
    text: string;
    icon: (color: string) => React.ReactNode;
};

const SHIPPER_LINKS: NavItem[] = [
    {
        href: '/shipper',
        text: 'Главная',
        icon: (color) => <Building color={color} />,
    },
    {
        href: '/shipper/orders',
        text: 'Заявки',
        icon: (color) => <Coupon color={color} />,
    },
    {
        href: '/shipper/create-order',
        text: 'Создать',
        icon: (color) => <Plus color={color} width={20} height={20} />,
    },
    {
        href: '/shipper/tracking',
        text: 'Трекинг',
        icon: (color) => <RouteFill color={color} />,
    },
    {
        href: '/shipper/profile',
        text: 'Профиль',
        icon: (color) => <User color={color} />,
    },
];

const HIDDEN_PATHS = ['/shipper/login', '/shipper/registration'];

const getNavIconColor = (isActive: boolean) =>
    isActive ? '#E23333' : '#C8C8C8';

const isRouteActive = (pathname: string, href: string) => {
    if (href === '/shipper') {
        return pathname === href;
    }

    return pathname.startsWith(href);
};

const ShipperBottomNav = () => {
    const pathname = usePathname();
    const [isTabbarHidden, setIsTabbarHidden] = useState(false);
    const [hideGap, setHideGap] = useState(false);

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

    if (HIDDEN_PATHS.includes(pathname)) {
        return null;
    }

    return (
        <div
            className={cn(
                'fixed bottom-0 z-10 w-full rounded-t-[0.625rem] bg-white',
                {
                    'pointer-events-none opacity-0': isTabbarHidden,
                }
            )}
        >
            <div
                className={cn(
                    'flex w-full items-center justify-between px-2 xs:px-[0.9375rem]',
                    {
                        'pb-[0.3125rem] pt-[0.3125rem] xs:pb-[0.625rem] xs:pt-2':
                            hideGap,
                        'pb-5 pt-2.5': !hideGap,
                    }
                )}
            >
                {SHIPPER_LINKS.map((link) => {
                    const isActive = isRouteActive(pathname, link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-[0.625rem] px-1.5 pb-3 pt-2 xs:px-3 xs:pb-[0.9375rem] xs:pt-2.5"
                        >
                            {link.icon(getNavIconColor(isActive))}
                            <span
                                className={cn(
                                    'xs:leading-3.3 text-center text-[0.625rem] font-medium leading-[0.6875rem] xs:text-xs',
                                    {
                                        'text-[#E23333]': isActive,
                                        'text-[#C8C8C8]': !isActive,
                                    }
                                )}
                            >
                                {link.text}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ShipperBottomNav;
