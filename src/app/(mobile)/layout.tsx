import NavBar from '@/components/nav-bar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className="flex min-h-[100dvh] items-stretch bg-[var(--bg)]"
            vaul-drawer-wrapper=""
        >
            <div className="mb-[90px] flex-1">{children}</div>
            <NavBar />
        </div>
    );
}
