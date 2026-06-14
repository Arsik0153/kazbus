'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Anal from '@/assets/admin/anal';
import BusFront from '@/assets/admin/BusFront';
import Coin from '@/assets/admin/Coin';
import Direction from '@/assets/admin/Direction';
import Route from '@/assets/admin/Route';
import Support from '@/assets/admin/Support';
import User from '@/assets/admin/User';
import ArrowRight from '@/assets/admin/Arrow-right';

const getBackgroundColor = (pathname: string, url: string) => {
    return pathname === url ? 'bg-[#FF6868]' : 'bg-transparent';
};

const Menu = () => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col fixed w-1/6 pr-5">
            <Link href="/admin/main">
                <Image
                    src={'/logo.svg'}
                    width={160}
                    height={160}
                    alt={'Logo'}
                    className='pl-3'
                />
            </Link>

            <div className="flex flex-col pl-[14px] w-full">
                <nav className='flex flex-col gap-5 w-full'>
                    <ul className='w-full'>
                        <p className="font-bold text-base text-[#FFFFFF] opacity-40">Управление</p>

                        <li className={`${getBackgroundColor(pathname, '/admin/main/trips')} rounded-lg`}>
                            <Link href="/admin/main/trips" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Route color="#fff" width={20} height={20} />
                                    <span>Рейсы</span>
                                </div>
                                {pathname === '/admin/main/trips' && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                        <li className={`${getBackgroundColor(pathname, '/admin/main/buses')} rounded-lg`}>
                            <Link href="/admin/main/buses" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <BusFront color="#fff" width={20} height={20} />
                                    <span>Автобусы</span>
                                </div>
                                {pathname === '/admin/main/buses' && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                        <li className={`${getBackgroundColor(pathname, '/admin/main/drivers')} rounded-lg`}>
                            <Link href="/admin/main/drivers" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <User color="#fff" width={20} height={20} />
                                    <span>Водители</span>
                                </div>
                                {pathname === '/admin/main/drivers' && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                        <li className={`${getBackgroundColor(pathname, '/admin/main/routes')} rounded-lg`}>
                            <Link href="/admin/main/routes" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Direction color="#fff" width={20} height={20} />
                                    <span>Маршруты</span>
                                </div>
                                {pathname === '/admin/main/routes' && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                    </ul>
                    <ul>
                        <p className="font-bold text-base text-[#FFFFFF] opacity-40">Информация</p>

                        <li className={`${getBackgroundColor(pathname, '/admin/main/analytics')} rounded-lg`}>
                            <Link href="/admin/main/analytics" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Anal color="#fff" width={20} height={20} />
                                    <span>Аналитика</span>
                                </div>
                                {pathname === '/admin/main/analytics' && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                        <li className={`${getBackgroundColor(pathname, '/admin/main/payouts')} rounded-lg`}>
                            <Link href="/admin/main/payouts" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Coin color="#fff" width={20} height={20} />
                                    <span>Выплаты</span>
                                </div>
                                {pathname === '/admin/main/payouts' && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                    </ul>
                    <ul className='mt-8'>
                        <li className={`${getBackgroundColor(pathname, '/admin/main/support')} rounded-lg`}>
                            <Link href="/admin/main/support" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Support color="#fff" width={20} height={20} />
                                    <span>Служба поддержки</span>
                                </div>
                                {pathname === '/admin/main/support' && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Menu;
