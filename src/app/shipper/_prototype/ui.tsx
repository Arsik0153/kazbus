'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OrderStatus, statuses } from './model';
export function Heading({
    eyebrow,
    title,
    children,
    action,
}: {
    eyebrow?: string;
    title: string;
    children?: ReactNode;
    action?: ReactNode;
}) {
    return (
        <header className="sp-heading">
            <div>
                {eyebrow && <p className="sp-eyebrow">{eyebrow}</p>}
                <h1>{title}</h1>
                {children && <p className="sp-muted">{children}</p>}
            </div>
            {action}
        </header>
    );
}
export function Status({ status }: { status: OrderStatus }) {
    return (
        <span className={`sp-status sp-status-${status}`}>
            {statuses[status]}
        </span>
    );
}
export function Empty({ children }: { children: ReactNode }) {
    return <div className="sp-empty">{children}</div>;
}
export function Back() {
    const searchParams = useSearchParams();
    const query = searchParams.toString();
    return (
        <Link
            className="sp-back"
            href={query ? `/shipper/orders?${query}` : '/shipper/orders'}
        >
            ← Все заказы
        </Link>
    );
}
export function Field({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="sp-field">
            <span>{label}</span>
            {children}
        </label>
    );
}
export function Section({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="sp-section">
            <h2>{title}</h2>
            {children}
        </section>
    );
}
