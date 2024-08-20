'use client';
import React, { useEffect, useState } from 'react';
import Bus from '../assets/bus';
import Building from '../assets/building';
import Coupon from '../assets/coupon';
import User from '../assets/user';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

const getColor = (pathname: string, url: string) => {
    return url.startsWith(pathname) ? '#FFF' : '#C8C8C8';
};

const LINKS = [
    {
        href: '/main',
        icon: Bus,
        text: 'Поиск',
    },
    {
        href: '/directions',
        icon: Building,
        text: 'Направления',
    },
    {
        href: '/my-tickets',
        icon: Coupon,
        text: 'Мои билеты',
    },
    {
        href: '/profile',
        icon: User,
        text: 'Профиль',
    },
];

const NavBar = () => {
    const pathname = usePathname();
    const [isTabbarHidden, setIsTabbarHidden] = useState(false);

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

    return (
        <div
            className={`fixed bottom-0 z-10 w-full rounded-t-[10px] bg-white ${isTabbarHidden && 'pointer-events-none opacity-0'}`}
        >
            <div className="flex w-full items-center justify-between px-[15px] pb-[20px] pt-[10px]">
                {LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={
                            link.href === '/main'
                                ? '/main?passenger_count=1'
                                : link.href
                        }
                        className={clsx(
                            'flex flex-col items-center gap-2 rounded-[10px] px-[13px] pb-[15px] pt-[10px]',
                            {
                                'bg-[#E23333]': pathname.startsWith(link.href),
                            }
                        )}
                    >
                        <link.icon color={getColor(link.href, pathname)} />
                        <div
                            className={clsx(
                                'text-[12px] font-medium leading-[13.2px]',
                                {
                                    'text-white': pathname.startsWith(
                                        link.href
                                    ),
                                    'text-[#C8C8C8]': !pathname.startsWith(
                                        link.href
                                    ),
                                }
                            )}
                        >
                            {link.text}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default NavBar;
