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
    const [hideGap, setHideGap] = React.useState(false);

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

    return (
        <div
            className={`fixed bottom-0 z-10 w-full rounded-t-[10px] bg-white ${isTabbarHidden && 'pointer-events-none opacity-0'}`}
        >
            <div
                className={cn(
                    'xs:px-[15px] flex w-full items-center justify-between px-[8px]',
                    {
                        'xs:pb-[10px] xs:pt-[8px] pb-[5px] pt-[5px]': hideGap,
                        'pb-[20px] pt-[10px]': !hideGap,
                    }
                )}
            >
                {LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={
                            link.href === '/main'
                                ? '/main?passenger_count=1'
                                : link.href
                        }
                        className={clsx(
                            'xs:px-[13px] xs:pb-[15px] xs:pt-[10px] flex flex-col items-center gap-2 text-nowrap rounded-[10px] px-[10px] pb-[12px] pt-[8px]',
                            {
                                'bg-[#E23333]': pathname.startsWith(link.href),
                            }
                        )}
                    >
                        <link.icon color={getColor(link.href, pathname)} />
                        <div
                            className={clsx(
                                'text-center text-[12px] font-medium leading-[13.2px]',
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
