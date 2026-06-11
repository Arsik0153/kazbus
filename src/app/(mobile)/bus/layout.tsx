import NavBar from '@/components/nav-bar';

export default function BusLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex-1 xs:mb-[90px]">{children}</div>
            <NavBar section="bus" />
        </>
    );
}
