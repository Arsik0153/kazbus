'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, FileText, MapPinned } from 'lucide-react';
import Anal from '@/assets/admin/anal';
import BusFront from '@/assets/admin/BusFront';
import Coin from '@/assets/admin/Coin';
import Direction from '@/assets/admin/Direction';
import Route from '@/assets/admin/Route';
import Support from '@/assets/admin/Support';
import User from '@/assets/admin/User';
import ArrowRight from '@/assets/admin/Arrow-right';

const isActivePath = (pathname: string, url: string) => {
    return pathname === url || pathname.startsWith(`${url}/`);
};

const getBackgroundColor = (pathname: string, url: string) => {
    return isActivePath(pathname, url) ? 'bg-[#FF6868]' : 'bg-transparent';
};

const Menu = () => {
    const pathname = usePathname();

    return (
        <div className="relative flex w-full flex-col lg:fixed lg:w-1/6 lg:pr-5">
            <Link href="/admin/main">
                <Image
                    src={'/logo.svg'}
                    width={160}
                    height={160}
                    alt={'Logo'}
                    className='h-20 w-20 pl-3 lg:h-40 lg:w-40'
                />
            </Link>

            <div className="flex w-full flex-col px-3 lg:pl-[14px] lg:pr-0">
                <nav className='flex w-full gap-3 overflow-x-auto pb-3 lg:flex-col lg:gap-5 lg:overflow-visible lg:pb-0'>
                    <ul className='flex shrink-0 gap-2 lg:block lg:w-full'>
                        <li className="hidden font-bold text-base text-[#FFFFFF] opacity-40 lg:block">Управление</li>

                        <li className={`${getBackgroundColor(pathname, '/admin/main/trips')} rounded-lg`}>
                            <Link href="/admin/main/trips" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Route color="#fff" width={20} height={20} />
                                    <span>Рейсы</span>
                                </div>
                                {isActivePath(pathname, '/admin/main/trips') && (
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
                                {isActivePath(pathname, '/admin/main/buses') && (
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
                                {isActivePath(pathname, '/admin/main/drivers') && (
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
                                {isActivePath(pathname, '/admin/main/routes') && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                    </ul>
                    <ul className='flex shrink-0 gap-2 lg:block'>
                        <li className="hidden font-bold text-base text-[#FFFFFF] opacity-40 lg:block">Компания</li>

                        <li className={`${getBackgroundColor(pathname, '/admin/main/company')} rounded-lg`}>
                            <Link href="/admin/main/company" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Building2 className="h-5 w-5" />
                                    <span>Профиль компании</span>
                                </div>
                                {isActivePath(pathname, '/admin/main/company') && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                        <li className={`${getBackgroundColor(pathname, '/admin/main/documents')} rounded-lg`}>
                            <Link href="/admin/main/documents" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <FileText className="h-5 w-5" />
                                    <span>Документы</span>
                                </div>
                                {isActivePath(pathname, '/admin/main/documents') && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                        <li className={`${getBackgroundColor(pathname, '/admin/main/monitoring')} rounded-lg`}>
                            <Link href="/admin/main/monitoring" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <MapPinned className="h-5 w-5" />
                                    <span>Мониторинг</span>
                                </div>
                                {isActivePath(pathname, '/admin/main/monitoring') && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                    </ul>
                    <ul className='flex shrink-0 gap-2 lg:block'>
                        <li className="hidden font-bold text-base text-[#FFFFFF] opacity-40 lg:block">Информация</li>

                        <li className={`${getBackgroundColor(pathname, '/admin/main/analytics')} rounded-lg`}>
                            <Link href="/admin/main/analytics" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Anal color="#fff" width={20} height={20} />
                                    <span>Аналитика</span>
                                </div>
                                {isActivePath(pathname, '/admin/main/analytics') && (
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
                                {isActivePath(pathname, '/admin/main/payouts') && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                    </ul>
                    <ul className='flex shrink-0 gap-2 lg:mt-8 lg:block'>
                        <li className={`${getBackgroundColor(pathname, '/admin/main/support')} rounded-lg`}>
                            <Link href="/admin/main/support" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Support color="#fff" width={20} height={20} />
                                    <span>Обращения водителей</span>
                                </div>
                                {isActivePath(pathname, '/admin/main/support') && (
                                    <ArrowRight color="#fff" width={12} height={12} />
                                )}
                            </Link>
                        </li>
                        <li className={`${getBackgroundColor(pathname, '/admin/main/passenger-support')} rounded-lg`}>
                            <Link href="/admin/main/passenger-support" className='flex justify-between items-center pr-4 pl-[14px] duration-150 py-2 text-white'>
                                <div className='flex items-center gap-3'>
                                    <Support color="#fff" width={20} height={20} />
                                    <span>Обращения пассажиров</span>
                                </div>
                                {isActivePath(pathname, '/admin/main/passenger-support') && (
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
