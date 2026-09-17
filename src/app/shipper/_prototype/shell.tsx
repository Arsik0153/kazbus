'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Building2, UserRound, ArrowUpRight } from 'lucide-react';
import { ReactNode } from 'react';
import { useStore } from './store';
const links = [
    ['/shipper/orders', 'Заказы', Package],
    ['/shipper/companies', 'Компании', Building2],
    ['/shipper/profile', 'Профиль', UserRound],
] as const;
export function Shell({ children }: { children: ReactNode }) {
    const path = usePathname();
    const { state, message } = useStore();
    return (
        <div className="shipper-app" lang="ru">
            <a className="sp-skip" href="#shipper-main">
                К содержимому
            </a>
            <aside className="sp-sidebar">
                <Link className="sp-brand" href="/shipper">
                    jol<span>cargo</span>
                    <ArrowUpRight size={20} />
                </Link>
                <p className="sp-sidebar-label">КАБИНЕТ ЗАКАЗЧИКА</p>
                <nav aria-label="Основная навигация">
                    {links.map(([url, label, Icon]) => (
                        <Link
                            key={url}
                            href={url}
                            aria-current={
                                path === url ||
                                (url === '/shipper/orders' &&
                                    (path === '/shipper' ||
                                        path.includes('/orders/') ||
                                        path.includes('create-order')))
                                    ? 'page'
                                    : undefined
                            }
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sp-account">
                    <span className="sp-avatar">
                        {state.profile.name.slice(0, 1)}
                    </span>
                    <div>
                        <strong>
                            {state.profile.company || state.profile.name}
                        </strong>
                        <p>Личный кабинет</p>
                    </div>
                </div>
            </aside>
            <div className="sp-workspace">
                <div className="sp-topline">
                    <span>
                        Jol Cargo <span className="sp-divider">/</span>{' '}
                        Клиентская логистика
                    </span>
                    <span className="sp-demo">Данные синхронизированы</span>
                </div>
                <main id="shipper-main" className="sp-main">
                    {children}
                </main>
                <div className="sp-feedback" role="status" aria-live="polite">
                    {message}
                </div>
            </div>
        </div>
    );
}
