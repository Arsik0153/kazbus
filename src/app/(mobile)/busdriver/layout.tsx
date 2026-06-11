import BusDriverBottomNav from './_components/BusDriverBottomNav';

export default function BusDriverLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="xs:mb-22.5 flex-1">{children}</div>
            <BusDriverBottomNav />
        </>
    );
}
