'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ArrowUpRight,
    Building2,
    CircleUserRound,
    MoreHorizontal,
    Package,
    Repeat2,
    UserRound,
    Warehouse,
} from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from './store';

const links = [
    ['/shipper/orders', 'Заказы', Package],
    ['/shipper/supplies', 'Поставки', Repeat2],
    ['/shipper/storage', 'На хранении', Warehouse],
    ['/shipper/companies', 'Компании', Building2],
    ['/shipper/profile', 'Профиль', UserRound],
] as const;

const mobilePrimary = links.slice(0, 3);
const mobileMore = links.slice(3);

function isActive(path: string, url: string): boolean {
    if (url === '/shipper/orders') {
        return (
            path === '/shipper' ||
            path.startsWith('/shipper/orders') ||
            path === '/shipper/create-order' ||
            path === '/shipper/tracking'
        );
    }
    return path === url;
}

export function Shell({ children }: { children: ReactNode }) {
    const path = usePathname();
    const { state, notice, dismissNotice } = useStore();
    const [moreOpen, setMoreOpen] = useState(false);
    const moreButton = useRef<HTMLButtonElement>(null);
    const firstMoreLink = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (moreOpen) firstMoreLink.current?.focus();
    }, [moreOpen]);

    useEffect(() => {
        setMoreOpen(false);
    }, [path]);

    useEffect(() => {
        if (!moreOpen) return;
        function closeOnEscape(event: KeyboardEvent) {
            if (event.key !== 'Escape') return;
            setMoreOpen(false);
            moreButton.current?.focus();
        }
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [moreOpen]);

    return (
        <div className="shipper-app" lang="ru">
            <a className="sp-skip" href="#shipper-main">
                К содержимому
            </a>
            <header className="sp-mobile-header">
                <Link className="sp-mobile-brand" href="/shipper">
                    jol<span>cargo</span>
                </Link>
                <span>Кабинет заказчика</span>
            </header>
            <aside className="sp-sidebar">
                <Link className="sp-brand" href="/shipper">
                    jol<span>cargo</span>
                    <ArrowUpRight size={20} />
                </Link>
                <p className="sp-sidebar-label">КАБИНЕТ ЗАКАЗЧИКА</p>
                <nav className="sp-desktop-nav" aria-label="Основная навигация">
                    {links.map(([url, label, Icon]) => (
                        <Link
                            key={url}
                            href={url}
                            aria-label={label}
                            aria-current={
                                isActive(path, url) ? 'page' : undefined
                            }
                            onClick={() => setMoreOpen(false)}
                        >
                            <Icon aria-hidden="true" size={20} />
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>
                <nav className="sp-mobile-nav" aria-label="Основная навигация">
                    {mobilePrimary.map(([url, label, Icon]) => (
                        <Link
                            key={url}
                            href={url}
                            aria-label={label}
                            aria-current={
                                isActive(path, url) ? 'page' : undefined
                            }
                            onClick={() => setMoreOpen(false)}
                        >
                            <Icon aria-hidden="true" size={21} />
                            <span>{label}</span>
                        </Link>
                    ))}
                    <button
                        ref={moreButton}
                        type="button"
                        className={
                            mobileMore.some(([url]) => isActive(path, url))
                                ? 'sp-more-active'
                                : undefined
                        }
                        aria-label="Ещё разделы"
                        aria-expanded={moreOpen}
                        aria-controls="shipper-more-menu"
                        onClick={() => setMoreOpen((open) => !open)}
                    >
                        <MoreHorizontal aria-hidden="true" size={21} />
                        <span>Ещё</span>
                    </button>
                </nav>
                {moreOpen && (
                    <nav
                        id="shipper-more-menu"
                        className="sp-more-menu"
                        aria-label="Дополнительная навигация"
                    >
                        {mobileMore.map(([url, label, Icon], index) => (
                            <Link
                                ref={index === 0 ? firstMoreLink : undefined}
                                key={url}
                                href={url}
                                aria-current={
                                    isActive(path, url) ? 'page' : undefined
                                }
                                onClick={() => setMoreOpen(false)}
                            >
                                <Icon aria-hidden="true" size={20} />
                                {label}
                            </Link>
                        ))}
                    </nav>
                )}
                <div className="sp-account">
                    <span className="sp-avatar">
                        <CircleUserRound aria-hidden="true" size={20} />
                    </span>
                    <div>
                        <strong>
                            {state.profile.company || state.profile.name}
                        </strong>
                        <p>Демо · данные в браузере</p>
                    </div>
                </div>
            </aside>
            <div className="sp-workspace">
                <main id="shipper-main" className="sp-main">
                    {children}
                </main>
                {notice && (
                    <div
                        className={`sp-feedback sp-feedback-${notice.kind}`}
                        role={notice.kind === 'error' ? 'alert' : 'status'}
                        aria-live={
                            notice.kind === 'error' ? 'assertive' : 'polite'
                        }
                    >
                        <span>{notice.text}</span>
                        <button
                            type="button"
                            aria-label="Закрыть уведомление"
                            onClick={dismissNotice}
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
