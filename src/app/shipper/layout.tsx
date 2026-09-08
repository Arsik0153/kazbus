import type { Metadata, Viewport } from 'next';
import { Store } from './_prototype/store';
import { Shell } from './_prototype/shell';
import './shipper.css';
export const metadata: Metadata = {
    title: 'Заказы и поставки · Jol Cargo',
    description: 'Кабинет заказчика грузоперевозок',
};
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};
export default function ShipperLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Store>
            <Shell>{children}</Shell>
        </Store>
    );
}
