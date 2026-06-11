import ShipperBottomNav from './_components/ShipperBottomNav';

export default function ShipperLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="xs:mb-22.5 flex-1">{children}</div>
            <ShipperBottomNav />
        </>
    );
}
