'use client';
import React, { useEffect, useState } from 'react';
import Bus from '../assets/bus';
import Building from '../assets/building';
import Coupon from '../assets/coupon';
import User from '../assets/user';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const getColor = (pathname: string, url: string) => {
    return url.startsWith(pathname) ? '#D21F1F' : '#C8C8C8';
};

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
            className={`fixed bottom-0 z-10 w-full bg-white ${isTabbarHidden && 'hidden'}`}
        >
            <div className="flex w-full items-center justify-between p-5">
                <Link href="/main" className="flex flex-col items-center gap-2">
                    <Bus color={getColor('/main', pathname)} />
                    <div
                        className={`text-[12px] font-normal leading-[13.2px] text-[${getColor('/main', pathname)}]`}
                    >
                        Поиск
                    </div>
                </Link>
                <Link
                    href="/directions"
                    className="flex flex-col items-center gap-2"
                >
                    <Building color={getColor('/directions', pathname)} />
                    <div
                        className={`text-[12px] font-normal leading-[13.2px] text-[${getColor('/directions', pathname)}]`}
                    >
                        Направления
                    </div>
                </Link>
                <Link
                    href="/my-tickets"
                    className="flex flex-col items-center gap-2"
                >
                    <Coupon color={getColor('/my-tickets', pathname)} />
                    <div
                        className={`text-[12px] font-normal leading-[13.2px] text-[${getColor('/my-tickets', pathname)}]`}
                    >
                        Мои билеты
                    </div>
                </Link>
                <Link
                    href="/profile"
                    className="flex flex-col items-center gap-2"
                >
                    <User color={getColor('/profile', pathname)} />
                    <div
                        className={`text-[12px] font-normal leading-[13.2px] text-[${getColor('/profile', pathname)}]`}
                    >
                        Профиль
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default NavBar;
