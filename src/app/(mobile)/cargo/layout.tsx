import NavBar from '@/components/nav-bar';

export default function CargoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="xs:mb-22.5 min-w-0 flex-1 text-[#4a4a4a] [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50">
                {children}
            </div>
            <NavBar section="cargo" />
        </>
    );
}
