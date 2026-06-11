import NavBar from '@/components/nav-bar';

export default function CargoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="xs:mb-22.5 flex-1">{children}</div>
            <NavBar section="cargo" />
        </>
    );
}
